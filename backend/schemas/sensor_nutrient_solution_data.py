### SensorNutrientSolutionData schema ###


def sensor_nutrient_solution_data_schema(sensor) -> dict:
    return {
        "id": str(sensor["_id"]),  # Pasamos Objeto a String
        "sensor_code": sensor["sensor_code"],
        "temperature": sensor["temperature"],
        "tds": sensor["tds"],
        "ph": sensor["ph"],
        "ce": sensor["ce"],
        "timestamp": sensor["timestamp"]
    }


def sensors_nutrient_solution_data_schema(sensors) -> list:
    return [sensor_nutrient_solution_data_schema(sensor) for sensor in sensors]
