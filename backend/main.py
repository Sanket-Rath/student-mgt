from datetime import datetime
from typing import List, Optional

from fastapi import Depends, FastAPI, HTTPException, status, Query
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload

from . import auth, models, schemas
from .auth import authenticate_user, create_access_token, get_current_user, hash_password
from .database import Base, engine, get_db
from .config import DATABASE_URL, OPENAI_API_KEY
from sqlalchemy import inspect, text
from .services.ai_service import generate_summary_for_student

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Student Management API")


def ensure_postgres_student_schema():
    if not DATABASE_URL.startswith("postgres") and not DATABASE_URL.startswith("postgresql"):
        return

    inspector = inspect(engine)
    if "students" not in inspector.get_table_names():
        return

    columns = [col["name"] for col in inspector.get_columns("students")]
    with engine.begin() as conn:
        if "roll_number" not in columns and "roll_no" in columns:
            print("[startup] Renaming legacy students.roll_no to students.roll_number.")
            conn.execute(text("ALTER TABLE students RENAME COLUMN roll_no TO roll_number;"))
            conn.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS idx_students_roll_number ON students (roll_number);"))
            columns = [col["name"] for col in inspector.get_columns("students")]

        if "roll_number" not in columns:
            print("[startup] Detected missing students.roll_number column in PostgreSQL students table.")
            conn.execute(text("ALTER TABLE students ADD COLUMN IF NOT EXISTS roll_number VARCHAR(50);"))
            conn.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS idx_students_roll_number ON students (roll_number);"))
            columns = [col["name"] for col in inspector.get_columns("students")]
            print("[startup] Added students.roll_number column. Existing rows will have NULL until updated.")

        if "semester" in columns:
            semester_col = next(col for col in inspector.get_columns("students") if col["name"] == "semester")
            semester_type = str(semester_col["type"]).upper()
            if "INT" in semester_type and "VARCHAR" not in semester_type:
                print("[startup] Converting students.semester from integer to varchar(50).")
                conn.execute(text("ALTER TABLE students ALTER COLUMN semester TYPE VARCHAR(50) USING semester::text;"))
                print("[startup] Converted students.semester to VARCHAR(50).")
        else:
            print("[startup] Adding missing students.semester column as VARCHAR(50).")
            conn.execute(text("ALTER TABLE students ADD COLUMN IF NOT EXISTS semester VARCHAR(50);"))
            print("[startup] Added students.semester column.")


def ensure_postgres_performance_schema():
    if not DATABASE_URL.startswith("postgres") and not DATABASE_URL.startswith("postgresql"):
        return

    inspector = inspect(engine)
    if "student_performance" not in inspector.get_table_names():
        return

    columns = [col["name"] for col in inspector.get_columns("student_performance")]

    with engine.begin() as conn:
        if "student_id" not in columns:
            print("[startup] Adding student_performance.student_id column.")
            conn.execute(text("ALTER TABLE student_performance ADD COLUMN IF NOT EXISTS student_id INTEGER;"))
            columns.append("student_id")

        if "roll_no" in columns:
            print("[startup] Linking student_performance.roll_no to students.id.")
            conn.execute(text("""
                UPDATE student_performance sp
                SET student_id = s.id
                FROM students s
                WHERE sp.student_id IS NULL
                  AND (
                    sp.roll_no = s.id
                    OR sp.roll_no = s.roll_no
                    OR sp.roll_no::text = s.roll_number
                  )
            """))

        column_renames = {
            "avg_assignments": "assignment_average",
            "mid_sem": "midterm_marks",
            "end_sem": "endsemester_marks",
        }

        for old_name, new_name in column_renames.items():
            current_columns = [col["name"] for col in inspector.get_columns("student_performance")]
            if old_name in current_columns and new_name not in current_columns:
                print(f"[startup] Renaming student_performance.{old_name} to {new_name}.")
                conn.execute(text(f"ALTER TABLE student_performance RENAME COLUMN {old_name} TO {new_name};"))

        current_columns = [col["name"] for col in inspector.get_columns("student_performance")]

        if "student_id" in current_columns:
            conn.execute(text(
                "CREATE INDEX IF NOT EXISTS idx_student_performance_student_id ON student_performance (student_id);"
            ))

        if "roll_no" in current_columns and "student_id" in current_columns:
            print("[startup] Removing legacy student_performance.roll_no column.")
            conn.execute(text("ALTER TABLE student_performance DROP COLUMN roll_no;"))


