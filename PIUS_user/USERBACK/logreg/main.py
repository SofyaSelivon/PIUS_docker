from fastapi import FastAPI
from logreg.auth_routers import router

app = FastAPI(title="Auth & LogReg Service")

app.include_router(router, prefix="/api/v1/auth")
