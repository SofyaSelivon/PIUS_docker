from datetime import date
from typing import Optional
from pydantic import BaseModel


class UserUpdateRequest(BaseModel):
    login: Optional[str] = None
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    patronymic: Optional[str] = None
    dateOfBirth: Optional[date] = None
    city: Optional[str] = None
    telegram: Optional[str] = None
    telegramChatId: Optional[str] = None
    isSeller: Optional[bool] = None