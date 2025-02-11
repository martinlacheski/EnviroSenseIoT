### Role schema ###

def role_schema(role) -> dict:
    return {"id": str(role["_id"]), # Pasamos Objeto a String
            "name": role["name"],
            "is_admin": role["is_admin"]}


def roles_schema(roles) -> list:
    return [role_schema(role) for role in roles]