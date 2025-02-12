### Environment schema ###

def environment_schema(environment) -> dict:
    return {"id": str(environment["_id"]), # Pasamos Objeto a String
            "company_id": environment["company_id"],
            "city_id": environment["city_id"],
            "type_id": environment["type_id"],
            "name": environment["name"],
            "address": environment["address"],
            "gps_location": environment["gps_location"],
            "description": environment["description"]
            }


def environments_schema(environments) -> list:
    return [environment_schema(environment) for environment in environments]