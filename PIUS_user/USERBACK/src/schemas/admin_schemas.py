from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel


class AdminUserResponseSchema(BaseModel):
    userId: UUID
    login: str
    firstName: str | None = None
    lastName: str | None = None
    isSeller: bool
    createdAt: datetime

    class Config:
        from_attributes = True


class UserUpdateSchema(BaseModel):
    login: str | None = None
    firstName: str | None = None
    lastName: str | None = None
    patronymic: str | None = None
    dateOfBirth: date | None = None
    city: str | None = None
    telegram: str | None = None
    telegramChatId: str | None = None
    isSeller: bool | None = None


class UserDeleteSchemaResponse(BaseModel):
    success: bool
    message: str = "Пользователь успешно удален"
