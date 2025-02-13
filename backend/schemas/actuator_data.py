### ActuatorData schema ###


def actuator_data_schema(actuator) -> dict:
    return {
        "id": str(actuator["_id"]),  # Pasamos Objeto a String
        "actuator_code": actuator["actuator_code"],
        "channel_1_state": actuator["channel_1_state"],
        "channel_2_state": actuator["channel_2_state"],
        "channel_3_state": actuator["channel_3_state"],
        "channel_4_state": actuator["channel_4_state"],
        "channel_5_state": actuator["channel_5_state"],
        "channel_6_state": actuator["channel_6_state"],
        "channel_7_state": actuator["channel_7_state"],
        "channel_8_state": actuator["channel_8_state"],
        "timestamp": actuator["timestamp"],
    }


def actuators_data_schema(actuators_data) -> list:
    return [actuator_data_schema(data) for data in actuators_data]
