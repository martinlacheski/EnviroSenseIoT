### ActuatorLog schema ###


from typing import Optional


def actuator_log_schema(log) -> dict:
    return {
        "id": str(log["_id"]),  # Pasamos Objeto a String
        "environment_id": log["environment_id"],
        "description": log["description"],
        "actuator_code": log["actuator_code"],
        "channel_1_enabled": log["channel_1_enabled"],
        "channel_1_name": log["channel_1_name"],
        "channel_1_time": log["channel_1_time"],
        "channel_2_enabled": log["channel_2_enabled"],
        "channel_2_name": log["channel_2_name"],
        "channel_2_time": log["channel_2_time"],
        "channel_3_enabled": log["channel_3_enabled"],
        "channel_3_name": log["channel_3_name"],
        "channel_3_time": log["channel_3_time"],
        "channel_4_enabled": log["channel_4_enabled"],
        "channel_4_name": log["channel_4_name"],
        "channel_4_time": log["channel_4_time"],
        "channel_5_enabled": log["channel_5_enabled"],
        "channel_5_name": log["channel_5_name"],
        "channel_5_time": log["channel_5_time"],
        "channel_6_enabled": log["channel_6_enabled"],
        "channel_6_name": log["channel_6_name"],
        "channel_6_time": log["channel_6_time"],
        "channel_7_enabled": log["channel_7_enabled"],
        "channel_7_name": log["channel_7_name"],
        "channel_7_time": log["channel_7_time"],
        "channel_8_enabled": log["channel_8_enabled"],
        "channel_8_name": log["channel_8_name"],
        "channel_8_time": log["channel_8_time"],
        "minutes_to_report": log["minutes_to_report"],
        "disabled": log["disabled"],
        "user_id": log["user_id"],
        "timestamp": log["timestamp"],
    }


def actuators_log_schema(actuators_log) -> list:
    return [actuator_log_schema(log) for log in actuators_log]
