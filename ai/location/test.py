from service import find_nearest_centers

centers = find_nearest_centers(
    23.0225,
    72.5714
)

print(f"Found {len(centers)} centers\n")

for i, center in enumerate(centers, start=1):
    print(f"{i}. {center['name']}")
    print(f"   Distance : {center['distance_m']} m")
    print(f"   Address  : {center['address']}")
    print(f"   Maps     : {center['maps_url']}")
    print()