from fastapi import APIRouter, status

from app.schemas.healthcheck_schema import HealthCheckResponse

router = APIRouter(tags=["system"])


@router.get(
    "/api/v1/health",
    status_code=status.HTTP_200_OK,
    response_model=HealthCheckResponse,
)
async def health_check():
    return HealthCheckResponse(
        status="ok",
        message="service is healthy",
    )
