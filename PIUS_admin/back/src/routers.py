from uuid import UUID
from fastapi import APIRouter
from src.client import UserClient
from src.schemas import UserUpdateRequest
from src.security import get_admin_user


router = APIRouter(prefix="/api/v1/users", tags=["Users Admin Proxy"])
client = UserClient()


@router.get("/")
async def get_users(admin_data: dict = Depends(get_admin_user)):
    return await client.get_all_users()


@router.delete("/{user_id}")
async def delete_user(user_id: UUID, admin_data: dict = Depends(get_admin_user)):
    print("heoloSDF")
    return await client.delete_user(user_id)


@router.patch("/{user_id}")
async def update_user(user_id: UUID, user_data: UserUpdateRequest, admin_data: dict = Depends(get_admin_user)):
    update_dict = user_data.model_dump(mode="json", exclude_unset=True)
    return await client.update_user(user_id, update_dict)
