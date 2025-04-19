from beanie import PydanticObjectId
from pydantic import BaseModel

from models.actuator import Actuator
from models.sensor_consumption import ConsumptionSensor
from models.sensor_environmental import EnvironmentalSensor
from models.sensor_nutrient_solution import NutrientSolutionSensor


class SensorView(BaseModel):
    description: str
    sensor_code: str

    class Settings:
        projection = {"_id": 1, "sensor_code": 1, "description": 1}

class ActuatorView(BaseModel):
    description: str
    actuator_code: str

    class Settings:
        projection = {"_id": 1, "actuator_code": 1, "description": 1}

async def get_environmental_sensors(environment_id: PydanticObjectId) -> list[str]:
    sensors = await EnvironmentalSensor.find(
        EnvironmentalSensor.environment.id == environment_id
    ).project(SensorView).to_list()
    return [sensor.sensor_code for sensor in sensors]

async def get_consumption_sensors(environment_id: PydanticObjectId) -> list[str]:
    sensors = await ConsumptionSensor.find(
        ConsumptionSensor.environment.id == environment_id
    ).project(SensorView).to_list()
    return [sensor.sensor_code for sensor in sensors]

async def get_nutrient_solution_sensors(environment_id: PydanticObjectId) -> list[str]:
    sensors = await NutrientSolutionSensor.find(
        NutrientSolutionSensor.environment.id == environment_id
    ).project(SensorView).to_list()
    return [sensor.sensor_code for sensor in sensors]

async def get_actuators(environment_id: PydanticObjectId) -> list[str]:
    actuators = await Actuator.find(
        Actuator.environment.id == environment_id
    ).project(ActuatorView).to_list()
    return [actuator.actuator_code for actuator in actuators]

async def get_all_sensors_and_actuators(environment_id: PydanticObjectId) -> dict:
    environmental_sensors = await get_environmental_sensors(environment_id)
    consumption_sensors = await get_consumption_sensors(environment_id)
    nutrient_solution_sensors = await get_nutrient_solution_sensors(environment_id)
    actuators = await get_actuators(environment_id)
    
    all_sensors = environmental_sensors + consumption_sensors + nutrient_solution_sensors + actuators
    
    return {
        "environmentalSensors": environmental_sensors,
        "consumptionSensors": consumption_sensors,
        "nutrientSolutionSensors": nutrient_solution_sensors,
        "actuators": actuators,
        "allSensors": all_sensors
    }