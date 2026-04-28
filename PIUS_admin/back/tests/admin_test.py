import pytest
import respx
from httpx import Response
from uuid import uuid4
from src.config import settings
from src.main import app
from src.security import get_admin_user


TEST_USER_ID = str(uuid4())
BASE_URL = settings.USER_SERVICE_URL

MOCK_USERS_LIST = [
    {
        "userId": TEST_USER_ID,
        "login": "admin@test.com",
        "firstName": "Иван",
        "isAdmin": True
    }
]


@pytest.fixture(autouse=True)
def override_admin_auth():
    app.dependency_overrides[get_admin_user] = lambda: {
        "userId": TEST_USER_ID,
        "isAdmin": True,
        "token": "jwt-token-for-tests"
    }

    yield

    app.dependency_overrides = {}


@respx.mock
async def test_get_users_success(async_client):
    respx.get(f"{BASE_URL}/api/v1/admin/users").mock(
        return_value=Response(200, json=MOCK_USERS_LIST)
    )

    response = await async_client.get("/api/v1/users/")

    assert response.status_code == 200
    assert response.json() == MOCK_USERS_LIST


@respx.mock
async def test_delete_user_success(async_client):
    respx.delete(f"{BASE_URL}/api/v1/admin/users/{TEST_USER_ID}").mock(
        return_value=Response(200, json={"success": True})
    )

    response = await async_client.delete(f"/api/v1/users/{TEST_USER_ID}")

    assert response.status_code == 200
    assert response.json() == {"success": True}


@respx.mock
async def test_update_user_success(async_client):
    update_payload = {"firstName": "Петр"}

    respx.patch(f"{BASE_URL}/api/v1/admin/users/{TEST_USER_ID}").mock(
        return_value=Response(200, json={"userId": TEST_USER_ID, "firstName": "Петр"})
    )

    response = await async_client.patch(
        f"/api/v1/users/{TEST_USER_ID}",
        json=update_payload
    )

    assert response.status_code == 200
    assert response.json()["firstName"] == "Петр"


@respx.mock
async def test_user_client_propagates_errors(async_client):

    respx.get(f"{BASE_URL}/api/v1/admin/users").mock(
        return_value=Response(404, json={"detail": "Пользователи не найдены"})
    )

    response = await async_client.get("/api/v1/users/")

    assert response.status_code == 404
    assert "Пользователи не найдены" in response.text


@respx.mock
async def test_delete_user_error_propagation(async_client):
    respx.delete(f"{BASE_URL}/api/v1/admin/users/{TEST_USER_ID}").mock(
        return_value=Response(400, json={"detail": "Невозможно удалить активного пользователя"})
    )

    response = await async_client.delete(f"/api/v1/users/{TEST_USER_ID}")

    assert response.status_code == 400
    assert "Невозможно удалить" in response.text


@respx.mock
async def test_update_user_error_propagation(async_client):
    update_payload = {"firstName": "Петр"}

    respx.patch(f"{BASE_URL}/api/v1/admin/users/{TEST_USER_ID}").mock(
        return_value=Response(422, json={"detail": "Неверный формат имени"})
    )

    response = await async_client.patch(
        f"/api/v1/users/{TEST_USER_ID}",
        json=update_payload
    )

    assert response.status_code == 422
    assert "Неверный формат имени" in response.text