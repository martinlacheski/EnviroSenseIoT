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


db_client = MongoClient("mongodb://localhost:27017/")['envirosense']
# db_client = MongoClient("mongodb://admin:adminpassword@localhost:27017/")['envirosense']

async def init_db():
    client = AsyncIOMotorClient("mongodb://localhost:27017/")
    #client = AsyncIOMotorClient("mongodb://admin:adminpassword@localhost:27017/?authSource=admin")
    db = client.get_database("envirosense")
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
