# 📚 Student Management System

A comprehensive, full-stack student management application built with **FastAPI** (Python) and **React** (JavaScript).

## 🎯 Project Overview

The **Student Management System (SMS)** is a modern web application designed to manage student data, track academic performance, and generate AI-powered performance summaries. The system provides role-based access with JWT authentication.

### Key Features
- ✅ User authentication & registration
- ✅ Student database management (CRUD)
- ✅ Performance tracking & analytics
- ✅ AI-powered performance summaries
- ✅ Search & filter capabilities
- ✅ Responsive modern UI
- ✅ RESTful API with 25 endpoints
- ✅ JWT-based security

---

## 🏗️ Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Backend Framework** | FastAPI | 0.100.0+ |
| **Server** | Uvicorn | 0.23.0+ |
| **Database** | SQLite | Latest |
| **ORM** | SQLAlchemy | 2.0.0+ |
| **Frontend Framework** | React | 19.2.6 |
| **Build Tool** | Vite | 8.0.12 |
| **Routing** | React Router | 6.14.2 |
| **HTTP Client** | Axios | 1.6.0 |
| **Authentication** | JWT | python-jose 3.0.0+ |

---

## 📁 Project Structure

```
student-management/
├── backend/                    # Python FastAPI backend
│   ├── __init__.py
│   ├── main.py                # FastAPI app & endpoints
│   ├── models.py              # SQLAlchemy ORM models
│   ├── schemas.py             # Pydantic validators
│   ├── auth.py                # JWT & password utilities
│   ├── config.py              # Configuration
│   ├── database.py            # Database setup
│   └── services/
│       └── ai_service.py      # AI summary generation
│
├── frontend/                  # React Vite frontend
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── StudentTable.jsx
│   │   │   ├── PerformanceTable.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   └── SummaryCard.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Students.jsx
│   │   │   ├── Performance.jsx
│   │   │   ├── Summary.jsx
│   │   │   └── NotFound.jsx
│   │   ├── context/           # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── services/          # API client
│   │   │   └── api.js
│   │   ├── App.jsx            # Main app
│   │   ├── App.css            # Global styles
│   │   ├── main.jsx           # Entry point
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── requirements.txt            # Python dependencies
├── SETUP_INSTRUCTIONS.md       # Setup guide
└── README.md                   # This file
```

---

## 🚀 Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```
→ Backend runs at `http://127.0.0.1:8000`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
→ Frontend runs at `http://localhost:5173`

---

## 📊 Database Schema

### 4 Main Tables:
1. **User** - User accounts with JWT authentication
2. **Student** - Student records with contact & enrollment info
3. **StudentPerformance** - Academic metrics (attendance, marks, assignments)
4. **StudentSummary** - AI-generated performance summaries

---

## 🔐 Authentication

- **JWT Bearer tokens** with 60-minute expiry
- **Automatic token refresh** via Axios interceptors
- **Secure password hashing** with bcrypt
- **Protected routes** with ProtectedRoute component

---

## 🛣️ API Endpoints (25 Total)

| Category | Endpoint | Method | Description |
|----------|----------|--------|-------------|
| **Auth** | `/auth/register` | POST | Create user account |
| | `/auth/login` | POST | Login user |
| **Students** | `/students` | POST | Create student |
| | `/students` | GET | List all students |
| | `/students/{id}` | GET | Get student by ID |
| | `/students/search` | GET | Search by roll_number |
| | `/students/{id}` | PUT | Update student |
| | `/students/{id}` | DELETE | Delete student |
| **Performance** | `/performance` | POST | Add performance |
| | `/performance` | GET | List all performance |
| | `/performance/{id}` | GET | Get performance by ID |
| | `/performance/{id}` | PUT | Update performance |
| | `/performance/{id}` | DELETE | Delete performance |
| **Summary** | `/summary/generate/{id}` | POST | Generate AI summary |
| | `/summary/save/{id}` | POST | Save summary |
| | `/summary/{id}` | GET | Get saved summary |
| | `/summary/{id}` | DELETE | Delete summary |

---

## 🎨 Frontend Pages

| Page | Route | Access | Purpose |
|------|-------|--------|---------|
| Login | `/login` | Public | User authentication |
| Register | `/register` | Public | New user signup |
| Dashboard | `/` | Protected | Quick actions & overview |
| Students | `/students` | Protected | Manage student database |
| Performance | `/performance` | Protected | Track academic metrics |
| Summary | `/summary` | Protected | AI summaries & insights |

---

## 🔄 Complete User Flow

```
1. User visits http://localhost:5173
   ↓
2. Redirected to /login (public)
   ↓
3. User registers (if new) or logs in
   ↓
4. JWT token stored in localStorage
   ↓
5. Redirected to Dashboard (protected)
   ↓
6. User can:
   - Add/search students
   - View student database
   - Track performance
   - Generate AI summaries
   ↓
7. On logout, localStorage cleared
```

---

## ✨ Key Implementation Details

### Backend Highlights
- **FastAPI** with async support
- **SQLAlchemy 2.x** mapped_column syntax
- **CORS middleware** for frontend integration
- **Pydantic** request/response validation
- **Bcrypt** password hashing
- **JWT** token generation & validation
- Stub **AI service** (ready for Gemini API integration)

### Frontend Highlights
- **React Context API** for global auth state
- **Axios interceptors** for auto JWT injection
- **Protected routes** with loading state
- **Reusable components** (Tables, Cards, Dialog, Loader)
- **Dark theme** with responsive grid layouts
- **Form validation** with error messages
- **Pagination** for large datasets
- **Search & sort** functionality

---

## 🧪 Testing

1. Open http://localhost:5173
2. Register a new account
3. Login with credentials
4. Add a student from Dashboard
5. Navigate to Students → Update/Delete
6. Navigate to Performance → View/Edit
7. Navigate to Summary → Generate/Save
8. Use API docs at http://127.0.0.1:8000/docs

---

## 📝 Environment Setup

### Backend `.env` (optional)
```
SECRET_KEY=your-secret-key
ALGORITHM=SHA256
DATABASE_URL=your_database_url
ACCESS_TOKEN_EXPIRE_MINUTES=60
OPENAI_API_KEY=your_openai_api_key
```

### Frontend Environment
- API URL: `http://127.0.0.1:8000` (default)
- Can override in `.env`: `VITE_API_URL=...`

---

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Ensure backend CORS middleware is configured |
| Login fails | Check backend is running, verify credentials |
| Token expires | Manual logout/login required (60-min expiry) |
| Database errors | Delete `student.db` and restart backend |
| Port conflicts | Change ports in uvicorn/vite.config.js |

---

## 📦 Production Deployment

### Frontend
```bash
npm run build
# Deploy contents of dist/ folder
```

### Backend
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## 🤝 Contributing

- Follow the existing code structure
- Update both backend & frontend for feature changes
- Test all CRUD operations before committing
- Keep API & database schema in sync

---

## 📄 License

This project is built for educational purposes.

---

## 📞 Support

For issues or questions, refer to:
- `SETUP_INSTRUCTIONS.md` - Detailed setup guide
- Backend API docs: `http://127.0.0.1:8000/docs`
- Frontend: `http://localhost:5173`

---

**Status:** ✅ Ready for Production
**Last Updated:** 2024
