from datetime import date
from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.controllers.market_controller import (
    create_market,
    get_my_market,
    market_exists,
    update_market,
)
from app.database.session import get_db
from app.models.user import User
from app.schemas.market_schema import (
    ErrorResponse,
    MarketCreate,
    MarketResponse,
    MarketUpdate,
    SuccessResponse,
)
from app.security.jwt_dependency import get_current_user

router = APIRouter(prefix="/api/v1/markets", tags=["markets"])


async def ensure_user_exists(db: AsyncSession, user_id: str) -> User:
    user = await db.get(User, user_id)

    if not user:
        user = User(
            userId=user_id,
            login=f"user_{user_id}",
            passwordHash="stub_password",
            firstName="John",
            lastName="Doe",
            patronymic="Stub",
            dateOfBirth=date(2000, 1, 1),
            city="Unknown",
            telegram="@stub",
            telegramChatId="0",
            isSeller=True,
        )

        db.add(user)
        await db.commit()

    return user


@router.post(
    "/create",
    response_model=MarketResponse,
    summary="Create Market",
    responses={
        400: {
            "model": ErrorResponse,
            "description": "Market already exists",
        }
    },
)
async def create_market_route(
    data: MarketCreate,
    db: AsyncSession = Depends(get_db),
    user: Dict[str, Any] = Depends(get_current_user),
):
    await ensure_user_exists(db, user["userId"])

    existing = await market_exists(db, user["userId"])
    if existing:
        raise HTTPException(status_code=400, detail="Market already exists")

    market = await create_market(db, user["userId"], data)
    return market


@router.get(
    "/my",
    response_model=MarketResponse,
    summary="Get My Market",
    responses={
        404: {
            "model": ErrorResponse,
            "description": "Market not found",
        }
    },
)
async def my_market(
    db: AsyncSession = Depends(get_db), user: Dict[str, Any] = Depends(get_current_user)
):
    market = await get_my_market(db, user["userId"])

    if not market:
        return {"market": None}

    return market


@router.patch(
    "/my",
    response_model=SuccessResponse,
    summary="Update My Market",
)
async def update_my_market(
    data: MarketUpdate,
    db: AsyncSession = Depends(get_db),
    user: Dict[str, Any] = Depends(get_current_user),
):
    await update_market(db, user["userId"], data)

    return {"success": True}
