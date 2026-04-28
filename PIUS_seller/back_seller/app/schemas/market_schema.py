from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class MarketResponse(BaseModel):
    market_id: UUID = Field(alias="marketId")
    market_name: str = Field(alias="marketName")
    description: Optional[str]
    created_at: datetime = Field(alias="createdAt")

    class Config:
        from_attributes = True
        populate_by_name = True

        json_schema_extra = {
            "example": {
                "marketId": "9003fb4a-8cf9-435a-9f1c-c54249c19d39",
                "marketName": "My Market",
                "description": "My shop description",
                "createdAt": "2026-04-28T14:43:24.465154+00:00",
            }
        }


class MarketCreate(BaseModel):
    marketName: str
    description: str | None = None

    class Config:
        json_schema_extra = {"example": {"marketName": "My Market", "description": "My shop"}}


class MarketUpdate(BaseModel):
    market_name: Optional[str] = None
    description: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {"market_name": "Updated Market", "description": "Updated description"}
        }


class SuccessResponse(BaseModel):
    success: bool

    class Config:
        json_schema_extra = {"example": {"success": True}}


class ErrorDetail(BaseModel):
    code: str
    message: str
    meta: dict = {}


class ErrorResponse(BaseModel):
    data: None = None
    errors: list[ErrorDetail]
    meta: dict = {}

    class Config:
        json_schema_extra = {
            "example": {
                "data": None,
                "errors": [{"code": "400", "message": "Market already exists", "meta": {}}],
                "meta": {},
            }
        }
