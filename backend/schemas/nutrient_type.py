### NutrientType schema ###


def nutrient_type_schema(nutrient_type) -> dict:
    return {
        "id": str(nutrient_type["_id"]),  # Pasamos Objeto a String
        "name": nutrient_type["name"]
    }


def nutrient_types_schema(nutrient_types) -> list:
    return [nutrient_type_schema(type) for type in nutrient_types]
