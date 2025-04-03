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
    
# Configurar el cliente MQTT
myMQTTClient = AWSIoTMQTTClient(MQTT_CLIENT_ID)
myMQTTClient.configureEndpoint(AWS_ENDPOINT, 8883)
myMQTTClient.configureCredentials(ROOT_CRT, CLIENT_KEY, CLIENT_CRT)
    

myMQTTClient.connect()
print("Client Connected")

msg = "Sample data from the device";
topic = "general/inbound"
myMQTTClient.publish(topic, msg, 0)  
print("Message Sent")

myMQTTClient.disconnect()
print("Client Disconnected")