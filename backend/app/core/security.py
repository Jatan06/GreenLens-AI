import hashlib
import hmac
import os
from datetime import datetime, timedelta
from typing import Optional, Union, Any
import jwt

from app.config import settings


def hash_password(password: str) -> str:
    """Hash password using PBKDF2-HMAC-SHA256 with a unique salt."""
    salt = os.urandom(16)
    pwd_hash = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        100000
    )
    return f"{salt.hex()}:{pwd_hash.hex()}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against stored salt and hash."""
    try:
        if ":" not in hashed_password:
            return False
        salt_hex, hash_hex = hashed_password.split(":")
        salt = bytes.fromhex(salt_hex)
        expected_hash = bytes.fromhex(hash_hex)
        computed_hash = hashlib.pbkdf2_hmac(
            "sha256",
            plain_password.encode("utf-8"),
            salt,
            100000
        )
        return hmac.compare_digest(computed_hash, expected_hash)
    except Exception:
        return False


def create_access_token(
    subject: Union[str, Any],
    email: str,
    role: str = "citizen",
    expires_delta: Optional[timedelta] = None
) -> str:
    """Create JWT access token."""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        "sub": str(subject),
        "email": email,
        "role": role,
        "exp": expire,
        "iat": datetime.utcnow()
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """Decode and validate JWT access token."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None
