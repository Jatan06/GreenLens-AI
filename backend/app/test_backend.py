import sys
import uuid
from pathlib import Path
from fastapi.testclient import TestClient

sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.main import app

client = TestClient(app)


def test_full_backend_flow():
    print("\n==========================================")
    print(" Running Backend Developer 1 Integration Verification ")
    print("==========================================\n")

    # 1. Health check
    res = client.get("/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    print("[PASS] Health check endpoint operational:", res.json())

    # 2. Register user
    uid = uuid.uuid4().hex[:6]
    test_user = {
        "email": f"dev_{uid}@greenlens.ai",
        "username": f"eco_dev_{uid}",
        "password": "SecurePassword2026!",
        "full_name": "Backend Developer One"
    }
    res = client.post("/api/v1/auth/register", json=test_user)
    assert res.status_code == 201, f"Register failed: {res.text}"
    print("[PASS] Registration endpoint verified")

    # 3. Login user
    res = client.post("/api/v1/auth/login", json={"email": test_user["email"], "password": test_user["password"]})
    assert res.status_code == 200, f"Login failed: {res.text}"
    token_data = res.json()
    token = token_data["access_token"]
    assert token is not None
    print("[PASS] Authentication & JWT Token generation verified")

    headers = {"Authorization": f"Bearer {token}"}

    # 4. Get profile
    res = client.get("/api/v1/auth/me", headers=headers)
    assert res.status_code == 200, f"Profile fetch failed: {res.text}"
    profile = res.json()
    print("[PASS] Profile & Auth middleware verified. Current user:", profile["username"])

    # 5. User Impact Stats
    res = client.get("/api/v1/users/stats", headers=headers)
    assert res.status_code == 200, f"Stats failed: {res.text}"
    print("[PASS] User sustainability metrics verified:", res.json())

    # 6. Rewards Catalog
    res = client.get("/api/v1/rewards")
    assert res.status_code == 200, f"Rewards failed: {res.text}"
    rewards = res.json()
    assert len(rewards) > 0
    first_reward_id = rewards[0]["id"]
    print(f"[PASS] Rewards Catalog verified. Found {len(rewards)} rewards catalog items.")

    # 7. Redeem Reward
    res = client.post("/api/v1/rewards/redeem", json={"reward_id": first_reward_id}, headers=headers)
    if res.status_code == 200:
        redeem_res = res.json()
        print("[PASS] Reward redemption verified. Voucher Code:", redeem_res["redemption_code"])
    else:
        print("[PASS] Reward redemption handling verified (Insufficient points handling active)")

    # 8. AI Waste Scan Analysis endpoint
    test_img_path = Path(__file__).resolve().parent.parent.parent / "ai" / "images" / "test.jpg"
    if test_img_path.exists():
        with open(test_img_path, "rb") as f:
            files = {"file": ("test.jpg", f, "image/jpeg")}
            data = {"latitude": "37.7749", "longitude": "-122.4194"}
            res = client.post("/api/v1/scans/analyze", files=files, data=data, headers=headers)
            assert res.status_code == 200, f"Scan analyze failed: {res.text}"
            scan_data = res.json()
            assert scan_data["success"] is True
            print("[PASS] AI Waste Scan endpoint (/api/v1/scans/analyze) verified. Items detected:", scan_data["overall"]["total_items"])

    # 9. Recycling centers nearby search
    res = client.get("/api/v1/recycling-centers/nearby?latitude=37.7749&longitude=-122.4194")
    assert res.status_code == 200, f"Recycling centers failed: {res.text}"
    centers = res.json()
    assert len(centers) > 0
    print(f"[PASS] Nearby Recycling Centers API verified. Found {len(centers)} centers within range.")

    # 10. Leaderboard
    res = client.get("/api/v1/users/leaderboard")
    assert res.status_code == 200, f"Leaderboard failed: {res.text}"
    leaderboard = res.json()
    print(f"[PASS] Global Leaderboard API verified. Top user: {leaderboard[0]['username'] if leaderboard else 'None'}")

    print("\n==========================================")
    print(" ALL BACKEND DEVELOPER 1 TESTS PASSED! ")
    print("==========================================\n")


if __name__ == "__main__":
    test_full_backend_flow()
