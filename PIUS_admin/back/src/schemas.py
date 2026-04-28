from datetime import date

from pydantic import BaseModel


class UserUpdateRequest(BaseModel):
    login: str | None = None
    firstName: str | None = None
    lastName: str | None = None
    patronymic: str | None = None
    dateOfBirth: date | None = None
    city: str | None = None
    telegram: str | None = None
    telegramChatId: str | None = None
    isSeller: bool | None = None
