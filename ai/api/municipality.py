"""
Municipality & Analytics API Router for GreenLens AI Backend.
Delivers Dashboard, Analytics Aggregation, Heatmap, Forecasting, Route Optimization,
Admin Panel management, Scheduled Jobs, and Report Generation endpoints.
"""

from fastapi import APIRouter, Query, HTTPException, BackgroundTasks
from fastapi.responses import Response, JSONResponse
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

from services.analytics_service import analytics_service
from services.forecast_service import forecast_service
from services.route_optimizer import route_optimizer_service
from services.report_generator import report_generator_service
from services.scheduled_jobs import scheduled_jobs_manager

router = APIRouter(
    prefix="/api/v1/municipality",
    tags=["Municipality & Analytics"]
)


# ─────────────────────────────────────────────────────────────────────────────
# Pydantic Schemas for Requests
# ─────────────────────────────────────────────────────────────────────────────

class WaypointInput(BaseModel):
    id: str
    name: str
    latitude: float
    longitude: float
    fill_level: Optional[int] = 80
    priority: Optional[str] = "MEDIUM"


class RouteOptimizationRequest(BaseModel):
    truck_id: str = Field(..., example="TRUCK_MUNI_04")
    waypoints: Optional[List[WaypointInput]] = None


class AlertCreateRequest(BaseModel):
    title: str = Field(..., example="Bin Overflow Warning - East Ward")
    zone_id: str = Field(..., example="zone_east")
    severity: str = Field(..., example="HIGH")  # LOW, MEDIUM, HIGH, CRITICAL
    message: str = Field(..., example="Bin #09 at Laxmi Nagar Metro pillar 42 reached 86% fill capacity.")


# ─────────────────────────────────────────────────────────────────────────────
# 1. DASHBOARD & ANALYTICS APIs
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/dashboard", summary="Get Municipality Dashboard Overview")
def get_dashboard():
    """Retrieve top-level municipality metrics, health status, and key performance indicators."""
    return analytics_service.get_dashboard_overview()


@router.get("/analytics", summary="Get Aggregate Waste Analytics & Trends")
def get_analytics(period: str = Query("7d", description="Time period filter: 24h, 7d, or 30d")):
    """Retrieve detailed waste category breakdowns, daily trends, and ward compliance scores."""
    if period not in ["24h", "7d", "30d"]:
        raise HTTPException(status_code=400, detail="Invalid period. Choose from '24h', '7d', or '30d'.")
    return analytics_service.get_analytics_metrics(period=period)


# ─────────────────────────────────────────────────────────────────────────────
# 2. HEATMAP APIs
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/heatmap", summary="Get Geospatial Waste Density & Overflow Heatmap")
def get_heatmap(zone_id: Optional[str] = Query(None, description="Optional zone filter")):
    """
    Retrieve geospatial coordinates with intensity weights, category tags,
    and overflow risk levels for rendering interactive GIS/Leaflet heatmaps.
    """
    points = analytics_service.get_heatmap_points(zone_id=zone_id)
    return {
        "total_points": len(points),
        "zone_filter": zone_id or "ALL",
        "points": points
    }


# ─────────────────────────────────────────────────────────────────────────────
# 3. FORECAST APIs & SERVICES
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/forecast", summary="Get Predictive Waste Generation & Bin Fill Projections")
def get_forecast(
    days: int = Query(7, ge=1, le=30, description="Forecast window in days (1 to 30)"),
    zone_id: Optional[str] = Query(None, description="Filter forecast for a specific ward/zone")
):
    """
    Generate time-series predictions of daily waste volume, peak generation days,
    and smart bin overflow projections using regression modeling.
    """
    return forecast_service.generate_waste_forecast(days_ahead=days, zone_id=zone_id)


# ─────────────────────────────────────────────────────────────────────────────
# 4. ROUTE OPTIMIZATION APIs & SERVICES
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/routes", summary="Get Pre-Computed Municipal Fleet Routes")
def get_active_routes():
    """Retrieve current active waste collection routes optimized for municipal trucks."""
    default_route = route_optimizer_service.optimize_route(truck_id="TRUCK_MUNI_01")
    return {
        "active_routes_count": 1,
        "routes": [default_route]
    }


@router.post("/routes/optimize", summary="Optimize Collection Route for Specific Truck")
def optimize_route(payload: RouteOptimizationRequest):
    """
    Solves Traveling Salesperson Problem (TSP) with priority weighting for high fill-level bins.
    Returns ordered waypoints, estimated travel time, distance, and fuel/CO2 efficiency savings.
    """
    waypoints_dict = [wp.model_dump() for wp in payload.waypoints] if payload.waypoints else None
    return route_optimizer_service.optimize_route(truck_id=payload.truck_id, waypoints_input=waypoints_dict)


