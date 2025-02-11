from pydantic_settings import BaseSettings
from pymongo import MongoClient

db_client = MongoClient("mongodb://localhost:27017/")['envirosense']



#class Config(BaseSettings):
    # Base de datos local MongoDB
    #db_client = MongoClient().local
    
    # SITE_DOMAIN: str = "envirosenseiot.com"

    # ENVIRONMENT: Environment = "Enviroment"

    # SENTRY_DSN: str | None = None

    # CORS_ORIGINS: list[str]
    # CORS_ORIGINS_REGEX: str | None = None
    # CORS_HEADERS: list[str]

    # APP_VERSION: str = "1.0"


#settings = Config()
