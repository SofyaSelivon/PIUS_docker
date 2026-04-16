from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from src.schemas.admin_schemas import AdminUserResponseSchema, UserUpdateSchema
from src.services.admin_service import AdminService
from src.db.db import get_session


router = APIRouter(prefix="/api/v1/admin", tags=["admin"])

@router.get(
    "/users",
    response_model=List[AdminUserResponseSchema],
    description="Получить список всех пользователей"
)
async def get_all_users(session: AsyncSession = Depends(get_session)):
    admin_service = AdminService(session)
    users = await admin_service.get_all_users_service()
    return users

@router.delete(
    "/users/{user_id}",
    status_code=status.HTTP_200_OK,
    description="Удалить пользователя навсегда"
)
async def delete_user(user_id: UUID, session: AsyncSession = Depends(get_session)):
    admin_service = AdminService(session)
    return await admin_service.delete_user_service(user_id)


@router.patch(
    "/users/{user_id}",
    response_model=AdminUserResponseSchema,
    description="Частично обновить данные пользователя"
)
async def update_user(
        user_id: UUID,
        user_data: UserUpdateSchema,
        session: AsyncSession = Depends(get_session)
):
    admin_service = AdminService(session)

    update_dict = user_data.model_dump(exclude_unset=True)

    return await admin_service.update_user_service(user_id, update_dict)