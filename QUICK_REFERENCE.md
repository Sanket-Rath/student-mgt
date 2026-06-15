# 🎯 Quick Reference Card

## 🚀 START HERE

### Step 1: Terminal 1 (Backend)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```
✅ Backend: http://127.0.0.1:8000
📚 API Docs: http://127.0.0.1:8000/docs

### Step 2: Terminal 2 (Frontend)
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend: http://localhost:5173

### Step 3: Test
- Go to http://localhost:5173
- Register new account
- Login
- Explore all features

---

## 📋 Main Routes

| Path | Purpose | Access |
|------|---------|--------|
| `/` | Dashboard | Protected |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/students` | Student Database | Protected |
| `/performance` | Performance Tracking | Protected |
| `/summary` | AI Summaries | Protected |

---

## 🔌 Key API Endpoints

### Auth
```
POST /auth/register
POST /auth/login
```

### Students
```
GET    /students
POST   /students
PUT    /students/{id}
DELETE /students/{id}
GET    /students/search?roll_number=X
```

### Performance
```
GET    /performance
POST   /performance
PUT    /performance/{student_id}
DELETE /performance/{student_id}
```

### Summary
```
POST /summary/generate/{student_id}
POST /summary/save/{student_id}
GET  /summary/{student_id}
DELETE /summary/{student_id}
```

---

## 💾 Database Tables

```
User
├── id (PK)
├── username (unique)
├── email (unique)
├── password_hash
└── created_at

Student
├── id (PK)
├── roll_number (unique)
├── name
├── email (unique)
├── department
├── semester
├── created_at
└── updated_at

StudentPerformance
├── id (PK)
├── student_id (FK)
├── attendance
├── assignment_average
├── midterm_marks
├── endsemester_marks
└── updated_at

StudentSummary
├── id (PK)
├── student_id (FK, unique)
├── summary
└── generated_at
```

---

## 🔐 Auth Flow

```
1. User → /register
   ↓
2. Registration form → POST /auth/register
   ↓
3. User → /login
   ↓
4. Login form → POST /auth/login
   ↓
5. JWT token received
   ↓
6. Token saved to localStorage
   ↓
7. Redirect to Dashboard
   ↓
8. Axios auto-injects "Authorization: Bearer {token}"
   ↓
9. Access protected routes
   ↓
10. Invalid token → 401 → redirect to /login
```

---

## 📁 Project Structure

```
student-management/
├── backend/
│   ├── main.py (25 endpoints)
│   ├── models.py (4 models)
│   ├── schemas.py (14 validators)
│   ├── auth.py (JWT + bcrypt)
│   ├── database.py
│   ├── config.py
│   └── services/ai_service.py
│
├── frontend/
│   └── src/
│       ├── pages/ (7 pages)
│       ├── components/ (7 components)
│       ├── context/ (AuthContext)
│       ├── services/ (API client)
│       ├── App.jsx
│       ├── App.css
│       └── main.jsx
│
├── requirements.txt
└── README.md
```

---

## 🎯 Common Tasks

### Add New Student
1. Go to Dashboard
2. Fill "Add Student" form
3. Click "Add Student"

### View All Students
1. Click "Students" in Navbar
2. Search/sort/paginate as needed

### Edit Student
1. Go to Students page
2. Click Edit button on any row
3. Update form
4. Click Update

### Delete Student
1. Go to Students page
2. Enter roll number in Delete form
3. Click Delete

### Track Performance
1. Go to Performance page
2. Update metrics for student
3. Click Update

### Generate Summary
1. Go to Summary page
2. Enter Student ID
3. Click Generate
4. Click Save to store

---

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS error | Backend CORS is configured, try restarting both servers |
| Login fails | Check credentials, ensure backend is running |
| Blank page | Clear browser cache, reload |
| Buttons don't work | Check browser console for errors |
| Can't upload | Check file size & format |
| Slow performance | Check network tab, ensure pagination enabled |

---

## 📊 Response Examples

### Login Success
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

### Login Error
```json
{
  "detail": "Incorrect email or password"
}
```

### Student Created
```json
{
  "id": 1,
  "roll_number": "CS001",
  "name": "John Doe",
  "email": "john@example.com",
  "department": "Computer Science",
  "semester": "4"
}
```

### Student Error
```json
{
  "detail": "A user with that email or username already exists."
}
```

---

## ⚙️ Configuration

### Backend (.env)
```
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///./student.db
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

### Frontend
```
VITE_API_URL=http://127.0.0.1:8000
```

---

## 🎨 Theme

- **Primary Color:** #2563eb (Blue)
- **Background:** #1e1e1e (Dark)
- **Cards:** #ffffff (White)
- **Text:** #1f2937 (Dark Gray)
- **Accent:** #ef4444 (Red - Delete)

---

## 📞 Help Resources

- 📖 README.md - Full overview
- 📚 SETUP_INSTRUCTIONS.md - Detailed setup
- 🛠️ IMPLEMENTATION_COMPLETE.md - Features list
- 📝 API Docs - http://127.0.0.1:8000/docs

---

## ✨ Features at a Glance

✅ User Registration
✅ User Login
✅ Student CRUD
✅ Performance Tracking
✅ AI Summaries
✅ Search & Filter
✅ Pagination
✅ Responsive Design
✅ Dark Theme
✅ JWT Security

---

## 🚀 Quick Deployment

### Local Testing
```bash
# Terminal 1
cd backend && python -m uvicorn main:app --reload

# Terminal 2
cd frontend && npm run dev

# Browser
http://localhost:5173
```

### Production Build
```bash
# Frontend
cd frontend && npm run build
# Upload dist/ folder to hosting

# Backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

---

**Status:** ✅ Ready to Use
**Version:** 1.0
**Last Updated:** 2024
