import datetime
from typing import List, Dict, Optional
from beanie import PydanticObjectId
from fastapi import WebSocket

from utils.devices_environment import get_all_sensors_and_actuators



class WebSocketManager:
    _instance: Optional['WebSocketManager'] = None
    
    # Método de clase para obtener la instancia única (Singleton)
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.active_connections: List[Dict] = []  # Lista de diccionarios
            cls._instance.sensor_data_cache: Dict[str, dict] = {
                "environmental": {},
                "nutrient_solution": {},
                "consumption": {},
                "actuators": {}
            }
        return cls._instance
    
    # Método para manejar la conexión de un nuevo cliente WebSocket
    # async def connect(self, websocket: WebSocket):
    async def connect(self, websocket: WebSocket, user: dict, environment_id: str):
        try:
            env_id = PydanticObjectId(environment_id)
            # Obtener códigos válidos una sola vez al conectar
            valid_codes = await get_all_sensors_and_actuators(env_id)

        except:
            await websocket.close(code=1008, reason="ID de ambiente inválido")
            return

        self.active_connections.append({
            "websocket": websocket,
            "user": user,
            "environment_id": env_id,
            "valid_codes": set(valid_codes["allSensors"])  # Convertimos a set para búsquedas rápidas
        })

        # Enviar datos almacenados al nuevo cliente (filtrados)
        for sensor_type, data in self.sensor_data_cache.items():
            if data:
                device_code = data["data"].get("sensor_code") or data["data"].get("actuator_code")
                if device_code and device_code in valid_codes["allSensors"]:
                    await websocket.send_json({
                        "type": sensor_type,
                        "data": data["data"],
                        "timestamp": data["timestamp"]
                    })
    
    # Método para manejar la desconexión de un cliente WebSocket
    def disconnect(self, websocket: WebSocket):
        self.active_connections = [
            conn for conn in self.active_connections 
            if conn["websocket"] != websocket
        ]
    
    # Método para enviar un mensaje a un cliente WebSocket específico
    async def broadcast(self, message: dict):
        # Extraer el código del dispositivo (sensor o actuador)
        device_code = message.get("data", {}).get("sensor_code") or message.get("data", {}).get("actuator_code")
        if not device_code:
            return

        for connection in self.active_connections[:]:
            try:
                # Verificar si el código es válido para esta conexión
                if device_code in connection["valid_codes"]:
                    await connection["websocket"].send_json(message)
                    
                    # Actualizar caché solo si el mensaje es válido
                    if message.get("type") in self.sensor_data_cache:
                        self.sensor_data_cache[message["type"]] = {
                            "data": message["data"],
                            "timestamp": datetime.datetime.now().isoformat()
                        }
            except Exception as e:
                print(f"Error broadcasting to WebSocket: {e}")
                self.disconnect(connection["websocket"])
    
    # Método para enviar un mensaje a todos los clientes WebSocket
    def update_cache(self, sensor_type: str, data: dict):
        self.sensor_data_cache[sensor_type] = {
            "data": data,
            "timestamp": datetime.datetime.now().isoformat()
        }
    
    # Método para obtener datos almacenados en caché
    def get_cached_data(self, sensor_type: str) -> dict:
        return self.sensor_data_cache.get(sensor_type, {})
    
    # Método para obtener la cantidad de clientes conectados
    @property
    def connected_clients(self) -> int:
        return len(self.active_connections)

# Instancia del WebSocketManager
websocket_manager = WebSocketManager()