@app.on_event("startup")
def startup_db_check():
    # Mask DB URL for logs
    try:
        if DATABASE_URL.startswith('sqlite'):
            print("[startup] WARNING: DATABASE_URL is set to SQLite, but your configuration expects PostgreSQL.")
        if DATABASE_URL.startswith('postgres') or DATABASE_URL.startswith('postgresql'):
            masked = DATABASE_URL.split('@')[-1]
        else:
            masked = DATABASE_URL
        print(f"[startup] Attempting DB connect to: {masked}")
        with engine.connect() as conn:
            # simple lightweight check
            res = conn.execute(text("SELECT 1"))
            _ = res.scalar()
        print("[startup] Database connection OK")
    except Exception as e:
        print("[startup] Database connection FAILED:", str(e))

    ensure_postgres_student_schema()
    ensure_postgres_performance_schema()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/auth/register", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def register(user_create: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = (
        db.query(models.User)
        .filter(
            (models.User.email == user_create.email) | (models.User.username == user_create.username)
        )
        .first()
    )
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with that email or username already exists.",
        )

    user = models.User(
        username=user_create.username,
        email=user_create.email,
        password_hash=hash_password(user_create.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.post("/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # OAuth2PasswordRequestForm uses "username" field; we expect the user's email here
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/students", response_model=schemas.StudentOut, status_code=status.HTTP_201_CREATED)
def create_student(
    student_create: schemas.StudentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    existing_student = (
        db.query(models.Student)
        .filter(
            (models.Student.email == student_create.email) | (models.Student.roll_number == student_create.roll_number)
        )
        .first()
    )
    if existing_student:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A student with that email or roll number already exists.",
        )

    student = models.Student(
        roll_number=student_create.roll_number,
        name=student_create.name,
        email=student_create.email,
        department=student_create.department,
        semester=student_create.semester,
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return student


@app.get("/students", response_model=List[schemas.StudentOut])
def list_students(db: Session = Depends(get_db)):
    return db.query(models.Student).all()


@app.get("/students/search", response_model=schemas.StudentOut)
def search_student(roll_number: str = Query(...), db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.roll_number == roll_number).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
    return student


@app.get("/students/{student_id}", response_model=schemas.StudentOut)
def get_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
    return student


@app.put("/students/{student_id}", response_model=schemas.StudentOut)
def update_student(
    student_id: int,
    student_update: schemas.StudentUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

    update_data = student_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(student, field, value)

    db.add(student)
    db.commit()
    db.refresh(student)
    return student


@app.delete("/students/{student_id}", status_code=status.HTTP_200_OK)
def delete_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

    db.delete(student)
    db.commit()
    return {"message": "Student deleted successfully"}


# Performance endpoints
@app.post("/performance", response_model=schemas.PerformanceOut, status_code=status.HTTP_201_CREATED)
def create_performance(perf: schemas.PerformanceCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    student = db.query(models.Student).filter(models.Student.id == perf.student_id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

    performance = models.StudentPerformance(
        student_id=perf.student_id,
        attendance=perf.attendance,
        assignment_average=perf.assignment_average,
        midterm_marks=perf.midterm_marks,
        endsemester_marks=perf.endsemester_marks,
    )
    db.add(performance)
    db.commit()
    db.refresh(performance)
    return performance


@app.get("/performance", response_model=List[schemas.PerformanceOut])
def list_performance(db: Session = Depends(get_db)):
    return (
        db.query(models.StudentPerformance)
        .options(joinedload(models.StudentPerformance.student))
        .all()
    )


@app.get("/performance/{student_id}", response_model=schemas.PerformanceOut)
def get_performance(student_id: int, db: Session = Depends(get_db)):
    perf = (
        db.query(models.StudentPerformance)
        .filter(models.StudentPerformance.student_id == student_id)
        .order_by(models.StudentPerformance.updated_at.desc())
        .first()
    )
    if not perf:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Performance not found")
    return perf


@app.put("/performance/{student_id}", response_model=schemas.PerformanceOut)
def update_performance(
    student_id: int,
    perf_update: schemas.PerformanceUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    perf = (
        db.query(models.StudentPerformance)
        .filter(models.StudentPerformance.student_id == student_id)
        .order_by(models.StudentPerformance.updated_at.desc())
        .first()
    )
    if not perf:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Performance not found")

    update_data = perf_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(perf, field, value)

    db.add(perf)
    db.commit()
    db.refresh(perf)
    return perf


@app.delete("/performance/{student_id}", status_code=status.HTTP_200_OK)
def delete_performance(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    perf = db.query(models.StudentPerformance).filter(models.StudentPerformance.student_id == student_id).first()
    if not perf:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Performance not found")
    db.delete(perf)
    db.commit()
    return {"message": "Performance deleted"}


# Summary / AI endpoints
@app.post("/summary/generate/{student_id}", response_model=schemas.SummaryOut)
def generate_summary(student_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if not OPENAI_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="OpenAI API key is missing. Add OPENAI_API_KEY to your .env file.",
        )

    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

    perf = (
        db.query(models.StudentPerformance)
        .filter(models.StudentPerformance.student_id == student_id)
        .order_by(models.StudentPerformance.updated_at.desc())
        .first()
    )

    if not perf:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No performance data found for this student. Add performance records first.",
        )

    try:
        summary_text = generate_summary_for_student(student, perf)
    except Exception as e:
        print(f"[summary] Failed to generate summary: {e}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Summary generation failed: {str(e)}",
        )

    return schemas.SummaryOut(
        id=0,
        student_id=student_id,
        summary=summary_text,
        generated_at=datetime.utcnow(),
    )


@app.post("/summary/save/{student_id}", response_model=schemas.SummaryOut)
def save_summary(student_id: int, payload: schemas.SummarySave, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

    existing = db.query(models.StudentSummary).filter(models.StudentSummary.student_id == student_id).first()
    if existing:
        existing.summary = payload.summary
        existing.generated_at = datetime.utcnow()
        db.add(existing)
        db.commit()
        db.refresh(existing)
        return existing

    new = models.StudentSummary(student_id=student_id, summary=payload.summary)
    db.add(new)
    db.commit()
    db.refresh(new)
    return new


@app.get("/summary/{student_id}", response_model=schemas.SummaryOut)
def get_summary(student_id: int, db: Session = Depends(get_db)):
    s = db.query(models.StudentSummary).filter(models.StudentSummary.student_id == student_id).first()
    if not s:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Summary not found")
    return s


@app.delete("/summary/{student_id}", status_code=status.HTTP_200_OK)
def delete_summary(student_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    s = db.query(models.StudentSummary).filter(models.StudentSummary.student_id == student_id).first()
    if not s:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Summary not found")
    db.delete(s)
    db.commit()
    return {"message": "Summary deleted"}
