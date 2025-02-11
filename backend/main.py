from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from routers import login, users, roles

app = FastAPI()

# Routers
app.include_router(login.router)
app.include_router(roles.router)
app.include_router(users.router)

# Incluir Archivos estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")


# Lanzar APP
@app.get("/")
def read_root():
    return {"Hello": "World"}
