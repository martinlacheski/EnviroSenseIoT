### City schema ###


def city_schema(city) -> dict:
    return {
        "id": str(city["_id"]),  # Pasamos Objeto a String
        "province_id": city["province_id"],
        "name": city["name"],
        "postal_code": city["postal_code"],
    }


def cities_schema(cities) -> list:
    return [city_schema(city) for city in cities]
