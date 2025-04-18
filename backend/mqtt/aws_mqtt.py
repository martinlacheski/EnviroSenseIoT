import asyncio
import json
import os
# Importamos el cliente MQTT de AWS
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
# Importamos los modelos de datos
from models.actuator import Actuator
from models.actuator_data import ActuatorData
from models.sensor_consumption import ConsumptionSensor
from models.sensor_consumption_data import ConsumptionSensorData
from models.sensor_environmental import EnvironmentalSensor
from models.sensor_environmental_data import EnvironmentalSensorData
from models.sensor_nutrient_solution import NutrientSolutionSensor
from models.sensor_nutrient_solution_data import NutrientSolutionSensorData
# Importamos la configuración de AWS
from mqtt.aws_config import AWS_ENDPOINT, MQTT_CLIENT_ID
# Importamos el cliente WebSocket
from utils.websocket import websocket_manager
import datetime

TOPIC_PUB_MODEL_MAP = {
    "environmental/sensor/pub": EnvironmentalSensorData,
    "nutrient/solution/sensor/pub": NutrientSolutionSensorData,
    "consumption/sensor/pub": ConsumptionSensorData,
    "actuators/pub": ActuatorData,
}

TOPIC_SUB_MODEL_MAP = {
    "environmental/sensor/sub": EnvironmentalSensor,
    "nutrient/solution/sensor/sub": NutrientSolutionSensor,
    "consumption/sensor/sub": ConsumptionSensor,
    "actuators/sub": Actuator,
}

# Método asíncrono para insertar datos en la base de datos
async def insert_sensor_data(payload, model_class):
    try:
        sensor_data = model_class(**payload)
        await sensor_data.insert()
        print("✅ Datos guardados en la base de datos.")
    except Exception as e:
        print(f"❌ Error al guardar datos en la base de datos: {e}")

# Método asíncrono para actualizar el intervalo de reporte
async def update_device_interval(device_code, new_interval, model_class, device_type="sensor"):
    try:
        print(f"🔄 Actualizando {device_type} {device_code} a {new_interval}s en BD...")
        
        # Convertir a entero explícitamente
        interval_value = int(new_interval)
        # Buscar el dispositivo usando Beanie
        query_field = "sensor_code" if device_type == "sensor" else "actuator_code"
        device = await model_class.find_one({query_field: device_code})
        
        if device:
            # Actualizar usando el método set de Beanie
            await device.set({"seconds_to_report": interval_value})       
            print(f"✅ Intervalo actualizado para {device_type} {device_code}")
            return True
        else:
            print(f"⚠️ {device_type.capitalize()} {device_code} no encontrado en BD")
            return False
            
    except ValueError as e:
        print(f"❌ Error de validación: {e}")
    except Exception as e:
        print(f"❌ Error actualizando BD: {str(e)}")
    return False
        
# Método para procesar mensajes entrantes de sensores y actuadores
async def process_sensor_message_pub(topic, payload):
    try:
        print(f"📩 Mensaje recibido desde {topic}")
        print(f"Data: {payload}")

        model_class = TOPIC_PUB_MODEL_MAP.get(topic)
        if model_class:
            print(f"📩 Procesando mensaje de {topic}")
            await insert_sensor_data(payload, model_class)
            
            # Determinar el tipo de sensor para WebSocket
            sensor_type = None
            if "environmental/sensor/pub" in topic:
                sensor_type = "environmental"
            elif "nutrient/solution/sensor/pub" in topic:
                sensor_type = "nutrient_solution"
            elif "consumption/sensor/pub" in topic:
                sensor_type = "consumption"
            elif "actuators/pub" in topic:
                sensor_type = "actuators"
            
            # Verificar si el tipo de sensor es válido
            if sensor_type:
                # Actualizar cache y enviar a WebSocket
                websocket_manager.update_cache(sensor_type, payload)
                await websocket_manager.broadcast({
                    "type": sensor_type,
                    "data": payload,
                    "timestamp": datetime.datetime.now().isoformat()
                })
        else:
            print(f"⚠️ Tópico no reconocido: {topic}")
    except Exception as e:
        print(f"❌ Error inesperado: {e}")

# Método para procesar mensajes de control de sensores y actuadores
async def process_sensor_message_sub(topic, payload):
    try:
        print(f"📩 Mensaje recibido desde {topic}")
        print(f"Data: {payload}")

        model_class = TOPIC_SUB_MODEL_MAP.get(topic)
        if not model_class:
            print(f"⚠️ Tópico no reconocido: {topic}")
            return

        # Determinar si es un sensor o actuador
        is_actuator = "actuators/sub" in topic
        device_type = "actuator" if is_actuator else "sensor"
        code_field = "actuator_code" if is_actuator else "sensor_code"
        
        # Verificar que el campo de código exista en el payload
        if code_field not in payload:
            print(f"⚠️ Falta campo {code_field} en el mensaje de {device_type}")
            return

        # Solo procesamos si es una confirmación del dispositivo
        if payload.get("interval") == "OK" and payload.get("seconds_to_report"):
            print(f"✅ Confirmación válida recibida del {device_type}")
            await update_device_interval(
                device_code=payload[code_field],
                new_interval=payload["seconds_to_report"],
                model_class=model_class,
                device_type=device_type
            )
        else:
            print(f"🔔 Mensaje recibido (esperando confirmación del {device_type})")
    except Exception as e:
        print(f"❌ Error procesando mensaje: {e}")
        
async def update_device_report_interval(
    self, 
    device_type: str, 
    device_code: str, 
    seconds_to_report: int
):
    """
    Publica un mensaje para actualizar el intervalo de reporte de un dispositivo
    
    Args:
        device_type: Tipo de dispositivo ('environmental', 'nutrient', 'consumption' o 'actuator')
        device_code: Código del dispositivo a actualizar
        seconds_to_report: Nuevo intervalo en segundos
    """
    
    # Mapeo de tipos de dispositivo a sus tópicos correspondientes
    TOPIC_MAP = {
        'environmental': 'environmental/sensor/sub',
        'nutrient': 'nutrient/solution/sensor/sub',
        'consumption': 'consumption/sensor/sub',
        'actuator': 'actuators/sub'
    }
    try:
        # Determinar el tipo de código según el tipo de dispositivo
        code_field = 'sensor_code' if device_type != 'actuator' else 'actuator_code'
        
        # Construir el mensaje
        message = {
            code_field: device_code,
            "interval": seconds_to_report
        }
        
        # Obtener el tópico correspondiente
        topic = TOPIC_MAP.get(device_type)
        if not topic:
            raise ValueError(f"Tipo de dispositivo no válido: {device_type}")
        
        # Publicar el mensaje
        self.publish(
            topic=topic,
            message=message
        )
    except Exception as e:
        print(f"❌ Error al publicar mensaje: {str(e)}")
        raise
            
# Clase para manejar la conexión y comunicación con AWS IoT Core
class AWSMQTTClient:
    def __init__(self):
        CERTS_DIR = os.getenv("CERTS_DIR", "certificates")
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
                if topic in [ "environmental/sensor/sub", "nutrient/solution/sensor/sub", "consumption/sensor/sub", "actuators/sub"]:
                    # process_sensor_message_sub(topic, payload)
                    self.loop.create_task(process_sensor_message_sub(topic, payload))
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
