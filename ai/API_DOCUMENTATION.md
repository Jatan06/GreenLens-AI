# GreenLens AI API

## Base URL

<http://localhost:8000>

---

## Health Check

GET /health

Response

```json
{
  "status": "healthy",
  "model": "waste_detector_v1",
  "version": "1.0"
}
```

---

## Predict Waste

POST /predict

Content-Type

multipart/form-data

Field

image

Example Response

```json
{
  "success": true,
  "overall": {
    "total_items": 6,
    "total_reward": 44,
    "total_carbon_saved": 0.76
  },
  "summary": {
    "plastic bottle": {
      "count": 4,
      "total_reward": 40,
      "total_carbon_saved": 0.72
    }
  },
  "detections": [
    {
      "name": "plastic bottle",
      "confidence": 0.79,
      "category": "Recyclable",
      "bin": "Blue",
      "reward": 10,
      "carbon_saved": "0.18 kg",
      "bounding_box": {
        "x1": 10,
        "y1": 20,
        "x2": 100,
        "y2": 200
      }
    }
  ],
  "annotated_image": "/outputs/prediction.jpg"
}
```
