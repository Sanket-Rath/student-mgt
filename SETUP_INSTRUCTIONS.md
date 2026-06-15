# Student Management System - Setup & Usage Guide

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm/yarn

### Backend Setup

1. **Install Python dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

2. **Run the backend server:**
```bash
python -m uvicorn main:app --reload
```
Backend runs on `http://127.0.0.1:8000`

**API Documentation:** `http://127.0.0.1:8000/docs`

### Frontend Setup

1. **Install Node dependencies:**
```bash
cd frontend
npm install
```

2. **Run the development server:**
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

---

## 📋 System Architecture

### Backend (Python/FastAPI)
- **Framework:** FastAPI
- **Database:** SQLite (student.db)
- **ORM:** SQLAlchemy 2.x
- **Authentication:** JWT (60-min expiry)
- **API Endpoints:** 25 endpoints (auth, students CRUD, performance CRUD, summary generation)

### Frontend (React/Vite)
- **Framework:** React 19.2.6
- **Build Tool:** Vite 8.0.12
- **Routing:** React Router 6
- **HTTP Client:** Axios with JWT interceptors
- **State Management:** React Context API

---

## 🗄️ Database Schema

### User Table
- `id` (PK)
- `username` (unique)
- `email` (unique)
- `password_hash`
- `created_at`

### Student Table
- `id` (PK)
- `roll_number` (unique)
- `name`
- `email` (unique)
- `department`
- `semester`
- `created_at`
- `updated_at`

### StudentPerformance Table
- `id` (PK)
- `student_id` (FK → Student)
- `attendance`
- `assignment_average`
- `midterm_marks`
- `endsemester_marks`
- `updated_at`

### StudentSummary Table
- `id` (PK)
- `student_id` (FK → Student, unique)
- `summary` (text)
- `generated_at`

---

## 🔐 Authentication Flow

1. **Register:** POST `/auth/register`
   - Body: `{ username, email, password }`

2. **Login:** POST `/auth/login`
   - Body: `{ username (email), password }` (OAuth2 form data)
   - Response: `{ access_token, token_type }`

3. **API Usage:**
   - Store token in localStorage (done by AuthContext)
   - All subsequent requests include: `Authorization: Bearer {token}`
   - Invalid/expired tokens redirect to login

---

## 📱 Frontend Pages

### Public Pages
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - New user registration

### Protected Pages
- **Dashboard** (`/`) - Quick actions, search, services overview
- **Students** (`/students`) - CRUD operations, student database
- **Performance** (`/performance`) - Track student performance metrics
- **Summary** (`/summary`) - AI-generated performance summaries

---

## 🔌 API Endpoints

### Authentication
- `POST /auth/register` - Create user account
- `POST /auth/login` - Login user

### Students (CRUD)
- `POST /students` - Create student
- `GET /students` - List all students
- `GET /students/{id}` - Get student by ID
- `GET /students/search?roll_number=X` - Search by roll number
- `PUT /students/{id}` - Update student
- `DELETE /students/{id}` - Delete student

### Performance (CRUD)
- `POST /performance` - Add performance record
- `GET /performance` - List all performance records
- `GET /performance/{student_id}` - Get performance by student
- `PUT /performance/{student_id}` - Update performance
- `DELETE /performance/{student_id}` - Delete performance

### Summary (AI)
- `POST /summary/generate/{student_id}` - Generate AI summary
- `POST /summary/save/{student_id}` - Save summary to database
- `GET /summary/{student_id}` - Get saved summary
- `DELETE /summary/{student_id}` - Delete summary

---

## 🛠️ Development Tips

### Frontend Structure
```
frontend/src/
├── components/        # Reusable components
├── pages/            # Page components
├── context/          # React Context (Auth)
├── services/         # API client (Axios)
├── App.jsx           # Main app with routing
├── App.css           # Global styles
└── main.jsx          # Entry point
```

### Backend Structure
```
backend/
├── main.py           # FastAPI app & endpoints
├── models.py         # SQLAlchemy ORM models
├── schemas.py        # Pydantic validation models
├── auth.py           # JWT & password utilities
├── config.py         # Configuration
├── database.py       # Database setup
└── services/
    └── ai_service.py # AI summary generation
```

### Environment Variables
Create `.env` file in backend:
```
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///./student.db
```

---

## 🧪 Testing the Application

1. **Register a new user**
   - Navigate to `/register`
   - Fill form and submit

2. **Login**
   - Navigate to `/login`
   - Use registered credentials

3. **Dashboard**
   - Add a student
   - Search for student
   - Navigate to Students page

4. **Students Page**
   - View all students
   - Edit student (select from table)
   - Delete student

5. **Performance Page**
   - View all performance records
   - Update performance metrics

6. **Summary Page**
   - Generate AI summary for a student
   - Save summary to database
   - View saved summaries

---

## 🚨 Troubleshooting

### Frontend can't connect to backend
- Ensure backend is running on `http://127.0.0.1:8000`
- Check CORS is enabled (should be in main.py)
- Clear browser localStorage and login again

### JWT token not persisting
- Check localStorage in browser DevTools
- Verify AuthContext is wrapping the app
- Check browser allows localStorage

### Database errors
- Delete `student.db` to reset database
- Ensure SQLite is writable in backend folder

### Port conflicts
- Backend default: 8000 (change with `--port 8001`)
- Frontend default: 5173 (change in vite.config.js)

---

## 📦 Building for Production

### Frontend Build
```bash
cd frontend
npm run build
# Output: frontend/dist/
```

### Backend Deployment
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## 📞 API Response Examples

### Successful Login
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

### Student Response
```json
{
  "id": 1,
  "roll_number": "CS001",
  "name": "John Doe",
  "email": "john@example.com",
  "department": "Computer Science",
  "semester": "4",
  "created_at": "2024-01-15T10:30:00"
}
```

### Error Response
```json
{
  "detail": "Incorrect email or password"
}
```

---

## ✅ Implementation Checklist

- [x] Backend API with 25 endpoints
- [x] SQLAlchemy ORM models
- [x] JWT authentication
- [x] Frontend routing with React Router
- [x] Context API for state management
- [x] Axios interceptors for JWT handling
- [x] Protected routes
- [x] All CRUD operations
- [x] AI summary generation (stub)
- [x] Responsive design
- [x] Error handling
- [x] Loading states

---

**Last Updated:** 2024
**Status:** ✅ Ready for Testing
