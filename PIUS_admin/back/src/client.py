import httpx
from fastapi import HTTPException
from uuid import UUID
from src.config import settings


class UserClient:
    def __init__(self):
        self.base_url = settings.USER_SERVICE_URL

    async def get_all_users(self):
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{self.base_url}/api/v1/admin/users")
            if resp.status_code != 200:
                raise HTTPException(status_code=resp.status_code, detail=resp.text)
            return resp.json()

    async def delete_user(self, user_id: UUID):
        async with httpx.AsyncClient() as client:
            resp = await client.delete(f"{self.base_url}/api/v1/admin/users/{user_id}")
            if resp.status_code not in (200, 204):
                raise HTTPException(status_code=resp.status_code, detail=resp.text)
            return resp.json()

    async def update_user(self, user_id: UUID, data: dict):
        async with httpx.AsyncClient() as client:
            resp = await client.patch(f"{self.base_url}/api/v1/admin/users/{user_id}", json=data)
            if resp.status_code != 200:
                raise HTTPException(status_code=resp.status_code, detail=resp.text)
            return resp.json()