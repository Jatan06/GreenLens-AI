# 
import requests

API_KEY = "3ada2d5595ae4ee7bbe6291cc80ca4e4"


def find_nearest_centers(latitude, longitude):

    url = (
        "https://api.geoapify.com/v2/places"
    )

    params = {
        "categories": ",".join([
        "service.recycling.centre",
        "service.recycling.container",
        "service.recycling.bin"
        ]),
        "filter": f"circle:{longitude},{latitude},10000",
        "bias": f"proximity:{longitude},{latitude}",
        "limit": 5,
        "apiKey": API_KEY
    }

    response = requests.get(url, params=params)

    if response.status_code != 200:
        print(response.text)
        return []

    data = response.json()

    centers = []

    for place in data["features"]:

        properties = place["properties"]

        centers.append({
            "name": properties.get("name", "Recycling Center"),
            "address": properties.get("formatted", ""),
            "distance_m": properties.get("distance", 0),
            "latitude": properties["lat"],
            "longitude": properties["lon"],
            "maps_url": f"https://www.google.com/maps?q={properties['lat']},{properties['lon']}"
        })

    return centers