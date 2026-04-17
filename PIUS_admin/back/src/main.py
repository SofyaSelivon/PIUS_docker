import uvicorn
from fastapi import FastAPI
from src.routers import router

app = FastAPI(title="Pius Admin API")

app.include_router(router)

if __name__ == "__main__":
    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=8004,
        reload=True
    )