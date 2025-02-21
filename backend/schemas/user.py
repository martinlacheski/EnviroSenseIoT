### User schema ###

def user_schema(user) -> dict:
    return {"id": str(user["_id"]), # Pasamos Objeto a String
            "username": user["username"],
            "password": user["password"],
            "name": user["name"],
            "surname": user["surname"],
            "email": user["email"],
            "enabled": user["enabled"],
            "is_admin": user["is_admin"]}


def users_schema(users) -> list:
    return [user_schema(user) for user in users]