# ─────────────────────────────────────────────────────────────────────────────
# 5. ADMIN PANEL APIs
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/admin/fleet", summary="Get Municipal Truck Fleet Status")
def get_fleet_status():
    """List municipal collection truck fleet status, drivers, assigned routes, and fuel levels."""
    return {
        "total_trucks": 28,
        "active_trucks": 24,
        "maintenance_trucks": 4,
        "fleet": [
            {"truck_id": "TRUCK_MUNI_01", "driver": "Rajesh Kumar", "zone": "East Ward", "status": "ON_ROUTE", "fuel_level_percent": 82, "capacity_filled_percent": 64},
            {"truck_id": "TRUCK_MUNI_02", "driver": "Amit Singh", "zone": "North Ward", "status": "ON_ROUTE", "fuel_level_percent": 75, "capacity_filled_percent": 88},
            {"truck_id": "TRUCK_MUNI_03", "driver": "Suresh Patel", "zone": "South Ward", "status": "STANDBY", "fuel_level_percent": 95, "capacity_filled_percent": 0},
            {"truck_id": "TRUCK_MUNI_04", "driver": "Vikram Verma", "zone": "Central CBD", "status": "MAINTENANCE", "fuel_level_percent": 30, "capacity_filled_percent": 0},
        ]
    }


@router.get("/admin/alerts", summary="List Active Municipal Alerts")
def get_alerts():
    """Retrieve list of active system alerts including bin overflows and hazardous waste detections."""
    return {
        "active_alerts_count": 3,
        "alerts": [
            {
                "id": "ALT_001",
                "title": "High Overflow Risk - Bin #09",
                "zone": "East Ward (Laxmi Nagar)",
                "severity": "CRITICAL",
                "triggered_at": "10 minutes ago",
                "status": "UNRESOLVED"
            },
            {
                "id": "ALT_002",
                "title": "Hazardous Waste Cluster Detected",
                "zone": "Central CBD",
                "severity": "HIGH",
                "triggered_at": "25 minutes ago",
                "status": "DISPATCHED"
            },
            {
                "id": "ALT_003",
                "title": "Collection Route #B4 Delayed",
                "zone": "North Ward",
                "severity": "MEDIUM",
                "triggered_at": "40 minutes ago",
                "status": "ACKNOWLEDGED"
            }
        ]
    }


@router.post("/admin/alerts", summary="Create/Broadcast Municipal Alert")
def create_alert(payload: AlertCreateRequest):
    """Broadcast a new municipal alert to field dispatchers and zone supervisors."""
    return {
        "success": True,
        "alert_id": f"ALT_MANUAL_{payload.zone_id.upper()}",
        "message": f"Alert '{payload.title}' registered successfully with severity '{payload.severity}'.",
        "payload": payload.model_dump()
    }


# ─────────────────────────────────────────────────────────────────────────────
# 6. SCHEDULED JOBS APIs
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/jobs/history", summary="Get Scheduled Job Execution Logs")
def get_job_history():
    """Retrieve logs of recently executed background aggregation and monitoring jobs."""
    return {
        "total_jobs_logged": len(scheduled_jobs_manager.get_job_history()),
        "jobs": scheduled_jobs_manager.get_job_history()
    }


@router.post("/jobs/run", summary="Trigger Background Scheduled Job Manually")
async def trigger_job(
    job_type: str = Query(..., description="Type of job: 'daily_aggregation', 'overflow_monitor', or 'route_precomputation'"),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    """Manually execute a scheduled background job on-demand."""
    if job_type == "daily_aggregation":
        background_tasks.add_task(scheduled_jobs_manager.run_daily_aggregation_job)
        return {"success": True, "message": "Daily Aggregation job queued in background."}
    elif job_type == "overflow_monitor":
        background_tasks.add_task(scheduled_jobs_manager.run_bin_overflow_monitor_job)
        return {"success": True, "message": "Bin Overflow Monitor job queued in background."}
    elif job_type == "route_precomputation":
        background_tasks.add_task(scheduled_jobs_manager.run_route_optimization_job)
        return {"success": True, "message": "Route Pre-computation job queued in background."}
    else:
        raise HTTPException(
            status_code=400,
            detail="Invalid job_type. Allowed: 'daily_aggregation', 'overflow_monitor', 'route_precomputation'."
        )


# ─────────────────────────────────────────────────────────────────────────────
# 7. REPORT GENERATION APIs
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/reports/summary", summary="Get Executive Sustainability Summary Report")
def get_summary_report(
    city: str = Query("Delhi NCR", description="City/Municipality name"),
    month: str = Query("July 2026", description="Report period month")
):
    """Generates executive summary report for municipal leaders and ESG compliance."""
    return report_generator_service.generate_executive_summary(city_name=city, month=month)


@router.get("/reports/export", summary="Export Municipal Waste Data Report (CSV)")
def export_csv():
    """Generates and downloads a CSV export file of historical municipal waste metrics by zone."""
    csv_data = report_generator_service.export_csv_report()
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=greenlens_municipality_report.csv"}
    )
