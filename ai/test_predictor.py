from pathlib import Path
from inference.predict import predict


BASE_DIR = Path(__file__).resolve().parent

IMAGE_PATH = BASE_DIR / "images" / "test.jpg"

result = predict(IMAGE_PATH)

print(result)