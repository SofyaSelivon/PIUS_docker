from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from logreg.auth_routers import router as auth_router
from src.routers.admin_routers import router as admin_router
from src.routers.cart_routers import router as cart_router
from src.routers.healthcheck_router import router as healthcheck_router
from src.routers.order_routers import router as order_router
from src.routers.user_routers import router as user_router
from starlette.middleware.cors import CORSMiddleware


def get_app() -> FastAPI:
    app = FastAPI(
        docs_url="/docs",
        openapi_url="/openapi.json",
        swagger_ui_parameters={"persistAuthorization": True},
    )

    def custom_openapi():
        if app.openapi_schema:
            return app.openapi_schema

        openapi_schema = get_openapi(
            title="Marketplace API",
            version="1.0.0",
            routes=app.routes,
        )

        openapi_schema["components"]["securitySchemes"] = {
            "BearerAuth": {
                "type": "http",
                "scheme": "bearer",
                "bearerFormat": "JWT",
            }
        }

        for path in openapi_schema["paths"]:
            for method in openapi_schema["paths"][path]:
                openapi_schema["paths"][path][method]["security"] = [{"BearerAuth": []}]

        app.openapi_schema = openapi_schema

        return app.openapi_schema

    app.openapi = custom_openapi

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(cart_router)
    app.include_router(order_router)
    app.include_router(user_router)
    app.include_router(auth_router)
    app.include_router(admin_router)
    app.include_router(healthcheck_router)

    return app
