### EnvironmentType schema ###


def environment_type_schema(environment_type) -> dict:
    return {
        "id": str(environment_type["_id"]),  # Pasamos Objeto a String
        "name": environment_type["name"]
    }


def environment_types_schema(environment_types) -> list:
    return [environment_type_schema(type) for type in environment_types]
