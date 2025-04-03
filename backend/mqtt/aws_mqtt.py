import asyncio
import json
import os
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
from models.sensor_environmental_data import EnvironmentalSensorData
from mqtt.aws_config import AWS_ENDPOINT, MQTT_CLIENT_ID

# Método asíncrono para insertar datos en la base de datos
async def insert_sensor_data(payload):
    try:
        sensor_data = EnvironmentalSensorData(**payload)
        await sensor_data.insert()
        print("✅ Datos guardados en la base de datos.")
    except Exception as e:
        print(f"❌ Error al guardar datos en la base de datos: {e}")

# Método para procesar mensajes de sensores y actuadores
async def process_sensor_message_pub(topic, payload):
    try:
        print(f"📩 Mensaje recibido desde {topic}")
        print(f"Data: {payload}")

        if topic in [
            "environmental/sensor/pub",
            "nutrient_solution/sensor/pub",
            "consumption/sensor/pub",
            "actuators/pub",
        ]:
            print(f"📩 Procesando mensaje de {topic}")
            await insert_sensor_data(payload)
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
        # else:
        #     print("❌ Error al establecer el intervalo de tiempo.")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")

class AWSMQTTClient:
    def __init__(self):
        CERTS_DIR = os.getenv("CERTS_DIR", "mqtt/certificates")
        self.ROOT_CRT = os.path.join(CERTS_DIR, "root.crt")
        self.CLIENT_CRT = os.path.join(CERTS_DIR, "client.crt")
        self.CLIENT_KEY = os.path.join(CERTS_DIR, "client.key")

        # Verificar existencia de certificados
        for cert in [self.ROOT_CRT, self.CLIENT_CRT, self.CLIENT_KEY]:
            if not os.path.exists(cert):
                raise FileNotFoundError(f"El archivo {cert} no fue encontrado.")

        # Configurar cliente MQTT
        self.client = AWSIoTMQTTClient(MQTT_CLIENT_ID)
        self.client.configureEndpoint(AWS_ENDPOINT, 8883)
        self.client.configureCredentials(self.ROOT_CRT, self.CLIENT_KEY, self.CLIENT_CRT)
        self.client.configureConnectDisconnectTimeout(10)
        self.loop = asyncio.get_event_loop()

    def connect(self):
        print("🚀 Estableciendo conexión con AWS IoT Core.")
        self.client.connect()
        print("🔄 Cliente MQTT Conectado.")

    def disconnect(self):
        self.client.disconnect()
        print("🔌 Cliente Desconectado")

    def publish(self, topic, message):
        payload = json.dumps(message) if isinstance(message, dict) else str(message)
        self.client.publish(topic, payload, 0)
        print(f"📤 Mensaje enviado a {topic}: {payload}")

    def subscribe(self, topic, callback):
        def wrapper(client, userdata, message):
            try:
                payload_str = message.payload.decode()
                payload = json.loads(payload_str)
                if topic in [ "environmental/sensor/sub", "nutrient_solution/sensor/sub", "consumption/sensor/sub", "actuators/sub"]:
                    process_sensor_message_sub(topic, payload)
                else:
                    self.loop.create_task(process_sensor_message_pub(message.topic, payload))
            except json.JSONDecodeError:
                print("❌ Error al decodificar el mensaje JSON.")
            except Exception as e:
                print(f"❌ Error inesperado en wrapper: {e}")
        
        self.client.subscribe(topic, 1, wrapper)
        print(f"🔗 Suscripto a {topic}")

    def unsubscribe(self, topic):
        self.client.unsubscribe(topic)
        print(f"❌ Desuscripto de {topic}")
