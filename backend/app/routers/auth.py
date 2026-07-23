from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.core.security import hash_password, verify_password, create_access_token
from app.core.auth import get_current_user

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    """Register a new citizen or user account."""
    existing_email = db.query(User).filter(User.email == user_in.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )

    existing_username = db.query(User).filter(User.username == user_in.username).first()
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This username is already taken."
        )

    db_user = User(
        email=user_in.email,
        username=user_in.username,
        full_name=user_in.full_name or user_in.username,
        hashed_password=hash_password(user_in.password),
        role="citizen",
        total_reward_points=50,  # Welcome bonus points
        eco_score=100.0,
        carbon_saved_kg=0.0,
        total_scans=0,
        streak_days=1
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    token = create_access_token(subject=db_user.id, email=db_user.email, role=db_user.role)
    return Token(access_token=token, token_type="bearer", user=UserResponse.model_validate(db_user))


@router.post("/login", response_model=Token)
def login_user(user_in: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user with email and password."""
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is deactivated."
        )

    token = create_access_token(subject=user.id, email=user.email, role=user.role)
    return Token(access_token=token, token_type="bearer", user=UserResponse.model_validate(user))


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Get profile of authenticated user."""
    return UserResponse.model_validate(current_user)
