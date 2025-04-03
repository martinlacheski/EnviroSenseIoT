import json
import logging
import os
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
from aws_config import AWS_ENDPOINT, MQTT_CLIENT_ID

# Configurar logging para ver errores detallados
logger = logging.getLogger("AWSIoTPythonSDK.core")
logger.setLevel(logging.DEBUG)
streamHandler = logging.StreamHandler()
logger.addHandler(streamHandler)

# Configuración de certificados
CERTS_DIR = os.getenv("CERTS_DIR", "./certificates")
ROOT_CRT = os.path.join(CERTS_DIR, "root.crt")
CLIENT_CRT = os.path.join(CERTS_DIR, "client.crt")
CLIENT_KEY = os.path.join(CERTS_DIR, "client.key")

# Verificar si los archivos existen
for cert in [ROOT_CRT, CLIENT_CRT, CLIENT_KEY]:
    if not os.path.exists(cert):
        raise FileNotFoundError(f"El archivo {cert} no fue encontrado.")
    
# Método para procesar mensajes de sensores y actuadores
def process_sensor_message(topic, payload):
    sensor_code = payload.get("sensor_code", "Desconocido")
    interval = payload.get("interval", "No definido")

    print(f"Mensaje recibido desde {topic}")
    print(f"Sensor: {sensor_code}, Intervalo: {interval}")

    if str(interval) == "OK":
        print("Intervalo válido, procesando datos...")
    else:
        print("Error al establecer el intervalo de tiempo.")

# Función de callback para manejar los mensajes recibidos
def customCallback(client, userdata, message):
    topic = message.topic
    payload_str = message.payload.decode()

    print(f"Mensaje recibido desde {topic}: {payload_str}")
    try:
        # Intentar cargar el payload como JSON
        payload = json.loads(payload_str)
    except json.JSONDecodeError:
        print("Error al decodificar el mensaje JSON.")
        return
    except Exception as e:
        print(f"Error inesperado: {e}")
        return
    # Acciones específicas según el tema
    if topic == "environmental/sensor/pub":
        print("Procesando mensaje de sensor ambiental...")
    elif topic == "nutrient_solution/sensor/pub":
        print("Procesando mensaje de solución nutritiva...")
    elif topic == "consumption/sensor/pub":
        print("Procesando mensaje de consumo...")
    elif topic == "actuators/pub":
        print("Procesando mensaje de actuador...")
    # Interpretar la respuesta del dispositivo IoT
    elif topic == "environmental/sensor/sub":
        process_sensor_message(topic, payload)
    elif topic == "nutrient_solution/sensor/sub":
        process_sensor_message(topic, payload)
    elif topic == "consumption/sensor/sub":
        process_sensor_message(topic, payload)
    elif topic == "actuators/sub":
        process_sensor_message(topic, payload)
    elif topic == "general/inbound":
        print("Procesando mensaje general...")

# Configurar el cliente MQTT
myMQTTClient = AWSIoTMQTTClient(MQTT_CLIENT_ID)
myMQTTClient.configureEndpoint(AWS_ENDPOINT, 8883)
myMQTTClient.configureCredentials(ROOT_CRT, CLIENT_KEY, CLIENT_CRT)

# Agregar tiempo de espera más largo para la conexión
myMQTTClient.configureConnectDisconnectTimeout(10)

# Conectar y suscribirse
print("Intentando conectar...")
myMQTTClient.connect()
print("Cliente Conectado")

# Suscribirse con la función customCallback
myMQTTClient.subscribe("#", 1, customCallback)
print("Esperando mensajes... Presiona Enter para salir.")
input()

# Desuscribirse y desconectar
myMQTTClient.unsubscribe("#")
print("Cliente Desuscrito")

myMQTTClient.disconnect()
print("Cliente Desconectado")
