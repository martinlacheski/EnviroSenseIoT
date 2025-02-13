### EnvironmentalSensor schema ###


def environmental_sensor_schema(sensor) -> dict:
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
        "disabled": sensor["disabled"],
    }


def environmental_sensors_schema(sensors) -> list:
    return [environmental_sensor_schema(sensor) for sensor in sensors]
