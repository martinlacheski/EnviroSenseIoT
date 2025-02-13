### SensorConsumptionData schema ###


def sensor_consumption_data_schema(sensor) -> dict:
    return {
        "id": str(sensor["_id"]),  # Pasamos Objeto a String
        "sensor_code": sensor["sensor_code"],
        "voltage": sensor["voltage"],
        "current": sensor["current"],
        "power": sensor["power"],
        "energy": sensor["energy"],
        "frecuency": sensor["frecuency"],
        "power_factor": sensor["power_factor"],
        "solution_level": sensor["solution_level"],
        "nutrient_1_level": sensor["nutrient_1_level"],
        "nutrient_2_level": sensor["nutrient_2_level"],
        "nutrient_3_level": sensor["nutrient_3_level"],
        "nutrient_4_level": sensor["nutrient_4_level"],
        "nutrient_5_level": sensor["nutrient_5_level"],
        "nutrient_6_level": sensor["nutrient_6_level"],
        "timestamp": sensor["timestamp"],
    }


def sensors_consumption_data_schema(sensors) -> list:
    return [sensor_consumption_data_schema(sensor) for sensor in sensors]
