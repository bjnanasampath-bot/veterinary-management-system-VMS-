# 🐾 VetCare - Veterinary Management System

A full-stack Veterinary Management System built with **Django REST Framework** (Backend) and **React + Vite** (Frontend).

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Redux Toolkit, Tailwind CSS, Recharts |
| Backend | Django 4.2, Django REST Framework, SimpleJWT |
| Database | PostgreSQL |
| Cache/Queue | Redis, Celery |
| Containerization | Docker, Docker Compose |

---

## 🚀 Quick Start (Docker - Recommended)

### Step 1: Clone & Setup
```bash
git clone <your-repo>
cd veterinary-management-system
```

### Step 2: Start everything
```bash
docker-compose up --build
```

### Step 3: Run migrations (in a new terminal)
```bash
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

### Step 4: Access
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api
- **Swagger Docs**: http://localhost:8000/api/swagger/
- **Admin Panel**: http://localhost:8000/admin

---

## 💻 Manual Setup (Without Docker)

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Setup PostgreSQL database
# Create DB named 'veterinary_db' in PostgreSQL

# Configure .env file (already provided)
# Update DB_HOST=localhost if not using Docker

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

---

## 📁 Project Structure

```
veterinary-management-system/
├── backend/                    # Django REST API
│   ├── apps/
│   │   ├── accounts/          # User Auth (JWT)
│   │   ├── owners/            # Pet Owners
│   │   ├── pets/              # Pets & Medical History
│   │   ├── doctors/           # Veterinary Doctors
│   │   ├── appointments/      # Appointment Scheduling
│   │   ├── treatments/        # Treatment Records
│   │   ├── vaccinations/      # Vaccination Tracking
│   │   ├── billing/           # Invoicing & Payments
│   │   └── reports/           # Analytics & Reports
│   ├── common/                # Shared utilities
│   └── config/                # Django settings
│
└── frontend/                  # React Application
    └── src/
        ├── features/          # Feature-based modules
        ├── components/        # Reusable UI components
        ├── api/               # API layer (Axios)
        └── app/               # Redux store
```

---

## 🔐 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login/` | Login → returns JWT tokens |
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/logout/` | Logout (blacklist token) |
| GET | `/api/auth/profile/` | Get current user profile |
| POST | `/api/auth/token/refresh/` | Refresh JWT token |

### Core Resources
| Resource | Base URL |
|----------|----------|
| Owners | `/api/owners/` |
| Pets | `/api/pets/` |
| Doctors | `/api/doctors/` |
| Appointments | `/api/appointments/` |
| Treatments | `/api/treatments/` |
| Vaccinations | `/api/vaccinations/` |
| Billing | `/api/billing/` |
| Reports | `/api/reports/` |

---

## 🎯 Features

- ✅ JWT Authentication (Login, Register, Logout, Refresh)
- ✅ Role-based access (Admin, Doctor, Receptionist)
- ✅ Pet Management with Medical History
- ✅ Owner Management
- ✅ Doctor Management with Specializations
- ✅ Appointment Scheduling & Status Tracking
- ✅ Treatment Records
- ✅ Vaccination Tracking with Due Date Alerts
- ✅ Billing & Invoice Generation with Payment Recording
- ✅ Reports & Analytics with Charts
- ✅ Responsive UI (Mobile + Desktop)
- ✅ Search & Pagination on all list views
- ✅ Swagger API Documentation

---

## 👨‍💻 MCA Final Year Project
**Project**: Veterinary Management System  
**Stack**: Django + React + PostgreSQL  
**Year**: 2024-25

# veterinary_management_system
