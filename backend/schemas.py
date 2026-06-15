from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, validator


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[EmailStr] = None


class StudentCreate(BaseModel):
    roll_number: str
    name: str
    email: EmailStr
    department: Optional[str] = None
    semester: Optional[str] = None

    @validator("semester", pre=True, always=True)
    def coerce_semester_to_str(cls, value):
        if value is None:
            return None
        return str(value)


class StudentUpdate(BaseModel):
    roll_number: Optional[str] = None
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    department: Optional[str] = None
    semester: Optional[str] = None

    @validator("semester", pre=True, always=True)
    def coerce_semester_to_str(cls, value):
        if value is None:
            return None
        return str(value)


class StudentOut(BaseModel):
    id: int
    roll_number: str
    name: str
    email: EmailStr
    department: Optional[str] = None
    semester: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PerformanceCreate(BaseModel):
    student_id: int
    attendance: Optional[float] = None
    assignment_average: Optional[float] = None
    midterm_marks: Optional[float] = None
    endsemester_marks: Optional[float] = None


class PerformanceUpdate(BaseModel):
    attendance: Optional[float] = None
    assignment_average: Optional[float] = None
    midterm_marks: Optional[float] = None
    endsemester_marks: Optional[float] = None


class PerformanceOut(BaseModel):
    id: int
    student_id: int
    attendance: Optional[float] = None
    assignment_average: Optional[float] = None
    midterm_marks: Optional[float] = None
    endsemester_marks: Optional[float] = None
    updated_at: datetime
    student: Optional["StudentBrief"] = None

    class Config:
        from_attributes = True


class StudentBrief(BaseModel):
    id: int
    roll_number: str
    name: str

    class Config:
        from_attributes = True


PerformanceOut.model_rebuild()


class SummaryOut(BaseModel):
    id: int
    student_id: int
    summary: str
    generated_at: datetime

    class Config:
        from_attributes = True


class SummarySave(BaseModel):
    summary: str
