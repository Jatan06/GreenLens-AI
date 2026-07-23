from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.recycling_center import RecyclingCenter
from app.schemas.recycling_center import RecyclingCenterResponse, RecyclingCenterCreate
from app.core.auth import get_current_admin
from app.services.location_service import get_nearby_recycling_centers, calculate_haversine_distance

router = APIRouter(prefix="/api/v1/recycling-centers", tags=["Recycling Centers"])


def seed_default_centers(db: Session):
    """Seed initial recycling centers if database table is empty."""
    if db.query(RecyclingCenter).count() == 0:
        default_data = [
            RecyclingCenter(
                name="EcoHub E-Waste & Plastic Depot",
                address="104 Innovation Way, Sector 62",
                latitude=37.7749,
                longitude=-122.4194,
                contact_phone="+1-800-555-RECYCLE",
                categories_accepted=["Recyclable", "E-Waste", "Plastic"],
                opening_hours="08:00 - 20:00",
                rating=4.8
            ),
            RecyclingCenter(
                name="City Organic Composting Center",
                address="45 Civic Green Blvd",
                latitude=37.7833,
                longitude=-122.4167,
                contact_phone="+1-800-555-COMPOST",
                categories_accepted=["Compostable", "Organic Waste", "Food Scraps"],
                opening_hours="07:00 - 19:00",
                rating=4.6
            ),
            RecyclingCenter(
                name="Hazardous Material & Battery Facility",
                address="88 Chemical Safety Park",
                latitude=37.7650,
                longitude=-122.4240,
                contact_phone="+1-800-555-HAZMAT",
                categories_accepted=["Hazardous", "E-Waste", "Batteries", "Chemicals"],
                opening_hours="09:00 - 17:00",
                rating=4.9
            )
        ]
        db.add_all(default_data)
        db.commit()


@router.get("/nearby", response_model=List[RecyclingCenterResponse])
def get_nearby_centers(
    latitude: float = Query(..., description="Latitude of user location"),
    longitude: float = Query(..., description="Longitude of user location"),
    category: Optional[str] = Query(None, description="Filter by waste category e.g. E-Waste"),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """Fetch nearest recycling centers sorted by geographic distance (km)."""
    seed_default_centers(db)
    centers = db.query(RecyclingCenter).filter(RecyclingCenter.is_active == True).all()

    annotated_centers = []
    for c in centers:
        # Category filter check if requested
        if category and c.categories_accepted:
            cat_match = any(category.lower() in cat.lower() for cat in c.categories_accepted)
            if not cat_match:
                continue

        dist = calculate_haversine_distance(latitude, longitude, c.latitude, c.longitude)
        item = RecyclingCenterResponse.model_validate(c)
        item.distance_km = dist
        annotated_centers.append(item)

    # Sort by distance
    annotated_centers.sort(key=lambda x: x.distance_km if x.distance_km is not None else 99999.0)
    return annotated_centers[:limit]


@router.get("", response_model=List[RecyclingCenterResponse])
def list_all_recycling_centers(db: Session = Depends(get_db)):
    """List all registered recycling centers."""
    seed_default_centers(db)
    centers = db.query(RecyclingCenter).filter(RecyclingCenter.is_active == True).all()
    return [RecyclingCenterResponse.model_validate(c) for c in centers]


@router.post("", response_model=RecyclingCenterResponse, status_code=status.HTTP_201_CREATED)
def create_recycling_center(
    center_in: RecyclingCenterCreate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin endpoint: Register a new recycling center facility."""
    db_center = RecyclingCenter(
        name=center_in.name,
        address=center_in.address,
        latitude=center_in.latitude,
        longitude=center_in.longitude,
        contact_phone=center_in.contact_phone,
        categories_accepted=center_in.categories_accepted,
        opening_hours=center_in.opening_hours or "09:00 - 18:00",
        rating=center_in.rating or 4.5
    )
    db.add(db_center)
    db.commit()
    db.refresh(db_center)
    return RecyclingCenterResponse.model_validate(db_center)
