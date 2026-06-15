# Student Management Project Overview

## Project Summary
This repository is a student management system built with a FastAPI backend and a React + Vite frontend. It supports user registration and authentication, along with CRUD operations for student records. The backend uses SQLite by default, and the frontend currently provides a login/register user interface without real API integration.

---

## Workspace Structure

```
student-management/
├── .env
├── .gitignore
├── PROJECT_DETAILS.md
├── README.md
├── requirements.txt
├── student.db
├── venv/
├── backend/
│   ├── __init__.py
│   ├── auth.py
│   ├── config.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   └── __pycache__/
└── frontend/
    ├── .gitignore
    ├── dist/
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── README.md
    ├── public/
    ├── src/
    │   ├── App.css
    │   ├── App.jsx
    │   ├── index.css
    │   ├── main.jsx
    │   └── assets/
    └── vite.config.js
```

### Notes
- `student.db` is the PostgreSQL database file created by the backend.
- `venv/` contains the Python virtual environment.
- The frontend `README.md` is the Vite project readme and not the main project documentation.

---

## Backend Details

### Technology
- Python 3
- FastAPI
- SQLAlchemy 2.x
- SQLite (default via `DATABASE_URL=sqlite:///./student.db`)
- OAuth2 bearer token style authentication
- JWT for access tokens
- Password hashing with `passlib[bcrypt]`
- Environment variables managed with `python-dotenv`

### Backend Files
- `backend/main.py` - FastAPI application entry point defining routes
- `backend/auth.py` - authentication utilities, password hashing, token creation, and user validation
- `backend/config.py` - environment loading and configuration constants
- `backend/database.py` - SQLAlchemy engine, session maker, and database dependency
- `backend/models.py` - SQLAlchemy ORM models for `User` and `Student`
- `backend/schemas.py` - Pydantic data models for request and response validation

### Configuration
- `.env` contains these values:
  - `DATABASE_URL=sqlite:///./student.db`
  - `SECRET_KEY=supersecretkey123`
  - `ALGORITHM=HS256`
  - `ACCESS_TOKEN_EXPIRE_MINUTES=60`

- `backend/config.py` loads environment variables and provides default values.

---

## Database Structure

### Tables

#### `users`
- `id` (Integer, primary key)
- `username` (String(50), unique, indexed)
- `email` (String(255), unique, indexed)
- `password_hash` (Text)
- `created_at` (DateTime, default now)

#### `students`
- `id` (Integer, primary key)
- `name` (String(100), unique, indexed)
- `email` (String(255), unique, indexed)
- `age` (Integer)
- `created_at` (DateTime, default now)
- `updated_at` (DateTime, default now, updated on change)

### Models
- `backend/models.py` defines the ORM mapping for both tables using SQLAlchemy `Mapped` fields.

---

## Backend API Endpoints

### Authentication

#### `POST /auth/register`
- Request body: `UserCreate`
  - `username`: string
  - `email`: valid email string
  - `password`: string
- Response: `UserOut`
- Behavior:
  - Rejects registration if the email or username already exists.
  - Stores a hashed password in `password_hash`.
  - Creates a new user record.

#### `POST /auth/login`
- Request form: OAuth2 form fields:
  - `username` (email is used for authentication)
  - `password`
- Response: `Token`
  - `access_token`
  - `token_type`: `bearer`
- Behavior:
  - Validates email/password.
  - Returns a JWT access token with `sub` set to the user email.

### Student Management

#### `POST /students`
- Request body: `StudentCreate`
  - `name`: string
  - `email`: valid email string
  - `age`: integer
- Response: `StudentOut`
- Authentication: requires bearer token via `get_current_user`
- Behavior:
  - Rejects duplicate student `email` or `name`.
  - Creates a new student record.

#### `GET /students`
- Response: list of `StudentOut`
- Behavior:
  - Returns all students from the database.
  - No authentication required.

#### `GET /students/{student_id}`
- Response: `StudentOut`
- Behavior:
  - Returns the student with the requested ID.
  - If not found, returns `404 Student not found`.

#### `PUT /students/{student_id}`
- Request body: `StudentUpdate`
  - `name`: optional string
  - `email`: optional valid email string
  - `age`: optional integer
- Response: `StudentOut`
- Authentication: requires bearer token
- Behavior:
  - Updates only fields provided in the request.
  - Returns the updated student.
  - If student does not exist, returns `404`.

#### `DELETE /students/{student_id}`
- Response: JSON message
- Authentication: requires bearer token
- Behavior:
  - Deletes the student record by ID.
  - If student does not exist, returns `404`.

---

## Backend Functions and Behavior

### `backend/auth.py`
- `hash_password(password: str) -> str`
  - Hashes a password with bcrypt.
