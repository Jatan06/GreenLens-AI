from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate, LeaderboardUser
from app.core.auth import get_current_user

router = APIRouter(prefix="/api/v1/users", tags=["Users & Leaderboard"])


@router.get("/profile", response_model=UserResponse)
def get_user_profile(current_user: User = Depends(get_current_user)):
    """Fetch profile details and eco stats for current user."""
    return UserResponse.model_validate(current_user)


@router.put("/profile", response_model=UserResponse)
def update_user_profile(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update profile fields for current user."""
    if update_data.full_name is not None:
        current_user.full_name = update_data.full_name
    if update_data.username is not None and update_data.username != current_user.username:
        existing = db.query(User).filter(User.username == update_data.username).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken."
            )
        current_user.username = update_data.username

    db.commit()
    db.refresh(current_user)
    return UserResponse.model_validate(current_user)


@router.get("/stats")
def get_user_impact_stats(current_user: User = Depends(get_current_user)):
    """Return comprehensive sustainability metrics for the user."""
    return {
        "user_id": current_user.id,
        "total_reward_points": current_user.total_reward_points,
        "eco_score": current_user.eco_score,
        "carbon_saved_kg": current_user.carbon_saved_kg,
        "total_scans": current_user.total_scans,
        "streak_days": current_user.streak_days,
        "equivalent_trees_planted": round(current_user.carbon_saved_kg / 21.0, 2),
        "co2_reduction_percentage": round(min(current_user.carbon_saved_kg * 1.5, 95.0), 1)
    }


@router.get("/leaderboard", response_model=List[LeaderboardUser])
def get_global_leaderboard(limit: int = 10, db: Session = Depends(get_db)):
    """Fetch global citizen leaderboard ranked by total reward points and carbon saved."""
    users = (
        db.query(User)
        .filter(User.is_active == True)
        .order_by(desc(User.total_reward_points), desc(User.carbon_saved_kg))
        .limit(limit)
        .all()
    )

    leaderboard = []
    for idx, u in enumerate(users, start=1):
        leaderboard.append(
            LeaderboardUser(
                rank=idx,
                username=u.username,
                full_name=u.full_name,
                total_reward_points=u.total_reward_points,
                carbon_saved_kg=round(u.carbon_saved_kg, 2),
                eco_score=round(u.eco_score, 1),
                total_scans=u.total_scans
            )
        )
    return leaderboard
