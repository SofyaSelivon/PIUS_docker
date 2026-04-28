from fastapi import APIRouter, status

from src.schemas.healtcheck_schemas import HealthCheckResponse

router = APIRouter(prefix="/api/v1/cart", tags=["cart"])


@router.get(
    "/health",
    status_code=status.HTTP_200_OK,
    tags=["System"],
    response_model=HealthCheckResponse,
)
async def health_check():
    return HealthCheckResponse(status="ok", message="service is healthy")
