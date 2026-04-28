from datetime import date
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class RegisterRequest(BaseModel):
    login: str
    password: str
    firstName: str
    lastName: str | None = None
    patronymic: str | None = None
    dateOfBirth: date | None = None
    city: str | None = None
    telegram: str | None = None
    isSeller: bool = False


class LoginRequest(BaseModel):
    login: str
    password: str


class UserResponseSchema(BaseModel):
    userId: UUID
    login: str
    firstName: str
    isSeller: bool

    model_config = ConfigDict(from_attributes=True)


class RegisterAuthResponse(BaseModel):
    success: bool = True
    user: UserResponseSchema
    token: str


class AuthResponse(BaseModel):
    success: bool
    user: UserResponseSchema | None = None
    token: str | None = None
    message: str | None = None
