import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.reward import RewardCatalog, UserRewardTransaction
from app.schemas.reward import (
    RewardCatalogResponse,
    RewardRedeemRequest,
    RewardRedeemResponse,
    UserRewardTransactionResponse
)
from app.core.auth import get_current_user

router = APIRouter(prefix="/api/v1/rewards", tags=["Rewards & Redemption"])


def seed_default_rewards(db: Session):
    """Seed catalog with initial eco-reward offerings if empty."""
    if db.query(RewardCatalog).count() == 0:
        default_items = [
            RewardCatalog(
                title="$5 Off Eco-Store Grocery Coupon",
                description="Get $5 discount on organic produce and eco-friendly household goods.",
                category="Discount",
                points_cost=100,
                discount_code_prefix="ECO5",
                partner_name="GreenGrocers Market",
                image_url="https://images.unsplash.com/photo-1542838132-92c53300491e?w=500"
            ),
            RewardCatalog(
                title="Free Public Transit Single Ride Pass",
                description="Redeem for 1 free city bus or subway ticket.",
                category="Mobility",
                points_cost=150,
                discount_code_prefix="TRANSIT",
                partner_name="City Metro Authority",
                image_url="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500"
            ),
            RewardCatalog(
                title="Plant a Tree in Your Name",
                description="We will plant a native tree seedling on your behalf with photo updates.",
                category="Impact",
                points_cost=250,
                discount_code_prefix="TREE",
                partner_name="OneTreePlanted Org",
                image_url="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=500"
            ),
            RewardCatalog(
                title="20% Off Reusable Stainless Coffee Tumbler",
                description="Save 20% on zero-waste stainless steel drinkware.",
                category="Merchandise",
                points_cost=80,
                discount_code_prefix="TUMBLER20",
                partner_name="ZeroWaste Gear",
                image_url="https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500"
            )
        ]
        db.add_all(default_items)
        db.commit()


@router.get("", response_model=List[RewardCatalogResponse])
def get_reward_catalog(db: Session = Depends(get_db)):
    """Fetch available rewards catalog."""
    seed_default_rewards(db)
    rewards = db.query(RewardCatalog).filter(RewardCatalog.is_active == True).all()
    return [RewardCatalogResponse.model_validate(r) for r in rewards]


@router.post("/redeem", response_model=RewardRedeemResponse)
def redeem_reward(
    payload: RewardRedeemRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Redeem user reward points for a specific reward item."""
    reward = db.query(RewardCatalog).filter(RewardCatalog.id == payload.reward_id).first()
    if not reward or not reward.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reward item not found or inactive."
        )

    if current_user.total_reward_points < reward.points_cost:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient reward points. You need {reward.points_cost} points, but have {current_user.total_reward_points}."
        )

    # Deduct points from user balance
    current_user.total_reward_points -= reward.points_cost

    # Generate unique voucher code
    redemption_code = f"{reward.discount_code_prefix}-{uuid.uuid4().hex[:8].upper()}"

    transaction = UserRewardTransaction(
        user_id=current_user.id,
        reward_id=reward.id,
        points_spent=reward.points_cost,
        redemption_code=redemption_code,
        is_used=False
    )
    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    return RewardRedeemResponse(
        success=True,
        transaction_id=transaction.id,
        redemption_code=redemption_code,
        reward_title=reward.title,
        points_spent=reward.points_cost,
        remaining_points=current_user.total_reward_points,
        message=f"Successfully redeemed {reward.title}! Use code {redemption_code} at checkout."
    )


@router.get("/my-rewards", response_model=List[UserRewardTransactionResponse])
def get_user_redeemed_rewards(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get list of all reward vouchers redeemed by the current user."""
    transactions = (
        db.query(UserRewardTransaction)
        .filter(UserRewardTransaction.user_id == current_user.id)
        .order_by(UserRewardTransaction.redeemed_at.desc())
        .all()
    )

    results = []
    for tx in transactions:
        item = UserRewardTransactionResponse.model_validate(tx)
        if tx.reward:
            item.reward_title = tx.reward.title
            item.partner_name = tx.reward.partner_name
        results.append(item)
    return results
