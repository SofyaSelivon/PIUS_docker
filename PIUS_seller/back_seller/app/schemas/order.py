from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel

from app.models.order import OrderStatus


class CustomerOut(BaseModel):
    id: UUID
    fullName: str
    telegram: Optional[str] = None

    model_config = {
        "json_schema_extra": {
            "example": {
                "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                "fullName": "Ivan Petrov",
                "telegram": "@ivan",
            }
        }
    }


class OrderOut(BaseModel):
    id: UUID
    orderNumber: str
    customer: CustomerOut
    deliveryAddress: Optional[str] = None
    totalAmount: float
    itemsCount: int
    status: OrderStatus
    createdAt: datetime

    model_config = {
        "json_schema_extra": {
            "example": {
                "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                "orderNumber": "ORD-1001",
                "deliveryAddress": "Amsterdam, Damrak 1",
                "totalAmount": 120.5,
                "itemsCount": 3,
                "status": "pending",
                "createdAt": "2026-04-28T15:15:11.425Z",
                "customer": {
                    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    "fullName": "Ivan Petrov",
                    "telegram": "@ivan",
                },
            }
        }
    }


class StatisticsOut(BaseModel):
    totalOrders: int
    totalRevenue: float
    completedOrders: int
    processingOrders: int
    pendingOrders: int

    model_config = {
        "json_schema_extra": {
            "example": {
                "totalOrders": 120,
                "totalRevenue": 5600.5,
                "completedOrders": 80,
                "processingOrders": 30,
                "pendingOrders": 10,
            }
        }
    }


class PaginationOut(BaseModel):
    page: int
    limit: int
    totalItems: int
    totalPages: int

    model_config = {
        "json_schema_extra": {
            "example": {"page": 1, "limit": 10, "totalItems": 100, "totalPages": 10}
        }
    }


class PaginatedOrdersOut(BaseModel):
    statistics: StatisticsOut
    orders: List[OrderOut]
    pagination: PaginationOut


class OrderStatusUpdate(BaseModel):
    status: OrderStatus

    model_config = {"json_schema_extra": {"example": {"status": "pending"}}}


class SuccessResponse(BaseModel):
    success: bool

    model_config = {"json_schema_extra": {"example": {"success": True}}}
