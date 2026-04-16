from typing import Sequence
from uuid import UUID
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.user import User

class AdminRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_all_users(self) -> Sequence[User]:
        query = select(User).order_by(User.createdAt.desc())
        result = await self.session.execute(query)
        return result.scalars().all()

    async def delete_user(self, user_id: UUID) -> bool:
        stmt = delete(User).where(User.userId == user_id)
        result = await self.session.execute(stmt)
        await self.session.flush()
        return result.rowcount > 0

    async def update_user(self, user_id: UUID, update_data: dict) -> User | None:
        if not update_data:
            return await self.session.scalar(select(User).where(User.userId == user_id))

        stmt = (
            update(User)
            .where(User.userId == user_id)
            .values(**update_data)
            .returning(User)
        )

        result = await self.session.execute(stmt)
        await self.session.flush()
        return result.scalar_one_or_none()