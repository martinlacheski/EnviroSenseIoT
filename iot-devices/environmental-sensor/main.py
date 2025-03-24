from machine import Pin, SoftI2C, Timer, reset
import config
import lib.wifimgr as wifimgr
import lib.bme280 as bme280
import lib.bh1750 as bh1750
import lib.mhz19 as mhz19
from lib.robust import MQTTClient
import EnvironmentalSensor.config as config
import network
import ntptime
import ssl
import time
import json
import uos
import gc
import sys


# Configuración inicial
CONFIG_FILE = "interval.conf"
WIFI_FILE = "wifi.dat"
DEFAULT_INTERVAL = 5
sensor_interval = DEFAULT_INTERVAL
sensor_data = {}  # Diccionario para datos de sensores

# Configurar botón BOOT (GPIO0) con pull-up
boot_button = Pin(0, Pin.IN, Pin.PULL_UP)
led = Pin(2, Pin.OUT) # LED azul en GPIO2 (común en ESP32)

# Inicialización de sensores
i2c_bme280 = SoftI2C(scl=Pin(19), sda=Pin(18), freq=400000)
bme280 = bme280.BME280(i2c=i2c_bme280)

i2c_bh1750 = SoftI2C(scl=Pin(22), sda=Pin(21), freq=400000)
bh1750 = bh1750.BH1750(i2c_bh1750)

mhz19 = mhz19.MHZ19(2)  # UART2

# Variables globales
wlan = None
wifi_connected = False
last_led_toggle = time.ticks_ms()
led_state = False
mqtt_client = None

# Metodo para conectar Wi-Fi
def connect_wifi():
    global wlan, wifi_connected
    print("Iniciando conexión Wi-Fi...")
    wlan = wifimgr.get_connection()
    time.sleep(1)
    return wlan is not None and wlan.isconnected()

# Metodo para sincronizar tiempo con NTP
def sync_time(max_retries=5):
    for _ in range(max_retries):
        try:
            ntptime.host = "time.google.com"  # Servidor alternativo
            ntptime.settime()
            print("Hora sincronizada:", time.localtime())
            return
        except OSError as e:
            print("Error sincronizando hora:", e)
            time.sleep(2)
    raise RuntimeError("No se pudo sincronizar la hora")

# Carga de certificados
with open("aws/client.key", "rb") as f:
    CLIENT_KEY = f.read()
with open("aws/client.crt", "rb") as f:
    CLIENT_CRT = f.read()
# .cer file is DER format from https://www.amazontrust.com/repository/
with open("aws/root.crt", "rb") as f:
    ROOT_CRT = f.read()

# Configuración de conexión MQTT
context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
context.verify_mode = ssl.CERT_REQUIRED
context.load_cert_chain(CLIENT_CRT, CLIENT_KEY)
context.load_verify_locations(cadata=ROOT_CRT)

# Creación de cliente MQTT
mqtt_client = MQTTClient(
    client_id=config.AWS_CLIENT_ID,
    server=config.AWS_ENDPOINT,
    port=8883,
    keepalive=5000,
    ssl=context,
)

# Callback para mensajes entrantes (Seteo de nuevo intervalo)
def subscription_cb(topic, message):
    print("\nMensaje recibido:")
    print("Tópico:", topic.decode("utf-8"))
    print("Mensaje:", message.decode("utf-8"))
    print("-------------------")
    
    try:
        msg = json.loads(message.decode("utf-8"))
        
        # Verificar si el mensaje es para este sensor
        if msg.get("sensor_code") != config.SENSOR_CODE:
            return
        
        new_interval = msg.get("interval")
        
        # Validar intervalo
        if isinstance(new_interval, int) and 1 <= new_interval <= 86400:
            global sensor_interval, timer
            
            # Actualizar y guardar intervalo
            sensor_interval = new_interval
            if save_interval(sensor_interval):
                # Reconfigurar timer
                timer.deinit()
                timer.init(period=sensor_interval*1000, mode=Timer.PERIODIC, callback=lambda t: leer_sensores())
                print("Intervalo actualizado:", sensor_interval)
                
                # Enviar confirmación
                response = {
                    "sensor_code": config.SENSOR_CODE,
                    "interval": "OK"
                }
                mqtt_client.publish(config.AWS_TOPIC_SUB, json.dumps(response), qos=0)
                
    except Exception as e:
        print("Error procesando mensaje:", e)

