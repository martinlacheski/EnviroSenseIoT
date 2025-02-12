### Country schema ###

def country_schema(country) -> dict:
    return {"id": str(country["_id"]), # Pasamos Objeto a String
            "name": country["name"]}


def countries_schema(countries) -> list:
    return [country_schema(country) for country in countries]