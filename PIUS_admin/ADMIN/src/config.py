import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    USER_SERVICE_URL: str = os.getenv("USER_SERVICE_URL", "http://localhost:8000")

settings = Settings()