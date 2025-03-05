### EnvironmentalSensorLog schema ###


def environmental_sensor_log_schema(sensor) -> dict:
    return {
        "id": str(sensor["_id"]),  # Pasamos Objeto a String
        "environment_id": sensor["environment_id"],
        "description": sensor["description"],
        "sensor_code": sensor["sensor_code"],
        "temperature_alert": sensor["temperature_alert"],
        "humidity_alert": sensor["humidity_alert"],
        "atmospheric_pressure_alert": sensor["atmospheric_pressure_alert"],
        "co2_alert": sensor["co2_alert"],
        "minutes_to_report": sensor["minutes_to_report"],
        "enabled": sensor["enabled"],
        "user_id": sensor["user_id"],
        "timestamp": sensor["timestamp"],
    }


def environmental_sensors_log_schema(sensors) -> list:
    return [environmental_sensor_log_schema(sensor) for sensor in sensors]
