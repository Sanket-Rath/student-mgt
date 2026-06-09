from typing import Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

students: dict[int, dict] = {}
next_id = 1


class StudentCreate(BaseModel):
    name: str
    email: str
    age: int


class StudentUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    age: Optional[int] = None


class Student(BaseModel):
    id: int
    name: str
    email: str
    age: int


@app.post("/student", response_model=Student, status_code=201)
def add_student(student: StudentCreate):
    global next_id
    new_student = Student(id=next_id, **student.model_dump())
    students[next_id] = new_student.model_dump()
    next_id += 1
    return new_student


@app.get("/students", response_model=list[Student])
def list_students():
    return list(students.values())


@app.get("/student/{id}", response_model=Student)
def get_student(id: int):
    if id not in students:
        raise HTTPException(status_code=404, detail="Student not found")
    return students[id]


@app.put("/student/{id}", response_model=Student)
def update_student(id: int, student_update: StudentUpdate):
    if id not in students:
        raise HTTPException(status_code=404, detail="Student not found")

    existing = students[id]
    update_data = student_update.model_dump(exclude_unset=True)
    updated = Student(id=id, **{**existing, **update_data})
    students[id] = updated.model_dump()
    return updated


@app.delete("/student/{id}")
def delete_student(id: int):
    if id not in students:
        raise HTTPException(status_code=404, detail="Student not found")
    del students[id]
    return {"message": "Student deleted successfully"}
