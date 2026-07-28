# GreenLens AI Core Backend API Documentation

## Overview

The **GreenLens AI Core Backend** is built using **FastAPI**, **SQLAlchemy ORM**, **PostgreSQL**, and **JWT Authentication**. It serves as the primary API server powering user registration, authentication, waste scan AI inference integration, eco-impact tracking, rewards catalog and redemption, and spatial queries for nearby recycling centers.

---

## Technical Stack & Architecture

- **Framework**: FastAPI (Python 3.10+)
- **ORM & Database**: SQLAlchemy (PostgreSQL / SQLite fallback)
- **Security**: JWT tokens (`PyJWT`), PBKDF2 SHA-256 password hashing
- **Containerization**: Docker & Docker Compose
- **Documentation**: Swagger UI (`/docs`), ReDoc (`/redoc`)

---

## Database Schemas

### 1. `users`
- `id` (INT, Primary Key)
- `email` (VARCHAR, Unique, Indexed)
- `username` (VARCHAR, Unique, Indexed)
- `full_name` (VARCHAR)
- `hashed_password` (VARCHAR)
- `role` (VARCHAR) - `citizen`, `admin`, `recycler`
- `total_reward_points` (INT)
- `eco_score` (FLOAT)
- `carbon_saved_kg` (FLOAT)
- `total_scans` (INT)
- `streak_days` (INT)
- `created_at` (DATETIME)

### 2. `scan_histories`
- `id` (INT, Primary Key)
- `user_id` (INT, Foreign Key -> `users.id`, Nullable)
- `image_name` (VARCHAR)
- `image_url` (VARCHAR)
- `annotated_image_url` (VARCHAR)
- `total_items` (INT)
- `total_reward` (INT)
- `total_carbon_saved` (FLOAT)
- `eco_score` (INT)
- `latitude` (FLOAT)
- `longitude` (FLOAT)
- `summary_json` (JSON)
- `detections_json` (JSON)
- `created_at` (DATETIME)

### 3. `reward_catalog`
- `id` (INT, Primary Key)
- `title` (VARCHAR)
- `description` (TEXT)
- `category` (VARCHAR)
- `points_cost` (INT)
- `discount_code_prefix` (VARCHAR)
- `partner_name` (VARCHAR)
- `image_url` (VARCHAR)
- `is_active` (BOOLEAN)

### 4. `user_reward_transactions`
- `id` (INT, Primary Key)
- `user_id` (INT, Foreign Key -> `users.id`)
- `reward_id` (INT, Foreign Key -> `reward_catalog.id`)
- `points_spent` (INT)
- `redemption_code` (VARCHAR, Unique)
- `is_used` (BOOLEAN)
- `redeemed_at` (DATETIME)

### 5. `recycling_centers`
- `id` (INT, Primary Key)
- `name` (VARCHAR)
- `address` (VARCHAR)
- `latitude` (FLOAT)
- `longitude` (FLOAT)
- `contact_phone` (VARCHAR)
- `categories_accepted` (JSON)
- `opening_hours` (VARCHAR)
- `rating` (FLOAT)
- `is_active` (BOOLEAN)

---

## Core REST API Endpoints

### 🔑 Authentication (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/auth/register` | Register new user account | No |
| `POST` | `/api/v1/auth/login` | Authenticate and obtain JWT token | No |
| `GET`  | `/api/v1/auth/me` | Fetch authenticated user details | Bearer JWT |

### 👤 User Management & Leaderboard (`/api/v1/users`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET`  | `/api/v1/users/profile` | Get user profile & eco stats | Bearer JWT |
| `PUT`  | `/api/v1/users/profile` | Update username / full name | Bearer JWT |
| `GET`  | `/api/v1/users/stats` | Fetch detailed carbon impact metrics | Bearer JWT |
| `GET`  | `/api/v1/users/leaderboard` | Get global citizen ranking | No |

### 📷 AI Waste Scan & History (`/api/v1/scans`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/v1/scans/analyze` | Upload waste photo + lat/lon for AI scan | Optional |
| `GET`  | `/api/v1/scans/history` | Get past scans of logged in user | Bearer JWT |
| `GET`  | `/api/v1/scans/{scan_id}` | Get detailed scan result by ID | No |

### 🎁 Rewards & Redemption (`/api/v1/rewards`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET`  | `/api/v1/rewards` | Get available rewards catalog | No |
| `POST` | `/api/v1/rewards/redeem` | Redeem points for coupon voucher | Bearer JWT |
| `GET`  | `/api/v1/rewards/my-rewards` | Get list of user's redeemed vouchers | Bearer JWT |

### 📍 Recycling Centers (`/api/v1/recycling-centers`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET`  | `/api/v1/recycling-centers/nearby` | Find nearest centers by coordinates | No |
| `GET`  | `/api/v1/recycling-centers` | List all active recycling centers | No |
| `POST` | `/api/v1/recycling-centers` | Register new facility | Admin JWT |

---

## Local Development & Running

### 1. Direct Python Execution (SQLite mode)
```bash
python -m uvicorn backend.app.main:app --reload --port 8000
```
Interactive Swagger UI will be available at: `http://127.0.0.1:8000/docs`

### 2. Docker Compose Deployment (PostgreSQL mode)
```bash
docker-compose up --build -d
```
FastAPI application service: `http://localhost:8000`
PostgreSQL Database container listening on port `5432`.
