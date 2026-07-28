from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

db_url = settings.DATABASE_URL
connect_args = {}

if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    db_url,
    connect_args=connect_args,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Ensure all SQLAlchemy tables are created."""
    # Import models so Base metadata is populated
    import app.models  # noqa: F401
    Base.metadata.create_all(bind=engine)


# Auto-create tables if missing
init_db()

