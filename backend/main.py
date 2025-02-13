from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from routers import (
    login,
    users,
    roles,
    countries,
    provinces,
    cities,
    companies,
    environment_types,
    environments,
    actuators,
    actuators_log,
    actuators_data,
    nutrient_types,
    sensors_consumption,
    sensors_consumption_log,
    sensors_consumption_data,
    sensors_environmental,
    sensors_environmental_log,
    sensors_environmental_data,
    sensors_nutrient_solution,
    sensors_nutrient_solution_log,
    sensors_nutrient_solution_data,
    
)

app = FastAPI()

# Routers
app.include_router(login.router)
app.include_router(roles.router)
app.include_router(users.router)
app.include_router(countries.router)
app.include_router(provinces.router)
app.include_router(cities.router)
app.include_router(companies.router)
app.include_router(environment_types.router)
app.include_router(environments.router)
app.include_router(actuators.router)
app.include_router(actuators_log.router)
app.include_router(actuators_data.router)
app.include_router(nutrient_types.router)
app.include_router(sensors_consumption.router)
app.include_router(sensors_consumption_log.router)
app.include_router(sensors_consumption_data.router)
app.include_router(sensors_environmental.router)
app.include_router(sensors_environmental_log.router)
app.include_router(sensors_environmental_data.router)
app.include_router(sensors_nutrient_solution.router)
app.include_router(sensors_nutrient_solution_log.router)
app.include_router(sensors_nutrient_solution_data.router)

# Incluir Archivos estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")


# Lanzar APP
@app.get("/")
def read_root():
    return {"Hello": "World"}
