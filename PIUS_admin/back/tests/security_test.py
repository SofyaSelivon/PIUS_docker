import pytest
from jose import jwt
from fastapi import HTTPException
from src.security import get_admin_user, SECRET_KEY, ALGORITHM


def create_test_token(data: dict) -> str:
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)


async def test_get_admin_user_success():
    token = create_test_token({"sub": "user-123", "is_admin": True})

    result = await get_admin_user(token=token)

    assert result["userId"] == "user-123"
    assert result["isAdmin"] is True
    assert result["token"] == token


async def test_get_admin_user_not_admin():
    token = create_test_token({"sub": "user-123", "is_admin": False})

    with pytest.raises(HTTPException) as exc_info:
        await get_admin_user(token=token)

    assert exc_info.value.status_code == 403
    assert exc_info.value.detail == "Только для админов."


async def test_get_admin_user_missing_sub():
    token = create_test_token({"is_admin": True})

    with pytest.raises(HTTPException) as exc_info:
        await get_admin_user(token=token)

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail == "Неверный токен"


async def test_get_admin_user_invalid_token():
    invalid_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.payload"

    with pytest.raises(HTTPException) as exc_info:
        await get_admin_user(token=invalid_token)

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail == "Токен истек или невалиден"