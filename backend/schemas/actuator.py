### Actuator schema ###


def actuator_schema(actuator) -> dict:
    return {
        "id": str(actuator["_id"]),  # Pasamos Objeto a String
        "environment_id": actuator["environment_id"],
        "description": actuator["description"],
        "actuator_code": actuator["actuator_code"],
        "channel_1_enabled": actuator["channel_1_enabled"],
        "channel_1_name": actuator["channel_1_name"],
        "channel_1_time": actuator["channel_1_time"],
        "channel_2_enabled": actuator["channel_2_enabled"],
        "channel_2_name": actuator["channel_2_name"],
        "channel_2_time": actuator["channel_2_time"],
        "channel_3_enabled": actuator["channel_3_enabled"],
        "channel_3_name": actuator["channel_3_name"],
        "channel_3_time": actuator["channel_3_time"],
        "channel_4_enabled": actuator["channel_4_enabled"],
        "channel_4_name": actuator["channel_4_name"],
        "channel_4_time": actuator["channel_4_time"],
        "channel_5_enabled": actuator["channel_5_enabled"],
        "channel_5_name": actuator["channel_5_name"],
        "channel_5_time": actuator["channel_5_time"],
        "channel_6_enabled": actuator["channel_6_enabled"],
        "channel_6_name": actuator["channel_6_name"],
        "channel_6_time": actuator["channel_6_time"],
        "channel_7_enabled": actuator["channel_7_enabled"],
        "channel_7_name": actuator["channel_7_name"],
        "channel_7_time": actuator["channel_7_time"],
        "channel_8_enabled": actuator["channel_8_enabled"],
        "channel_8_name": actuator["channel_8_name"],
        "channel_8_time": actuator["channel_8_time"],
        "minutes_to_report": actuator["minutes_to_report"],
        "disabled": actuator["disabled"],
    }


def actuators_schema(actuators) -> list:
    return [actuator_schema(actuator) for actuator in actuators]
