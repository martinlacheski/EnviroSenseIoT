import asyncio
import threading
import json
import os
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
from models.sensor_environmental_data import EnvironmentalSensorData
from mqtt.aws_config import AWS_ENDPOINT, MQTT_CLIENT_ID

# Función para guardar datos en la base de datos en un nuevo loop
def save_sensor_data(payload, loop):
    try:
        future = asyncio.run_coroutine_threadsafe(insert_sensor_data(payload), loop)
        future.result()  # Bloquea hasta que la tarea termine
    except Exception as e:
        print(f"❌ Error al guardar datos en la base de datos: {e}")


# Método asíncrono para insertar datos en la base de datos
async def insert_sensor_data(payload):
    try:
        sensor_data = EnvironmentalSensorData(**payload)
        await sensor_data.insert()
        print("✅ Datos guardados en la base de datos.")
    except Exception as e:
        print(f"❌ Error al guardar datos en la base de datos: {e}")

# Método para procesar mensajes de sensores y actuadores
async def process_sensor_message_pub(topic, payload, loop):
    try:
        print(f"📩 Mensaje recibido desde {topic}")
        print(f"Data: {payload}")

        if topic in [
            "environmental/sensor/pub",
            "nutrient_solution/sensor/pub",
            "consumption/sensor/pub",
            "actuators/pub",
        ]:
            print(f"📩 Mensaje desde {topic}")

            # Ejecutar en el loop de asyncio
            loop.call_soon_threadsafe(asyncio.create_task, insert_sensor_data(payload))
            
    except Exception as e:
        print(f"❌ Error inesperado: {e}")


# Método para procesar mensajes de control de sensores
def process_sensor_message_sub(topic, payload):
    try:
        sensor_code = payload.get("sensor_code")
        interval = payload.get("interval")

        print(f"📩 Mensaje recibido desde {topic}")
        print(f"Sensor: {sensor_code}, Intervalo: {interval}")

        if str(interval) == "OK":
            print("✅ Nuevo intervalo de tiempo establecido")
        else:
            print("❌ Error al establecer el intervalo de tiempo.")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")

class AWSMQTTClient:
    def __init__(self):
        # Configuración de certificados
        CERTS_DIR = os.getenv("CERTS_DIR", "mqtt/certificates")
        self.ROOT_CRT = os.path.join(CERTS_DIR, "root.crt")
        self.CLIENT_CRT = os.path.join(CERTS_DIR, "client.crt")
        self.CLIENT_KEY = os.path.join(CERTS_DIR, "client.key")

        # Crear un nuevo event loop en un hilo separado
        self.loop = asyncio.new_event_loop()
        self.thread = threading.Thread(target=self.start_loop, daemon=True)
        self.thread.start()

        # Verificar si los archivos de certificados existen
        for cert in [self.ROOT_CRT, self.CLIENT_CRT, self.CLIENT_KEY]:
            if not os.path.exists(cert):
                raise FileNotFoundError(f"El archivo {cert} no fue encontrado.")

        # Configurar cliente MQTT
        self.client = AWSIoTMQTTClient(MQTT_CLIENT_ID)
        self.client.configureEndpoint(AWS_ENDPOINT, 8883)
        self.client.configureCredentials(self.ROOT_CRT, self.CLIENT_KEY, self.CLIENT_CRT)
        self.client.configureConnectDisconnectTimeout(10)

    # Mantener el loop corriendo en un hilo separado
    def start_loop(self):
        asyncio.set_event_loop(self.loop)
        self.loop.run_forever()

    # Conectar al cliente MQTT
    def connect(self):
        print("🚀 Estableciendo conexión con AWS IoT Core.")
        self.client.connect()
        print("🔄 Cliente MQTT Conectado.")

    # Desconectar el cliente MQTT
    def disconnect(self):
        self.client.disconnect()
        print("🔌 Cliente Desconectado")

    # Publicar en un tópico
    def publish(self, topic, message):
        payload = json.dumps(message) if isinstance(message, dict) else str(message)
        self.client.publish(topic, payload, 0)
        print(f"📤 Mensaje enviado a {topic}: {payload}")

    # Suscribirse a un tópico MQTT
    def subscribe(self, topic, callback):
        def wrapper(client, userdata, message):
            try:
                payload_str = message.payload.decode()
                payload = json.loads(payload_str)

                # Asegurar que se llama con el loop correcto
                self.loop.call_soon_threadsafe(
                    asyncio.create_task, process_sensor_message_pub(message.topic, payload, self.loop)
                )
            except json.JSONDecodeError:
                print("❌ Error al decodificar el mensaje JSON.")
            except Exception as e:
                print(f"❌ Error inesperado en wrapper: {e}")

        self.client.subscribe(topic, 1, wrapper)
        print(f"🔗 Suscripto a {topic}")



    # Desuscribirse de un tópico MQTT
    def unsubscribe(self, topic):
        self.client.unsubscribe(topic)
        print(f"❌ Desuscripto de {topic}")
