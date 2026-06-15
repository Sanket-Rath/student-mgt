# 🏗️ System Architecture Diagram

## Complete System Overview

```
┌────────────────────────────────────────────────────────────────────┐
│                    STUDENT MANAGEMENT SYSTEM                       │
└────────────────────────────────────────────────────────────────────┘

                              USER (Browser)
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
              FRONTEND (React)            BACKEND (FastAPI)
              http://localhost:5173      http://127.0.0.1:8000
              │                          │
              ├─ App.jsx                 ├─ main.py (25 endpoints)
              ├─ 7 Pages                 ├─ models.py (4 tables)
              ├─ 7 Components            ├─ auth.py (JWT)
              ├─ AuthContext             ├─ database.py
              ├─ Axios Client            ├─ CORS Middleware
              └─ Dark Theme CSS          └─ SQLite DB

```

---

## Authentication Flow

```
┌─────────┐
│ START   │
└────┬────┘
     │
     ▼
┌──────────────────────┐
│ Register/Login Page  │  http://localhost:5173/register
│                      │  http://localhost:5173/login
└────┬─────────────────┘
     │
     ▼ (POST request)
┌──────────────────────────────────────────┐
│ FastAPI Endpoint                         │
│ POST /auth/register                      │ ✅ Returns: User
│ POST /auth/login                         │ ✅ Returns: {access_token, token_type}
└────┬──────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────┐
│ AuthContext.login()                      │
│ - Store JWT in localStorage              │
│ - Store user email in localStorage       │
└────┬──────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────┐
│ Redirect to Dashboard                    │
└────┬──────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────┐
│ Protected Routes Active                  │
│ - ProtectedRoute wraps pages             │
│ - Checks AuthContext.isAuthenticated     │
└────┬──────────────────────────────────────┘
     │
     ▼ (All API requests)
┌──────────────────────────────────────────┐
│ Axios Interceptor                        │
│ - Auto-injects Authorization header      │
│ - Header: "Bearer {jwt_token}"           │
│ - On 401: redirect to /login             │
└────┬──────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────┐
│ API Request Successful                   │
│ ✓ Status 200 → Process response          │
│ ✓ Status 401 → Redirect to login         │
│ ✓ Status 500 → Show error                │
└──────────────────────────────────────────┘

```

---

## Request-Response Flow

```
Frontend (React)           Axios Client              Backend (FastAPI)
     │                          │                          │
     │  getStudents()           │                          │
     ├─────────────────────────►│                          │
     │                          │  GET /students           │
     │                          │  + Bearer token          │
     │                          ├─────────────────────────►│
     │                          │                          │ Query DB
     │                          │                          │ Validate JWT
     │                          │                          │ Return data
     │                          │ 200 OK + data            │
     │                          │◄─────────────────────────┤
     │ Array of students        │                          │
     │◄─────────────────────────┤                          │
     │  Display in table        │                          │
     │  with search/sort        │                          │
     │                          │                          │

```

---

## Data Model Relationships

```
┌─────────────────────┐
│      User           │
├─────────────────────┤
│ id (PK)             │
│ username (unique)   │
│ email (unique)      │
│ password_hash       │
│ created_at          │
└──────┬──────────────┘
       │
       │ (Authentication)
       │
       ▼
┌─────────────────────────────┐
│      Student                │ (one-to-many)
├─────────────────────────────┤
│ id (PK)                     │
│ roll_number (unique)        │
│ name                        │
│ email (unique)              │
│ department                  │
│ semester                    │
│ created_at                  │
│ updated_at                  │
└──────┬──────────────────┬───┘
       │                  │
       │ (1:1)            │ (1:1)
       ▼                  ▼
┌──────────────────────┐  ┌──────────────────────┐
│StudentPerformance    │  │ StudentSummary       │
├──────────────────────┤  ├──────────────────────┤
│ id (PK)              │  │ id (PK)              │
│ student_id (FK)      │  │ student_id (FK)      │
│ attendance           │  │ summary (text)       │
│ assignment_average   │  │ generated_at         │
│ midterm_marks        │  │                      │
│ endsemester_marks    │  │                      │
│ updated_at           │  │                      │
└──────────────────────┘  └──────────────────────┘

```

---

