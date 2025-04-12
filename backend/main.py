import asyncio
import os
from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Importamos Modelo y Esquema de la Entidad
from config import init_db

# Importamos metodo de autenticación JWT
from utils.authentication import current_user

# Importamos el cliente MQTT
from mqtt.aws_mqtt import AWSMQTTClient, process_sensor_message_pub, process_sensor_message_sub

from routers import (
    login,
    users,
    roles,
    countries,
    provinces,
    cities,
    companies,
    environment_types,
    environments,
    actuators,
    actuators_log,
    actuators_data,
    nutrient_types,
    sensors_consumption,
    sensors_consumption_log,
    sensors_consumption_data,
    sensors_environmental,
    sensors_environmental_log,
    sensors_environmental_data,
    sensors_nutrient_solution,
    sensors_nutrient_solution_log,
    sensors_nutrient_solution_data,
)

app = FastAPI()

# Inicializar cliente MQTT
mqtt_client = AWSMQTTClient()

@app.on_event("startup")
async def startup():
    await init_db()
    mqtt_client.connect()
         
    # Suscripción a tópicos de publicación de sensores y actuadores
    mqtt_client.subscribe("environmental/sensor/pub", process_sensor_message_pub)
    mqtt_client.subscribe("nutrient/solution/sensor/pub", process_sensor_message_pub)
    mqtt_client.subscribe("consumption/sensor/pub", process_sensor_message_pub)
    mqtt_client.subscribe("actuators/pub", process_sensor_message_pub)

    # Suscripción a tópicos de envío de parámetros a sensores y actuadores
    mqtt_client.subscribe("environmental/sensor/sub", process_sensor_message_sub)
    mqtt_client.subscribe("nutrient/solution/sensor/sub", process_sensor_message_sub)
    mqtt_client.subscribe("consumption/sensor/sub", process_sensor_message_sub)
    mqtt_client.subscribe("actuators/sub", process_sensor_message_sub)

@app.on_event("shutdown")
async def shutdown():
    mqtt_client.disconnect()

# Routers
app.include_router(login.router)
app.include_router(roles.router)
app.include_router(users.router)
app.include_router(countries.router)
app.include_router(provinces.router)
app.include_router(cities.router)
app.include_router(companies.router)
app.include_router(environment_types.router)
app.include_router(environments.router)
app.include_router(actuators.router)
app.include_router(actuators_log.router)
app.include_router(actuators_data.router)
app.include_router(nutrient_types.router)
app.include_router(sensors_consumption.router)
app.include_router(sensors_consumption_log.router)
app.include_router(sensors_consumption_data.router)
app.include_router(sensors_environmental.router)
app.include_router(sensors_environmental_log.router)
app.include_router(sensors_environmental_data.router)
app.include_router(sensors_nutrient_solution.router)
app.include_router(sensors_nutrient_solution_log.router)
app.include_router(sensors_nutrient_solution_data.router)

# Verificar y crear la carpeta "static" si no existe
static_dir = "static"
if not os.path.exists(static_dir):
    os.makedirs(static_dir)

# Montar archivos estáticos
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Habilitar Origenes
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lanzar APP
@app.get("/api")
def read_root():
    return {"Hello": "World"}

# Clase para manejar la publicación de mensajes MQTT
class PublishRequest(BaseModel):
    topic: str
    message: dict

# Endpoint para publicar mensajes MQTT
@app.post("/mqtt/publish")
def publish_message(request: PublishRequest, user: dict = Depends(current_user)):
    mqtt_client.publish(request.topic, request.message)
    return {"status": "Mensaje publicado", "topic": request.topic, "message": request.message}

# Endpoint para probar la conexión MQTT
@app.get("/mqtt/test")
def test_mqtt_connection(user: dict = Depends(current_user)):
    try:
        mqtt_client.connect()
        return {"status": "Conexión exitosa"}
    except Exception as e:
        return {"status": "Error de conexión", "error": str(e)}