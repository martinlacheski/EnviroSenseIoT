from mqtt.aws_mqtt import AWSMQTTClient

# Variable global para el cliente MQTT
mqtt_client = None

def init_mqtt():
    global mqtt_client
    if mqtt_client is None:
        mqtt_client = AWSMQTTClient()
        mqtt_client.connect()
    return mqtt_client  # Asegúrate de devolver la instancia

def get_mqtt_client():
    if mqtt_client is None:
        raise RuntimeError("MQTT client no inicializado")
    return mqtt_client