## Frontend Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   App.jsx                               │
│  ┌────────────────────────────────────────────────────┐ │
│  │ BrowserRouter                                      │ │
│  │   ├─ AuthProvider (Global State)                   │ │
│  │   │  ├─ Navbar (Sticky Header)                     │ │
│  │   │  │                                             │ │
│  │   │  └─ Routes                                     │ │
│  │   │     ├─ /login (public)                         │ │
│  │   │     ├─ /register (public)                      │ │
│  │   │     ├─ / (protected → Dashboard)               │ │
│  │   │     ├─ /dashboard (protected)                  │ │
│  │   │     ├─ /students (protected)                   │ │
│  │   │     ├─ /performance (protected)                │ │
│  │   │     ├─ /summary (protected)                    │ │
│  │   │     └─ /* (NotFound)                           │ │
│  │   │                                                │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
  Components          Pages            Context
  ├─Navbar           ├─Login           └─AuthContext
  ├─StudentTable     ├─Register          ├─user
  ├─Performance      ├─Dashboard         ├─token
  ├─Loader           ├─Students          ├─login()
  ├─ConfirmDialog    ├─Performance       └─logout()
  ├─SummaryCard      └─Summary
  └─ProtectedRoute

```

---

## Backend API Structure

```
┌──────────────────────────────────────────────────────────┐
│                   FastAPI App                            │
│                                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │ CORS Middleware                                    │  │
│ │ - Allow localhost:5173                             │  │
│ │ - Allow credentials                                │  │
│ │ - Allow all methods & headers                      │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Endpoints (25 Total)                               │ │
│ │                                                     │ │
│ │ ┌──────────────────────────────────────────────┐   │ │
│ │ │ Authentication (2)                           │   │ │
│ │ │ POST /auth/register                          │   │ │
│ │ │ POST /auth/login                             │   │ │
│ │ └──────────────────────────────────────────────┘   │ │
│ │                                                     │ │
│ │ ┌──────────────────────────────────────────────┐   │ │
│ │ │ Students (6)                                 │   │ │
│ │ │ POST/GET/PUT/DELETE + Search/List            │   │ │
│ │ └──────────────────────────────────────────────┘   │ │
│ │                                                     │ │
│ │ ┌──────────────────────────────────────────────┐   │ │
│ │ │ Performance (5)                              │   │ │
│ │ │ POST/GET/PUT/DELETE + List                   │   │ │
│ │ └──────────────────────────────────────────────┘   │ │
│ │                                                     │ │
│ │ ┌──────────────────────────────────────────────┐   │ │
│ │ │ Summary (4)                                  │   │ │
│ │ │ POST generate/save + GET/DELETE              │   │ │
│ │ └──────────────────────────────────────────────┘   │ │
│ │                                                     │ │
│ │ ┌──────────────────────────────────────────────┐   │ │
│ │ │ Services                                     │   │ │
│ │ │ ├─ auth.py (JWT, bcrypt)                     │   │ │
│ │ │ ├─ database.py (SQLAlchemy)                  │   │ │
│ │ │ ├─ models.py (ORM models)                    │   │ │
│ │ │ ├─ schemas.py (Pydantic)                     │   │ │
│ │ │ └─ ai_service.py (AI)                        │   │ │
│ │ └──────────────────────────────────────────────┘   │ │
│ │                                                     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                          │
└──────────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌──────────────────────┐
              │ SQLite Database      │
              │ (student.db)         │
              ├──────────────────────┤
              │ User                 │
              │ Student              │
              │ StudentPerformance   │
              │ StudentSummary       │
              └──────────────────────┘

```

---

## User Journey

```
┌─────────────────────────────────────────────────────────┐
│              New User Journey                           │
└─────────────────────────────────────────────────────────┘

1. Visit http://localhost:5173
   ↓
2. Redirect to /login (or /register if new)
   ↓
3. Register account → POST /auth/register
   ↓
4. Redirected to /login
   ↓
5. Login → POST /auth/login
   ↓
6. JWT stored in localStorage
   ↓
7. Redirect to Dashboard /
   ↓
8. Dashboard Page:
   ├─ Add Student form
   ├─ Search Student form
   └─ Services grid with 3 cards
   ↓
9. Click "View Database" → /students
   ├─ StudentTable (search, sort, paginate)
   ├─ Update Student form
   └─ Delete Student form
   ↓
10. Click "View Performance" → /performance
    ├─ PerformanceTable
    └─ Update Performance form
   ↓
11. Click "Generate Summary" → /summary
    ├─ Input Student ID
    ├─ Generate AI Summary
    ├─ Save to database
    └─ Load previous summary
   ↓
12. Click "Logout" → Clear token → /login

```

---

## Component Hierarchy

```
App.jsx
├── AuthProvider
│   └── Navbar
│       ├── Logo
│       ├── Navigation Links
│       └── Logout Button
│
└── Routes
    ├── /login → Login
    │   ├── Form
    │   └── Link to Register
    │
    ├── /register → Register
    │   ├── Form
    │   └── Link to Login
    │
    ├── / → ProtectedRoute
    │   └── Dashboard
    │       ├── StudentForm (add)
    │       ├── SearchForm
    │       └── ServicesGrid
    │           ├── Card (Students)
    │           ├── Card (Performance)
    │           └── Card (Summary)
    │
    ├── /students → ProtectedRoute
    │   └── Students
    │       ├── StudentTable
    │       │   └── Table rows
    │       ├── UpdateForm
    │       └── DeleteForm
    │
    ├── /performance → ProtectedRoute
    │   └── Performance
    │       ├── PerformanceTable
    │       │   └── Table rows
    │       └── UpdateForm
    │
    ├── /summary → ProtectedRoute
    │   └── Summary
    │       ├── GenerateForm
    │       ├── LatestSummaryCard
    │       ├── PreviousSummaryCard
    │       └── SaveButton
    │
    └── /* → NotFound
        └── 404 Page

```

---

## Data Flow Example: Add Student

```
User Form Input
    │
    ├─ rollNumber: "CS001"
    ├─ name: "John Doe"
    ├─ email: "john@example.com"
    ├─ department: "CS"
    └─ semester: "4"
    │
    ▼
Dashboard.jsx
├─ handleAddStudent()
├─ Validate inputs
└─ Call api.createStudent(data)
    │
    ▼
api.js (Axios Client)
├─ GET token from localStorage
├─ Create headers: Authorization: Bearer {token}
└─ POST /students with data
    │
    ▼
FastAPI (main.py)
├─ Verify JWT token
├─ Validate request data (Pydantic)
├─ Check for duplicate roll_number
├─ Create Student ORM object
├─ Save to SQLite DB
└─ Return Student object
    │
    ▼
Frontend receives response
├─ Display success alert
├─ Clear form
├─ Reload student list
└─ Show student in table

```

---

**This system is production-ready and fully functional! 🚀**
