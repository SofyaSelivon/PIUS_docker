import os

from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()


class Settings(BaseSettings):
    USER_SERVICE_URL: str = os.getenv("USER_SERVICE_URL", "http://localhost:8000")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-for-local-dev")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")


settings = Settings()
