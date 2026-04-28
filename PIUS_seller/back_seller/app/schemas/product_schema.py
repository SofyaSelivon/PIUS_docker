from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from app.enums.product_category import ProductCategory


class ProductCreate(BaseModel):
    name: str
    description: str
    category: ProductCategory
    price: Decimal
    available: int
    img: Optional[str]

    class Config:
        json_schema_extra = {
            "example": {
                "name": "iPhone 15",
                "description": "Apple smartphone",
                "category": "electronics",
                "price": 999.99,
                "available": 10,
                "img": "https://example.com/img.png",
            }
        }


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[Decimal] = None
    available: Optional[int] = None

    class Config:
        json_schema_extra = {"example": {"name": "iPhone 15 Pro", "price": 1099.99, "available": 5}}


class ProductResponse(BaseModel):
    id: UUID
    name: str
    price: Decimal
    category: ProductCategory
    available: int
    img: Optional[str]

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                "name": "iPhone 15",
                "price": 999.99,
                "category": "electronics",
                "available": 10,
                "img": "https://example.com/img.png",
            }
        }


class ProductListResponse(BaseModel):
    items: list[ProductResponse]
    pagination: dict

    class Config:
        json_schema_extra = {
            "example": {
                "items": [
                    {
                        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                        "name": "iPhone 15",
                        "price": 999.99,
                        "category": "electronics",
                        "available": 10,
                        "img": "https://example.com/img.png",
                    }
                ],
                "pagination": {"page": 1, "limit": 12, "totalItems": 100, "totalPages": 9},
            }
        }
