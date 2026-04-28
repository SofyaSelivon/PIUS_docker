from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from src.schemas.pagination_schemas import PaginationSchema


class AddToCartRequestSchema(BaseModel):
    productId: UUID
    quantity: int = Field(
        gt=0, description="Количество товара для добавления в корзину"
    )

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class AddToCartResponseSchema(BaseModel):
    success: Optional[bool] = True
    cartCount: int


class CartMarketSchema(BaseModel):
    marketId: UUID
    marketName: str

    model_config = ConfigDict(from_attributes=True)


class CartItemResponseSchema(BaseModel):
    productId: UUID
    name: str
    price: float
    available: int
    quantity: int
    img: str
    market: CartMarketSchema | None = None

    model_config = ConfigDict(from_attributes=True)


class SellerProductSchema(BaseModel):
    productId: str = Field(alias="id")
    name: str
    price: float
    available: int
    marketId: UUID
    description: Optional[str] = None
    category: str
    img: Optional[str] = None

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class SellerGetProductsResponse(BaseModel):
    id: str
    marketId: str
    name: str
    description: str
    category: str
    price: float
    img: str
    available: int
    createdAt: datetime

    model_config = ConfigDict(from_attributes=True)


class ProductsListResponseSchema(BaseModel):
    items: list[SellerGetProductsResponse]
    pagination: PaginationSchema


class UpdateCartItemRequestSchema(BaseModel):
    productId: UUID
    quantity: int = Field(gt=0, description="Новое количество товара в корзине")


class UpdateCartItemResponseSchema(BaseModel):
    success: Optional[bool] = True
    cartCount: int
    totalPrice: float


class DeleteCartItemResponseSchema(BaseModel):
    success: Optional[bool] = True
    cartCount: int
    totalPrice: float


class CartResponseSchema(BaseModel):
    items: list[CartItemResponseSchema]
    totalPrice: float
