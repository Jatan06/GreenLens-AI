# Dockerfile for GreenLens AI Core Backend API
FROM python:3.10-slim

# Prevent Python from writing .pyc files & enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies required for OpenCV and PostgreSQL
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    libgl1 \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY backend/requirements.txt /app/backend/requirements.txt
COPY ai/requirements.txt /app/ai/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy backend and AI code into container
COPY backend /app/backend
COPY ai /app/ai

EXPOSE 8000

# Run uvicorn server for backend app
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
