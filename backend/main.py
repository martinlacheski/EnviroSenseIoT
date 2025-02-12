from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from routers import login, users, roles, countries, provinces, cities, companies, environment_types, environment

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
app.include_router(environment.router)

# Incluir Archivos estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")


# Lanzar APP
@app.get("/")
def read_root():
    return {"Hello": "World"}
