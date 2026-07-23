import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    APP_TITLE: str = "GreenLens AI Backend API"
    APP_VERSION: str = "2.0.0"
    APP_DESCRIPTION: str = "AI-Powered Waste Segregation, Reward Intelligence & Circular Economy Platform API"
    
    # Environment & Host Settings
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "greenlens_super_secret_jwt_key_2026_change_in_production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database Settings - Defaults to SQLite for immediate local dev, or Postgres if configured/in docker
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./greenlens.db")
    
    # Media & File Upload Paths
    UPLOAD_DIR: Path = BASE_DIR / "ai" / "uploads"
    OUTPUT_DIR: Path = BASE_DIR / "ai" / "outputs"
    
    # CORS Configuration
    CORS_ORIGINS: list[str] = ["*"]

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()

# Ensure directories exist
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
settings.OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
