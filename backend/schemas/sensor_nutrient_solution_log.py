### NutrientSolutionSensorLog schema ###


def nutrient_solution_sensor_log_schema(sensor) -> dict:
    return {
        "id": str(sensor["_id"]),  # Pasamos Objeto a String
        "environment_id": sensor["environment_id"],
        "description": sensor["description"],
        "sensor_code": sensor["sensor_code"],
        "tds_alert": sensor["tds_alert"],
        "ph_alert": sensor["ph_alert"],
        "ce_alert": sensor["ce_alert"],
        "minutes_to_report": sensor["minutes_to_report"],
        "disabled": sensor["disabled"],
        "user_id": sensor["user_id"],
        "timestamp": sensor["timestamp"],
    }


def nutrient_solution_sensors_log_schema(sensors) -> list:
    return [nutrient_solution_sensor_log_schema(sensor) for sensor in sensors]
