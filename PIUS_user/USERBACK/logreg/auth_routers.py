from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from logreg.auth_service import AuthService
from logreg.security import get_current_user
from src.db.db import get_session
from src.models.user import User
from src.schemas.auth_schemas import (
    LoginRequest,
    RegisterAuthResponse,
    RegisterRequest,
    UserResponseSchema,
)

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    response_model=RegisterAuthResponse,
    description="Создание нового юзера и возвращение токена доступа",
)
async def register(
    request: RegisterRequest, session: AsyncSession = Depends(get_session)
) -> RegisterAuthResponse:
    auth_service = AuthService(session)
    user, result = await auth_service.register(request)

    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result)

    return RegisterAuthResponse(
        success=True, user=UserResponseSchema.model_validate(user), token=result
    )


@router.post(
    "/login",
    response_model=RegisterAuthResponse,
    description="Вход в систему, возвращение токена доступа",
)
async def login(
    request: LoginRequest, session: AsyncSession = Depends(get_session)
) -> RegisterAuthResponse:
    auth_service = AuthService(session)
    user, result = await auth_service.login(request)

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=result)

    return RegisterAuthResponse(
        success=True, user=UserResponseSchema.model_validate(user), token=result
    )


@router.get(
    "/me",
    status_code=status.HTTP_200_OK,
    response_model=UserResponseSchema,
    description="Возвращение информации о текущем авторизованном юзере",
)
async def get_auth_me(
    current_user: User = Depends(get_current_user),
) -> UserResponseSchema:
    return UserResponseSchema.model_validate(current_user)
