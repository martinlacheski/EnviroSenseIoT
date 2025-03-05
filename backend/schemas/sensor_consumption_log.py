### ConsumptionSensorLog schema ###


def consumption_sensor_log_schema(sensor) -> dict:
    return {
        "id": str(sensor["_id"]),  # Pasamos Objeto a String
        "environment_id": sensor["environment_id"],
        "description": sensor["description"],
        "sensor_code": sensor["sensor_code"],
        "min_voltage_alert": sensor["min_voltage_alert"],
        "max_voltage_alert": sensor["max_voltage_alert"],
        "solution_level_alert": sensor["solution_level_alert"],
        "nutrient_1_enabled": sensor["nutrient_1_enabled"],
        "nutrient_1_type_id": sensor["nutrient_1_type_id"],
        "nutrient_1_alert": sensor["nutrient_1_alert"],
        "nutrient_2_enabled": sensor["nutrient_2_enabled"],
        "nutrient_2_type_id": sensor["nutrient_2_type_id"],
        "nutrient_2_alert": sensor["nutrient_2_alert"],
        "nutrient_3_enabled": sensor["nutrient_3_enabled"],
        "nutrient_3_type_id": sensor["nutrient_3_type_id"],
        "nutrient_3_alert": sensor["nutrient_3_alert"],
        "nutrient_4_enabled": sensor["nutrient_4_enabled"],
        "nutrient_4_type_id": sensor["nutrient_4_type_id"],
        "nutrient_4_alert": sensor["nutrient_4_alert"],
        "nutrient_5_enabled": sensor["nutrient_5_enabled"],
        "nutrient_5_type_id": sensor["nutrient_5_type_id"],
        "nutrient_5_alert": sensor["nutrient_5_alert"],
        "nutrient_6_enabled": sensor["nutrient_6_enabled"],
        "nutrient_6_type_id": sensor["nutrient_6_type_id"],
        "nutrient_6_alert": sensor["nutrient_6_alert"],
        "minutes_to_report": sensor["minutes_to_report"],
        "enabled": sensor["enabled"],
        "user_id": sensor["user_id"],
        "timestamp": sensor["timestamp"],
    }


def consumption_sensors_log_schema(sensors) -> list:
    return [consumption_sensor_log_schema(sensor) for sensor in sensors]
