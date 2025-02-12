### Company schema ###

def company_schema(company) -> dict:
    return {"id": str(company["_id"]), # Pasamos Objeto a String
            "name": company["name"],
            "address": company["address"],
            "city_id": company["city_id"],
            "email": company["email"],
            "phone": company["phone"],
            "webpage": company["webpage"],
            "logo": company["logo"]}


def companies_schema(companies) -> list:
    return [company_schema(company) for company in companies]