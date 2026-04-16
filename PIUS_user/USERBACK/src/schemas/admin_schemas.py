from datetime import datetime, date
from typing import Optional
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
    login: Optional[str] = None
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    patronymic: Optional[str] = None
    dateOfBirth: Optional[date] = None
    city: Optional[str] = None
    telegram: Optional[str] = None
    telegramChatId: Optional[str] = None
    isSeller: Optional[bool] = None