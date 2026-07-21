from pathlib import Path
import shutil
import sys

from fastapi import FastAPI, File, UploadFile

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))

from inference.predict import predict

app = FastAPI(title="GreenLens AI")

from fastapi.staticfiles import StaticFiles

app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")

@app.get("/")
def home():
    return {"message": "GreenLens AI API is running"}


@app.post("/predict")
async def detect(file: UploadFile = File(...)):
    upload_dir = BASE_DIR / "uploads"
    upload_dir.mkdir(exist_ok=True)

    image_path = upload_dir / file.filename

    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = predict(image_path)

    return {
        "success": True,
        **result
    }