# Metodo para reiniciar el dispositivo 
def check_boot_button():
    if boot_button.value() == 0:  
        time.sleep(0.1)  # Esperar 100ms para confirmar pulsación
        if boot_button.value() == 0:  # Si sigue presionado, iniciar conteo
            print("\nBotón BOOT detectado - Iniciando conteo...")
            start_time = time.ticks_ms()
            pressed = True
            while time.ticks_diff(time.ticks_ms(), start_time) < 3000:
                if boot_button.value() == 1:
                    pressed = False
                    break
                time.sleep_ms(100)
            
            if pressed:
                print("\n--- RESETEO DE CONFIGURACIÓN ---")
                try:
                    uos.remove(WIFI_FILE)
                    print(f"Archivo {WIFI_FILE} eliminado")
                except OSError as e:
                    print(f"Error eliminando el archivo: {e}")
                
                print("Reiniciando dispositivo...\n")
                time.sleep(1)
                reset()
            else:
                print("Reset cancelado")
    return False


def load_interval():
    try:
        with open(CONFIG_FILE, 'r') as f:
            return int(f.read())
    except:
        return DEFAULT_INTERVAL

def save_interval(value):
    try:
        with open(CONFIG_FILE, 'w') as f:
            f.write(str(value))
        return True
    except:
        return False

def leer_sensores(new_interval=None):
    global sensor_interval, timer, mqtt_client
    
    if new_interval is not None and 1 <= new_interval <= 86400:
        sensor_interval = new_interval
        save_interval(sensor_interval)
        print("Nuevo intervalo:", sensor_interval)
        timer.deinit()
        timer.init(period=sensor_interval*1000, mode=Timer.PERIODIC, callback=lambda t: leer_sensores())

    try:
        lux = bh1750.luminance(bh1750.CONT_HIRES_1)
        temp, press, hum = bme280.read_compensated_data()
        mhz19.get_data()
        
        sensor_data.update({
            "sensor_code": config.SENSOR_CODE,
            "temperature": round(temp, 2),
            "humidity": round(hum, 2),
            "atmospheric_pressure": round(press / 100, 2),
            "luminosity": round(lux, 2),
            "co2": mhz19.ppm,
        })
        
        print("Datos:", json.dumps(sensor_data))
        
        # Enviar por MQTT si está conectado
        mqtt_client.publish(topic=config.AWS_TOPIC_PUB, msg=json.dumps(sensor_data), qos=0)
        print("Mensaje publicado")
        
    except Exception as e:
        print("Error en la lectura de los sensores:", e)

# Código principal
try:
    led.off()  # Comenzar con LED apagado
    wifi_connected = False
    last_led_toggle = time.ticks_ms()
    
    # Intento inicial de conexión
    wifi_connected = connect_wifi()
    
    # Llama a sync_time después de conectar el WiFi:
    sync_time()
    
    # Conexión al servidor AWS IoT Core
    print("Intentando conectar a AWS IoT Core")
    mqtt_client.connect()
    print("Conectado a AWS IoT Core")
    
    # Suscribirse a topic de MQTT
    try:
        mqtt_client.set_callback(subscription_cb)
        mqtt_client.subscribe(config.AWS_TOPIC_SUB)
    except Exception as e:
        print("Error al suscribirse:", e)
        
    # Configuración inicial
    sensor_interval = load_interval()
    print("Intervalo de envío de datos:", sensor_interval, "segundos")
    
    # Configurar timer y leer sensores y liberar memoria
    timer = Timer(-1)
    gc.collect()
    timer.init(period=sensor_interval*1000, mode=Timer.PERIODIC, callback=lambda t: leer_sensores())
    gc.collect()
    
    # Bucle principal
    while True:
        try:
            # Control del LED
            if not wifi_connected:
                # Parpadeo rápido (500ms)
                if time.ticks_diff(time.ticks_ms(), last_led_toggle) >= 500:
                    led.value(not led.value())
                    last_led_toggle = time.ticks_ms()
            else:
                led.on()  # LED fijo cuando hay conexión
            
            # Verificar botón de reset
            if check_boot_button():
                # Cerrar conexión MQTT
                if mqtt_client is not None:
                    mqtt_client.disconnect()
                # Reiniciar dispositivo
                reset()
                
            # Mantener conexión WiFi
            if not wifi_connected or (wlan is not None and not wlan.isconnected()):
                wifi_connected = connect_wifi()
                if not wifi_connected:
                    time.sleep(1)  # Esperar antes de reintentar
                
            #Chequear mensajes MQTT
            mqtt_client.check_msg()
            
            time.sleep(0.1)
            
        except Exception as e:
            print("Error en loop principal:", e)
            time.sleep(1)
except Exception as e:
    sys.print_exception(e)
    time.sleep(2)
    reset()
    
except KeyboardInterrupt:
    print("\nPrograma detenido por el usuario")
    timer.deinit()
    led.off()
    reset()

