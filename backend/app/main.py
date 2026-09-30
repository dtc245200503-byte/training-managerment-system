from fastapi import FastAPI
from sqlalchemy import text

from app.database import engine
from app.routers.auth import router as auth_router
from app.routers.rbac import router as rbac_router


app = FastAPI(
    title="Training Management System API"
)

app.include_router(auth_router)
app.include_router(rbac_router)


@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }


@app.get("/health/db")
def database_health_check():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    return {
        "database": "connected"
    }