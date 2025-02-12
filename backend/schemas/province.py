### Province schema ###

def province_schema(province) -> dict:
    return {"id": str(province["_id"]), # Pasamos Objeto a String
            "country_id": province["country_id"],
            "name": province["name"]}


def provinces_schema(provinces) -> list:
    return [province_schema(province) for province in provinces]