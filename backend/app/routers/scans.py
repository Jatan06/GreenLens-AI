import shutil
import uuid
from typing import List, Optional
from pathlib import Path
from fastapi import APIRouter, Depends, File, Form, UploadFile, HTTPException, status
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.user import User
from app.models.scan import ScanHistory
from app.schemas.scan import ScanResponse, ScanHistoryItem
from app.core.auth import get_optional_current_user, get_current_user
from app.services.ai_service import process_image_scan
from app.services.location_service import get_nearby_recycling_centers

router = APIRouter(prefix="/api/v1/scans", tags=["AI Scan & History"])


@router.post("/analyze", response_model=ScanResponse)
async def analyze_waste_scan(
    file: UploadFile = File(...),
    latitude: float = Form(37.7749),
    longitude: float = Form(-122.4194),
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload a waste image to execute AI object detection, waste classification,
    carbon calculation, and reward allocation.
    """
    # Validate MIME type
    valid_mimes = ["image/jpeg", "image/png", "image/webp", "image/jpg"]
    if file.content_type not in valid_mimes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type: {file.content_type}. Please upload JPEG, PNG, or WebP."
        )

    # Save uploaded file
    file_ext = Path(file.filename).suffix or ".jpg"
    unique_filename = f"scan_{uuid.uuid4().hex[:10]}{file_ext}"
    saved_file_path = settings.UPLOAD_DIR / unique_filename

    try:
        with open(saved_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process uploaded image file: {str(e)}"
        )

    # Execute AI Prediction pipeline
    ai_result = process_image_scan(saved_file_path)

    overall = ai_result.get("overall", {})
    summary = ai_result.get("summary", {})
    detections = ai_result.get("detections", [])
    annotated_image = ai_result.get("annotated_image", f"/outputs/{unique_filename}")

    # Fetch nearby recycling centers based on user coordinates
    recycling_centers = get_nearby_recycling_centers(latitude, longitude)

    # Persist Scan Record in DB
    user_id = current_user.id if current_user else None
    
    db_scan = ScanHistory(
        user_id=user_id,
        image_name=unique_filename,
        image_url=f"/uploads/{unique_filename}",
        annotated_image_url=annotated_image,
        total_items=overall.get("total_items", 0),
        total_reward=overall.get("total_reward", 0),
        total_carbon_saved=overall.get("total_carbon_saved", 0.0),
        eco_score=overall.get("eco_score", 50),
        latitude=latitude,
        longitude=longitude,
        summary_json=summary,
        detections_json=detections
    )
    db.add(db_scan)

    # If user is authenticated, update user rewards, eco score, and total scan count
    if current_user:
        current_user.total_reward_points += overall.get("total_reward", 0)
        current_user.carbon_saved_kg = round(
            current_user.carbon_saved_kg + overall.get("total_carbon_saved", 0.0), 3
        )
        current_user.total_scans += 1
        # Update rolling eco_score average
        current_user.eco_score = round(
            (current_user.eco_score * (current_user.total_scans - 1) + overall.get("eco_score", 50))
            / current_user.total_scans, 1
        )

    db.commit()
    db.refresh(db_scan)

    return {
        "id": db_scan.id,
        "success": True,
        "overall": overall,
        "summary": summary,
        "detections": detections,
        "annotated_image": annotated_image,
        "recycling_centers": recycling_centers,
        "created_at": db_scan.created_at
    }


@router.get("/history", response_model=List[ScanHistoryItem])
def get_user_scan_history(
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve scan history for the authenticated user."""
    scans = (
        db.query(ScanHistory)
        .filter(ScanHistory.user_id == current_user.id)
        .order_by(ScanHistory.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [ScanHistoryItem.model_validate(s) for s in scans]


@router.get("/{scan_id}", response_model=ScanHistoryItem)
def get_scan_detail(
    scan_id: int,
    db: Session = Depends(get_db)
):
    """Retrieve detailed scan record by ID."""
    scan = db.query(ScanHistory).filter(ScanHistory.id == scan_id).first()
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scan record with ID {scan_id} not found."
        )
    return ScanHistoryItem.model_validate(scan)