- `verify_password(plain_password: str, hashed_password: str) -> bool`
  - Verifies a password against a hash.
- `create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str`
  - Creates a JWT token with expiration.
- `authenticate_user(db: Session, email: str, password: str) -> Optional[User]`
  - Checks credentials and returns the user when valid.
- `get_current_user(token: str, db: Session) -> User`
  - Validates the bearer token and loads the current user from the database.

### `backend/database.py`
- `engine` and `SessionLocal` configured for SQLite.
- `get_db()` dependency yields a SQLAlchemy session for request handling.

### `backend/config.py`
- Loads `.env` using `dotenv`.
- Exposes `DATABASE_URL`, `SECRET_KEY`, `ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES`.

### `backend/main.py`
- Creates FastAPI app and registers endpoints.
- Uses dependency injection for database sessions and authentication.
- Calls `Base.metadata.create_all(bind=engine)` on startup to create tables.

### `backend/schemas.py`
- Pydantic models for validation and output serialization.
- `from_attributes = True` ensures SQLAlchemy model instances can be returned directly.

---

## Frontend Details

### Technology
- React
- Vite
- JavaScript
- CSS styling in `App.css`

### Frontend Files
- `frontend/src/App.jsx` - main application UI
- `frontend/src/App.css` - styling for the login/register page
- `frontend/src/main.jsx` - React app entry point
- `frontend/index.html` - Vite HTML shell
- `frontend/package.json` - npm scripts and dependencies
- `frontend/vite.config.js` - Vite configuration

### Current Frontend Behavior
- The app renders a login/register screen.
- It toggles between login mode and register mode.
- On submit:
  - Login mode shows an alert with email.
  - Register mode checks password confirmation and shows an alert with name/email.
- There is no network request implemented yet to call the backend APIs.

### UI States
- `isLogin` state toggles the screen between login and register.
- `name`, `email`, `password`, `confirmPassword` state fields capture user input.
- `handleToggleScreen()` clears form fields when switching modes.
- `handleSubmit()` validates confirm password on register and shows an alert.

---

## Dependencies

### Python Requirements (`requirements.txt`)
- `fastapi>=0.100.0`
- `uvicorn[standard]>=0.23.0`
- `sqlalchemy>=2.0.0`
- `psycopg2-binary>=2.9.0`
- `python-dotenv>=1.0.0`
- `passlib[bcrypt]>=1.7.0`
- `python-jose[cryptography]>=3.0.0`

### Frontend Dependencies (`frontend/package.json`)
- `react:^19.2.6`
- `react-dom:^19.2.6`
- `vite:^8.0.12`
- `@vitejs/plugin-react:^6.0.1`
- `eslint:^10.3.0`
- `@eslint/js:^10.0.1`
- `@types/react:^19.2.14`
- `@types/react-dom:^19.2.3`
- `eslint-plugin-react-hooks:^7.1.1`
- `eslint-plugin-react-refresh:^0.5.2`
- `globals:^17.6.0`

---

## What Is Implemented

- Backend API with authentication and student CRUD operations.
- JWT-based bearer authentication for protected endpoints.
- User registration and login.
- SQLite persistence for users and students.
- Validation of duplicate user/student creation.
- Basic React login/register UI shell.

## What Is Not Implemented / Missing

- Frontend integration with backend API endpoints.
- Student listing, view, update, or delete UI.
- Proper form submission to `/auth/login`, `/auth/register`, or `/students`.
- Authentication token persistence or protected frontend routes.
- Input validation and error handling beyond front-end alerts.
- Production-ready environment separation of backend and frontend.

---

## Running the Project

### Backend
1. Activate the Python virtual environment.
2. Install dependencies: `pip install -r requirements.txt`
3. Start the server: `uvicorn backend.main:app --reload`
4. The FastAPI app should be available at `http://127.0.0.1:8000`.
5. API docs are available at `http://127.0.0.1:8000/docs`.

### Frontend
1. Change directory to `frontend/`.
2. Install packages: `npm install`
3. Start Vite: `npm run dev`
4. Open the local Vite URL shown in the terminal.

---

## Key Files to Know

- `backend/main.py` - API route definitions
- `backend/auth.py` - authentication logic
- `backend/models.py` - database model definitions
- `backend/schemas.py` - request/response schemas
- `backend/database.py` - DB connection/session setup
- `backend/config.py` - environment configuration
- `frontend/src/App.jsx` - main React login/register UI
- `frontend/package.json` - frontend dependency and script config

---

## Summary
This repository is a partially implemented student management app. The backend is functional and exposes user and student endpoints. The frontend is only a login/register UI shell and does not yet communicate with the backend.
