from uuid import uuid4

import httpx
import pytest
import respx
from httpx import Response
from src.app.config import settings

TEST_PRODUCT_ID = str(uuid4())
TEST_MARKET_ID = str(uuid4())

MOCK_SELLER_PRODUCTS = [
    {
        "id": TEST_PRODUCT_ID,
        "name": "Игровая приставка",
        "price": 75000.0,
        "available": 50,
        "marketId": TEST_MARKET_ID,
        "category": "Electronics",
        "description": "Супер консоль",
    }
]


ORDER_PAYLOAD = settings.ORDER_PAYLOAD


@pytest.fixture
def mock_seller():
    with respx.mock(assert_all_called=False) as mock:
        mock.post(f"{settings.SELLER_SERVICE_URL}/products/by-ids").mock(
            return_value=Response(200, json=MOCK_SELLER_PRODUCTS)
        )

        mock.post(f"{settings.SELLER_SERVICE_URL}/products/reserve").mock(
            return_value=Response(200, json={"success": True})
        )

        mock.post(f"{settings.SELLER_SERVICE_URL}/products/orders").mock(
            return_value=Response(200, json={"success": True})
        )

        mock.post(f"{settings.SELLER_SERVICE_URL}/products/info").mock(
            return_value=Response(200, json=MOCK_SELLER_PRODUCTS)
        )

        yield mock


async def test_create_order_empty_cart(client, auth_token):
    response = await client.post(
        "/api/v1/orders/",
        headers={"Authorization": f"Bearer {auth_token}"},
        json=ORDER_PAYLOAD,
    )

    assert response.status_code == 404


async def test_create_order_success(client, auth_token, mock_seller):
    await client.post(
        "/api/v1/cart/",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"productId": TEST_PRODUCT_ID, "quantity": 1},
    )

    response = await client.post(
        "/api/v1/orders/",
        headers={"Authorization": f"Bearer {auth_token}"},
        json=ORDER_PAYLOAD,
    )

    assert response.status_code == 201
    data = response.json()

    assert data["success"] is True
    assert "orderId" in data


async def test_create_order_seller_503(client, auth_token, mock_seller):
    mock_seller.post(f"{settings.SELLER_SERVICE_URL}/products/by-ids").mock(
        side_effect=httpx.ConnectError("Connection refused")
    )

    await client.post(
        "/api/v1/cart/",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"productId": TEST_PRODUCT_ID, "quantity": 1},
    )

    response = await client.post(
        "/api/v1/orders/",
        headers={"Authorization": f"Bearer {auth_token}"},
        json=ORDER_PAYLOAD,
    )

    assert response.status_code == 503
    assert response.json()["detail"] == "Сервис товаров недоступен"


async def test_create_order_reserve_failed(client, auth_token, mock_seller):
    mock_seller.post(f"{settings.SELLER_SERVICE_URL}/products/reserve").mock(
        return_value=Response(400)
    )

    await client.post(
        "/api/v1/cart/",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"productId": TEST_PRODUCT_ID, "quantity": 1},
    )

    response = await client.post(
        "/api/v1/orders/",
        headers={"Authorization": f"Bearer {auth_token}"},
        json=ORDER_PAYLOAD,
    )

    assert response.status_code == 400
    assert "Ошибка резервирования" in response.json()["detail"]


async def test_create_order_reserve_503(client, auth_token, mock_seller):
    mock_seller.post(f"{settings.SELLER_SERVICE_URL}/products/reserve").mock(
        side_effect=httpx.RequestError("Network timeout")
    )

    await client.post(
        "/api/v1/cart/",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"productId": TEST_PRODUCT_ID, "quantity": 1},
    )

    response = await client.post(
        "/api/v1/orders/",
        headers={"Authorization": f"Bearer {auth_token}"},
        json=ORDER_PAYLOAD,
    )

    assert response.status_code == 503
    assert response.json()["detail"] == "Сервис товаров недоступен для резервирования"


async def test_create_order_product_vanished(client, auth_token, mock_seller):
    mock_seller.post(f"{settings.SELLER_SERVICE_URL}/products/by-ids").mock(
        return_value=Response(200, json=[])
    )

    await client.post(
        "/api/v1/cart/",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"productId": TEST_PRODUCT_ID, "quantity": 1},
    )

    response = await client.post(
        "/api/v1/orders/",
        headers={"Authorization": f"Bearer {auth_token}"},
        json=ORDER_PAYLOAD,
    )

    assert response.status_code == 400
    assert "больше недоступен" in response.json()["detail"]


async def test_create_order_not_enough_stock_at_checkout(client, auth_token, mock_seller):
    mock_seller.post(f"{settings.SELLER_SERVICE_URL}/products/by-ids").mock(
        return_value=Response(
            200,
            json=[{**MOCK_SELLER_PRODUCTS[0], "available": 0}],
        )
    )

    await client.post(
        "/api/v1/cart/",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"productId": TEST_PRODUCT_ID, "quantity": 1},
    )

    response = await client.post(
        "/api/v1/orders/",
        headers={"Authorization": f"Bearer {auth_token}"},
        json=ORDER_PAYLOAD,
    )

    assert response.status_code == 400
    assert response.json()["detail"]["error"] == "not_enough_stock"


async def test_get_order_details_not_found(client, auth_token):
    random_id = str(uuid4())

    response = await client.get(
        f"/api/v1/orders/{random_id}",
        headers={"Authorization": f"Bearer {auth_token}"},
    )

    assert response.status_code == 404


async def test_get_user_orders(client, auth_token, mock_seller):
    await client.post(
        "/api/v1/cart/",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"productId": TEST_PRODUCT_ID, "quantity": 1},
    )

    await client.post(
        "/api/v1/orders/",
        headers={"Authorization": f"Bearer {auth_token}"},
        json=ORDER_PAYLOAD,
    )

    response = await client.get(
        "/api/v1/orders/?page=1&limit=10",
        headers={"Authorization": f"Bearer {auth_token}"},
    )

    assert response.status_code == 200
    data = response.json()

    assert data["success"] is True
    assert len(data["orders"]) >= 1
    assert "orderId" in data["orders"][0]


async def test_get_order_details_success(client, auth_token, mock_seller):
    await client.post(
        "/api/v1/cart/",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"productId": TEST_PRODUCT_ID, "quantity": 1},
    )

    order_resp = await client.post(
        "/api/v1/orders/",
        headers={"Authorization": f"Bearer {auth_token}"},
        json=ORDER_PAYLOAD,
    )

    order_id = order_resp.json()["orderId"]

    response = await client.get(
        f"/api/v1/orders/{order_id}",
        headers={"Authorization": f"Bearer {auth_token}"},
    )

    assert response.status_code == 200
    data = response.json()

    assert data["orderId"] == order_id
    assert "markets" in data


async def test_get_order_details_seller_503(client, auth_token, mock_seller):
    await client.post(
        "/api/v1/cart/",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"productId": TEST_PRODUCT_ID, "quantity": 1},
    )

    order_resp = await client.post(
        "/api/v1/orders/",
        headers={"Authorization": f"Bearer {auth_token}"},
        json=ORDER_PAYLOAD,
    )

    order_id = order_resp.json()["orderId"]

    mock_seller.post(f"{settings.SELLER_SERVICE_URL}/products/by-ids").mock(
        side_effect=httpx.ConnectError("Connection refused")
    )

    response = await client.get(
        f"/api/v1/orders/{order_id}",
        headers={"Authorization": f"Bearer {auth_token}"},
    )

    assert response.status_code == 503
    assert response.json()["detail"] == "Сервис товаров недоступен"
