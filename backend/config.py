import os
from pymongo import MongoClient

from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient

from models.actuator import Actuator
from models.actuator_data import ActuatorData
from models.actuator_log import ActuatorLog
from models.user import UpdateCurrentUserPassword, UpdateUserPassword, User
from models.role import Role
from models.country import Country
from models.province import Province
from models.city import City
from models.company import Company
from models.environment_type import EnvironmentType
from models.environment import Environment
from models.nutrient_type import NutrientType
from models.sensor_consumption import ConsumptionSensor
from models.sensor_consumption_data import ConsumptionSensorData
from models.sensor_consumption_log import ConsumptionSensorLog
from models.sensor_environmental import EnvironmentalSensor
from models.sensor_environmental_data import EnvironmentalSensorData
from models.sensor_environmental_log import EnvironmentalSensorLog
from models.sensor_nutrient_solution import NutrientSolutionSensor
from models.sensor_nutrient_solution_data import NutrientSolutionSensorData
from models.sensor_nutrient_solution_log import NutrientSolutionSensorLog

# Configuración desde variables de entorno
MONGO_USER = os.getenv("MONGO_USER", "admin")  # Valor por defecto si no existe
MONGO_PASSWORD = os.getenv("MONGO_PASSWORD", "adminpassword")
MONGO_HOST = os.getenv("MONGO_HOST", "mongodb")  # "localhost" en desarrollo, "mongodb" en Docker
MONGO_DB = os.getenv("MONGO_DB", "envirosense")


async def init_db():
    uri = f"mongodb://{MONGO_USER}:{MONGO_PASSWORD}@{MONGO_HOST}:27017/{MONGO_DB}?authSource=admin"
    client = AsyncIOMotorClient(uri)
    db = client.get_database(MONGO_DB)
    await init_beanie(database=db, document_models=[
        User,
        UpdateCurrentUserPassword,
        UpdateUserPassword,
        Role, 
        Country, 
        Province, 
        City, 
        Company, 
        EnvironmentType, 
        Environment, 
        NutrientType, 
        ConsumptionSensor,
        ConsumptionSensorData,
        ConsumptionSensorLog,
        EnvironmentalSensor,
        EnvironmentalSensorData,
        EnvironmentalSensorLog,
        NutrientSolutionSensor,
        NutrientSolutionSensorData,
        NutrientSolutionSensorLog,
        Actuator,
        ActuatorData,
        ActuatorLog
        ])
