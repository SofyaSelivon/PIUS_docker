from typing import List
from uuid import UUID

import httpx
from fastapi import APIRouter
from fastapi.params import Depends
from pydantic import BaseModel
from starlette import status

from logreg.security import get_current_user
from src.app.dependencies import get_cart_service
from src.models.user import User
from src.schemas.cart_schemas import (
    AddToCartRequestSchema,
    AddToCartResponseSchema,
    CartResponseSchema,
    DeleteCartItemResponseSchema,
    UpdateCartItemRequestSchema,
    UpdateCartItemResponseSchema,
)
from src.services.cart_service import SELLER_SERVICE_URL, CartService

router = APIRouter(prefix="/api/v1/cart", tags=["cart"])


class ProductsByIdsRequest(BaseModel):
    productIds: List[UUID]


@router.post(
    "/",
    response_model=AddToCartResponseSchema,
    status_code=status.HTTP_201_CREATED,
)
async def add_to_cart(
    data: AddToCartRequestSchema,
    current_user: User = Depends(get_current_user),
    cart_service: CartService = Depends(get_cart_service),
):
    return await cart_service.add_to_cart_service(
        user_id=current_user.userId,
        data=data,
    )


@router.get(
    "/",
    response_model=CartResponseSchema,
)
async def get_cart(
    current_user: User = Depends(get_current_user),
    cart_service: CartService = Depends(get_cart_service),
):
    return await cart_service.get_cart_service(
        user_id=current_user.userId,
    )


@router.patch("/{product_id}")
async def update_cart_item(
    product_id: UUID,
    data: UpdateCartItemRequestSchema,
    current_user: User = Depends(get_current_user),
    cart_service: CartService = Depends(get_cart_service),
):
    data.productId = product_id

    return await cart_service.update_cart_item_service(
        user_id=current_user.userId,
        data=data
    )


@router.delete(
    "/item/{product_id}",
    response_model=DeleteCartItemResponseSchema,
)
async def delete_cart_item(
    product_id: UUID,
    current_user: User = Depends(get_current_user),
    cart_service: CartService = Depends(get_cart_service),
):
    return await cart_service.delete_cart_item_service(
        user_id=current_user.userId,
        product_id=product_id,
    )


@router.post(
    "/products/by-ids",
)
async def get_products_by_ids_via_cart(
    data: ProductsByIdsRequest,
    cart_service: CartService = Depends(get_cart_service),
):
    products = await cart_service.get_products_from_seller(data.productIds)
    return list(products.values())


@router.get("/products")
async def get_products_via_cart(
    page: int = 1,
    limit: int = 12,
    search: str | None = None,
    category: str | None = None,
    minPrice: float | None = None,
    maxPrice: float | None = None,
    available: bool | None = None,
):
    params = {
        "page": page,
        "limit": limit,
    }

    if search:
        params["search"] = search
    if category:
        params["category"] = category
    if minPrice is not None:
        params["minPrice"] = minPrice
    if maxPrice is not None:
        params["maxPrice"] = maxPrice
    if available is not None:
        params["available"] = available

    async with httpx.AsyncClient(timeout=10.0) as client:
        url = f"{SELLER_SERVICE_URL}/products/"

        response = await client.get(url, params=params)

        response.raise_for_status()

        return response.json()