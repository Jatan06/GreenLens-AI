import sys
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.openapi.utils import get_openapi

# Ensure app package is in path
sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.config import settings
from app.database import init_db
from app.routers import (
    auth as auth_router,
    users as users_router,
    scans as scans_router,
    rewards as rewards_router,
    recycling_centers as recycling_centers_router,
)

# Import municipality router from ai package if present
try:
    from api.municipality import router as municipality_router
except ImportError:
    municipality_router = None

# Initialize FastAPI App
app = FastAPI(
    title=settings.APP_TITLE,
    description=settings.APP_DESCRIPTION,
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file mounts for scan images and detection annotations
app.mount("/uploads", StaticFiles(directory=str(settings.UPLOAD_DIR)), name="uploads")
app.mount("/outputs", StaticFiles(directory=str(settings.OUTPUT_DIR)), name="outputs")

# Register API Routers
app.include_router(auth_router.router)
app.include_router(users_router.router)
app.include_router(scans_router.router)
app.include_router(rewards_router.router)
app.include_router(recycling_centers_router.router)

if municipality_router:
    app.include_router(municipality_router)


@app.on_event("startup")
def on_startup():
    """Initialize database tables on FastAPI application startup."""
    init_db()


@app.get("/", tags=["Health"])
def root_status():
    return {
        "status": "online",
        "app": settings.APP_TITLE,
        "version": settings.APP_VERSION,
        "docs": "/docs"
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "database": settings.DATABASE_URL.split(":")[0]
    }


# Custom Swagger OpenAPI documentation customization
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="GreenLens AI - Core Backend & APIs",
        version="2.0.0",
        description="Comprehensive REST API documentation for GreenLens AI platform including JWT authentication, waste scan AI inference, user eco-stats, reward redemption, and recycling center location queries.",
        routes=app.routes,
    )
    openapi_schema["info"]["x-logo"] = {
        "url": "https://raw.githubusercontent.com/Jatan06/GreenLens-AI/main/frontend/public/favicon.ico"
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
