from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from src.repositories.admin_repository import AdminRepository as adminrepo
from src.schemas.admin_schemas import AdminUserResponseSchema, UserDeleteSchemaResponse


class AdminService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = adminrepo(session)

    async def get_all_users_service(self):
        users = await self.repo.get_all_users()
        return [AdminUserResponseSchema.model_validate(user) for user in users]

    async def delete_user_service(self, user_id: UUID) -> UserDeleteSchemaResponse:
        success = await self.repo.delete_user(user_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден"
            )
        return UserDeleteSchemaResponse(success=True)

    async def update_user_service(self, user_id: UUID, update_data: dict):
        if "password" in update_data:
            del update_data["password"]

        updated_user = await self.repo.update_user(user_id, update_data)

        if not updated_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден"
            )
        return AdminUserResponseSchema.model_validate(updated_user)
