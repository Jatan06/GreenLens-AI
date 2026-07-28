# pyrefly: ignore [missing-import]
import googlemaps

API_KEY = "AIzaSyCtEuPuPu7e4gQD0YVHSrmPdJkgS1LqlNg"

gmaps = googlemaps.Client(key=API_KEY)


def get_nearest_recycling_center(latitude, longitude):

    places = gmaps.places_nearby(
        location=(latitude, longitude),
        radius=5000,
        keyword="recycling center"
    )

    results = places.get("results", [])

    if not results:
        return None

    place = results[0]

    return {
        "name": place["name"],
        "address": place.get("vicinity", ""),
        "rating": place.get("rating", "N/A"),
        "location": place["geometry"]["location"]
    }