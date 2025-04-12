import datetime
from typing import List, Dict, Optional
from fastapi import WebSocket



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
    async def connect(self, websocket: WebSocket, user: dict):
        self.active_connections.append({
            "websocket": websocket,
            "user": user
        })
        # Enviar datos almacenados al nuevo cliente
        for sensor_type, data in self.sensor_data_cache.items():
            if data:
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
        for connection in self.active_connections[:]: # Copia de la lista para evitar problemas al eliminar conexiones
            try:
                await connection["websocket"].send_json(message)
            except Exception as e:
                print(f"Error broadcasting to WebSocket: {e}")
                self.disconnect(connection)
    
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