from uuid import UUID

from fastapi import APIRouter, Depends, status
from logreg.security import get_current_admin
from sqlalchemy.ext.asyncio import AsyncSession
from src.db.db import get_session
from src.schemas.admin_schemas import (
    AdminUserResponseSchema,
    UserDeleteSchemaResponse,
    UserUpdateSchema,
)
from src.services.admin_service import AdminService

router = APIRouter(
    prefix="/api/v1/admin", tags=["admin"], dependencies=[Depends(get_current_admin)]
)


@router.get(
    "/users",
    response_model=list[AdminUserResponseSchema],
    description="Получить список всех пользователей",
)
async def get_all_users(
    session: AsyncSession = Depends(get_session),  # noqa: B008
) -> list[AdminUserResponseSchema]:
    admin_service = AdminService(session)
    return await admin_service.get_all_users_service()


@router.delete(
    "/users/{user_id}",
    response_model=UserDeleteSchemaResponse,
    status_code=status.HTTP_200_OK,
    description="Удалить пользователя навсегда",
)
async def delete_user(
    user_id: UUID,
    session: AsyncSession = Depends(get_session),  # noqa: B008
) -> UserDeleteSchemaResponse:
    admin_service = AdminService(session)
    return await admin_service.delete_user_service(user_id)


@router.patch(
    "/users/{user_id}",
    response_model=AdminUserResponseSchema,
    description="Частично обновить данные пользователя",
)
async def update_user(
    user_id: UUID,
    user_data: UserUpdateSchema,
    session: AsyncSession = Depends(get_session),  # noqa: B008
) -> AdminUserResponseSchema:
    admin_service = AdminService(session)
    update_dict = user_data.model_dump(exclude_unset=True)
    return await admin_service.update_user_service(user_id, update_dict)
