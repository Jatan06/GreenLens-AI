"""
Analytics and Dashboard aggregation service for GreenLens AI Municipality Engine.
Provides real-time stats, category breakdown, ward performance, and heatmap generation.
"""

from datetime import datetime, timedelta
import math
import random
from typing import List, Dict, Any


class AnalyticsService:
    def __init__(self):
        # Sample wards/zones in major metro region (e.g. Delhi / Mumbai / Bangalore mix for simulation)
        self.zones = [
            {"id": "zone_north", "name": "North Ward (Connaught / Model Town)", "center": {"lat": 28.6512, "lng": 77.2185}, "capacity_tons": 50},
            {"id": "zone_south", "name": "South Ward (Hauz Khas / Saket)", "center": {"lat": 28.5432, "lng": 77.2012}, "capacity_tons": 65},
            {"id": "zone_east", "name": "East Ward (Mayur Vihar / Laxmi Nagar)", "center": {"lat": 28.6271, "lng": 77.2954}, "capacity_tons": 40},
            {"id": "zone_west", "name": "West Ward (Rajouri Garden / Janakpuri)", "center": {"lat": 28.6415, "lng": 77.1209}, "capacity_tons": 55},
            {"id": "zone_central", "name": "Central Business District", "center": {"lat": 28.6139, "lng": 77.2090}, "capacity_tons": 80},
        ]

    def get_dashboard_overview(self) -> Dict[str, Any]:
        return {
            "timestamp": datetime.now().isoformat(),
            "metrics": {
                "total_scans_today": 4820,
                "total_waste_collected_tons": 142.8,
                "recycling_rate_percentage": 68.4,
                "active_collection_trucks": 24,
                "total_collection_trucks": 28,
                "overflow_risk_alerts": 3,
                "co2_emissions_offset_kg": 18450.0,
                "active_citizens_engaged": 12850
            },
            "status_summary": {
                "overall_health": "OPTIMAL",
                "high_priority_zones": ["East Ward (Mayur Vihar / Laxmi Nagar)"],
                "next_scheduled_route": "14:30 PM - Route #B4"
            }
        }

    def get_analytics_metrics(self, period: str = "7d") -> Dict[str, Any]:
        """Returns detailed aggregated waste analytics based on period (24h, 7d, 30d)."""
        days = 30 if period == "30d" else (1 if period == "24h" else 7)
        
        # Category breakdown in percentage and metric tons
        category_breakdown = [
            {"category": "Recyclable", "color": "#3b82f6", "percentage": 42.5, "tons": round(142.8 * 0.425, 2), "icon": "♻️"},
            {"category": "Compostable", "color": "#22c55e", "percentage": 34.0, "tons": round(142.8 * 0.340, 2), "icon": "🌱"},
            {"category": "Hazardous", "color": "#ef4444", "percentage": 8.5, "tons": round(142.8 * 0.085, 2), "icon": "⚠️"},
            {"category": "E-Waste", "color": "#374151", "percentage": 10.0, "tons": round(142.8 * 0.100, 2), "icon": "💻"},
            {"category": "General", "color": "#6b7280", "percentage": 5.0, "tons": round(142.8 * 0.050, 2), "icon": "🗑️"},
        ]

        # Time series collection trend
        today = datetime.now()
        trend_data = []
        for i in range(days - 1, -1, -1):
            date_str = (today - timedelta(days=i)).strftime("%Y-%m-%d")
            base_val = 120 + (i % 3) * 10
            trend_data.append({
                "date": date_str,
                "recyclable_tons": round(base_val * 0.42 + (i % 2), 1),
                "compostable_tons": round(base_val * 0.34 + (i % 4), 1),
                "hazardous_tons": round(base_val * 0.08, 1),
                "ewaste_tons": round(base_val * 0.10, 1),
                "total_tons": round(base_val, 1)
            })

        # Ward comparative performance
        ward_performance = []
        for zone in self.zones:
            ward_performance.append({
                "zone_id": zone["id"],
                "zone_name": zone["name"],
                "capacity_tons": zone["capacity_tons"],
                "current_fill_percentage": random.randint(45, 92),
                "segregation_compliance_score": random.randint(72, 95),
                "avg_response_time_mins": random.randint(18, 45)
            })

        return {
            "period": period,
            "category_breakdown": category_breakdown,
            "trend_data": trend_data,
            "ward_performance": ward_performance
        }

    def get_heatmap_points(self, zone_id: str = None) -> List[Dict[str, Any]]:
        """Generates geospatial waste scan density & overflow heatmap points."""
        points = []
        base_coords = [
            (28.6139, 77.2090, "Central Business District", "Hazardous", 0.9),
            (28.6150, 77.2100, "Central Business District", "Recyclable", 0.7),
            (28.6512, 77.2185, "North Ward", "Compostable", 0.6),
            (28.6530, 77.2200, "North Ward", "E-Waste", 0.85),
            (28.5432, 77.2012, "South Ward", "Recyclable", 0.5),
            (28.5450, 77.2030, "South Ward", "Hazardous", 0.95),
            (28.6271, 77.2954, "East Ward", "Compostable", 0.88),
            (28.6290, 77.2970, "East Ward", "General", 0.65),
            (28.6415, 77.1209, "West Ward", "Recyclable", 0.72),
            (28.6430, 77.1225, "West Ward", "E-Waste", 0.4)
        ]

        # Generate realistic clustered coordinates around base locations
        idx = 1
        for lat, lng, zone_name, category, weight in base_coords:
            for offset_i in range(5):
                d_lat = (random.random() - 0.5) * 0.015
                d_lng = (random.random() - 0.5) * 0.015
                points.append({
                    "id": f"hp_{idx}",
                    "latitude": round(lat + d_lat, 5),
                    "longitude": round(lng + d_lng, 5),
                    "weight": round(max(0.1, min(1.0, weight + (random.random() - 0.5) * 0.2)), 2),
                    "category": category,
                    "zone": zone_name,
                    "scans_count": random.randint(15, 140),
                    "overflow_risk": "HIGH" if weight > 0.8 else ("MEDIUM" if weight > 0.5 else "LOW")
                })
                idx += 1

        return points


analytics_service = AnalyticsService()
