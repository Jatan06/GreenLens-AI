import requests
from math import radians, sin, cos, sqrt, atan2

def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = (
        sin(dlat / 2) ** 2
        + cos(radians(lat1))
        * cos(radians(lat2))
        * sin(dlon / 2) ** 2
    )

    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return round(R * c, 2)

def get_nearest_recycling_center(latitude, longitude):

    url = "https://lz4.overpass-api.de/api/interpreter"

    query = f"""
    [out:json][timeout:25];

    (
    node["amenity"="recycling"](around:10000,{latitude},{longitude});
    way["amenity"="recycling"](around:10000,{latitude},{longitude});

    node["amenity"="waste_disposal"](around:10000,{latitude},{longitude});
    way["amenity"="waste_disposal"](around:10000,{latitude},{longitude});

    node["amenity"="waste_transfer_station"](around:10000,{latitude},{longitude});
    way["amenity"="waste_transfer_station"](around:10000,{latitude},{longitude});

    node["recycling_type"="centre"](around:10000,{latitude},{longitude});
    way["recycling_type"="centre"](around:10000,{latitude},{longitude});
    );

    out center;
    """
    response = requests.get(
        url,
        params={"data": query},
        headers={
            "User-Agent": "GreenLensAI/1.0"
        },
        timeout=30
    )

    print("Status Code:", response.status_code)
    print(response.text[:300])   # Print first 300 characters

    if response.status_code != 200:
        print("Server Error:", response.status_code)
        print(response.text[:500])
        return None

    data = response.json()

    if len(data["elements"]) == 0:
        return None

    center = data["elements"][0]

    center_lat = center.get("lat") or center["center"]["lat"]
    center_lon = center.get("lon") or center["center"]["lon"]

    distance = calculate_distance(
        latitude,
        longitude,
        center_lat,
        center_lon
    )

    return {
        "name": center.get("tags", {}).get(
            "name",
            "Recycling Center"
        ),
        "latitude": center_lat,
        "longitude": center_lon,
        "distance_km": distance,
        "maps_url": f"https://www.google.com/maps?q={center_lat},{center_lon}"
    }