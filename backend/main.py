import json
import os
from fastapi import FastAPI, Depends, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Cargar variables de entorno desde el archivo .env
load_dotenv() 

# Importamos Modelo y Esquema de la Entidad
from config import init_db

# Importamos metodo de autenticación JWT
from utils.authentication import current_user

# Importa el cliente MQTT desde el módulo de dependencias
from utils.mqtt_dependencies import init_mqtt, mqtt_client

# Importamos el cliente MQTT
from mqtt.aws_mqtt import process_sensor_message_pub, process_sensor_message_sub


# Importamos el cliente WebSocket
from utils.websocket import websocket_manager
# Importamos el cliente WebSocket para autenticación
from utils.websocket_auth import websocket_current_user

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
# mqtt_client = AWSMQTTClient()

@app.on_event("startup")
async def startup():
    await init_db()
    mqtt_client = init_mqtt()  # Inicializa el cliente MQTT
         
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
    mqtt_client = init_mqtt()
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

# Leer la variable de entorno y convertirla en una lista de orígenes
origins = os.getenv("BACKEND_CORS_ORIGINS")
if origins is None:
    raise ValueError("No se encontró la variable de entorno BACKEND_CORS_ORIGINS")

# Convertir la cadena JSON en una lista de Python
origins = json.loads(origins)
print(f"Orígenes permitidos: {origins}")

# Configurar CORS con los orígenes permitidos
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Aquí pasas la lista de orígenes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lanzar APP
@app.get("/api/test")
def read_root():
    return {"Hello": "World"}

# Clase para manejar la publicación de mensajes MQTT
class PublishRequest(BaseModel):
    topic: str
    message: dict

# Endpoint para publicar mensajes MQTT
@app.post("/mqtt/publish")
def publish_message(request: PublishRequest, user: dict = Depends(current_user)):
    mqtt_client = init_mqtt()
    mqtt_client.publish(request.topic, request.message)
    return {"status": "Mensaje publicado", "topic": request.topic, "message": request.message}

# Endpoint para probar la conexión MQTT
@app.get("/mqtt/test")
def test_mqtt_connection(user: dict = Depends(current_user)):
    mqtt_client = init_mqtt()
    try:
        mqtt_client.connect()
        return {"status": "Conexión exitosa"}
    except Exception as e:
        return {"status": "Error de conexión", "error": str(e)}

# WebSocket para recibir datos de sensores y actuadores
@app.websocket("/ws/sensor-data")
async def websocket_endpoint(websocket: WebSocket):
    # Aceptar la conexión WebSocket
    await websocket.accept()
    # Obtener el usuario actual
    user = await websocket_current_user(websocket)
    # Verificar si el usuario está autenticado
    if not user:
        # Cerrar la conexión si no está autenticado
        return
    
    # Obtener el ID del ambiente desde la query parameter
    environment_id = websocket.query_params.get("environment_id")
    if not environment_id:
        await websocket.close(code=1008, reason="ID de ambiente no proporcionado")
        return
    
    # Conectar el WebSocket al gestor
    await websocket_manager.connect(websocket, user, environment_id)
    
    # Mantener la conexión abierta
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        websocket_manager.disconnect(websocket)
    except Exception as e:
        print(f"Error en WebSocket: {e}")
        websocket_manager.disconnect(websocket)