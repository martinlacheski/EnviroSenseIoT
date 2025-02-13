### SensorEnvironmental schema ###


def sensor_environmental_data_schema(sensor) -> dict:
    return {
        "id": str(sensor["_id"]),  # Pasamos Objeto a String
        "sensor_code": sensor["sensor_code"],
        "temperature": sensor["temperature"],
        "humidity": sensor["humidity"],
        "atmospheric_pressure": sensor["atmospheric_pressure"],
        "luminosity": sensor["luminosity"],
        "co2": sensor["co2"],
        "timestamp": sensor["timestamp"]
    }


def sensors_environmental_data_schema(sensors) -> list:
    return [sensor_environmental_data_schema(sensor) for sensor in sensors]
