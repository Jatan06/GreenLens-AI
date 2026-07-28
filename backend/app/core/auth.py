from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.core.security import decode_access_token
from app.schemas.user import TokenData

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception

    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception

    user_id_str: str = payload.get("sub")
    if user_id_str is None:
        raise credentials_exception

    try:
        user_id = int(user_id_str)
    except ValueError:
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
        
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user account")
        
    return user


def get_optional_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """Returns User if valid bearer token provided, else returns None (for guest actions)."""
    if not token:
        return None
    try:
        payload = decode_access_token(token)
        if not payload:
            return None
        user_id = int(payload.get("sub"))
        user = db.query(User).filter(User.id == user_id).first()
        return user if (user and user.is_active) else None
    except Exception:
        return None


def get_current_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    if current_user.role not in ["admin", "municipality_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operation restricted to administrative accounts"
        )
    return current_user
