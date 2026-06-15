from openai import OpenAI
from openai import RateLimitError
from openai import AuthenticationError

from ..config import OPENAI_API_KEY


def build_fallback_summary(student, perf):
    name = student.name
    attendance = perf.attendance
    assignments = perf.assignment_average
    midterm = perf.midterm_marks
    endsem = perf.endsemester_marks

    strengths = []
    improvements = []

    if attendance is not None and attendance >= 85:
        strengths.append("good attendance")
    elif attendance is not None:
        improvements.append("attendance needs improvement")

    if assignments is not None and assignments >= 75:
        strengths.append("consistent assignment performance")
    elif assignments is not None:
        improvements.append("assignment scores can be improved")

    exam_avg = None
    if midterm is not None and endsem is not None:
        exam_avg = (midterm + endsem) / 2
    elif midterm is not None:
        exam_avg = midterm
    elif endsem is not None:
        exam_avg = endsem

    if exam_avg is not None and exam_avg >= 75:
        strengths.append("solid exam performance")
    elif exam_avg is not None:
        improvements.append("exam marks need more focus")

    strength_text = ", ".join(strengths) if strengths else "showing effort in academics"
    improve_text = ", ".join(improvements) if improvements else "keep working on weak areas"

    return (
        f"{name} (Roll: {student.roll_number}) is {strength_text}. "
        f"Attendance is {attendance}%, assignment average is {assignments}, "
        f"midterm marks are {midterm}, and end semester marks are {endsem}. "
        f"Areas to improve: {improve_text}. "
        f"Suggestions: attend classes regularly, revise before exams, and complete assignments on time."
    )


def generate_summary_for_student(student, perf):
    if not OPENAI_API_KEY:
        return build_fallback_summary(student, perf)

    try:
        client = OpenAI(api_key=OPENAI_API_KEY)

        student_info = f"""
Name: {student.name}
Roll Number: {student.roll_number}
Email: {student.email}
Department: {student.department or 'Not set'}
Semester: {student.semester or 'Not set'}
"""

        performance_info = f"""
Attendance: {perf.attendance}%
Assignment Average: {perf.assignment_average}
Midterm Marks: {perf.midterm_marks}
End Semester Marks: {perf.endsemester_marks}
"""

        prompt = f"""You are an academic advisor. Read the student details and performance data below, then write a short performance summary.

Include:
- overall performance
- strengths
- areas to improve
- 2-3 practical suggestions

Keep it under 150 words. Use a clear and encouraging tone.

Student Details:
{student_info}

Performance Data:
{performance_info}
"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=250,
        )

        return response.choices[0].message.content.strip()

    except RateLimitError:
        print("[ai_service] OpenAI quota exceeded. Using local summary instead.")
        return build_fallback_summary(student, perf)

    except AuthenticationError:
        print("[ai_service] Invalid OpenAI API key. Using local summary instead.")
        return build_fallback_summary(student, perf)

    except Exception as e:
        print(f"[ai_service] OpenAI error: {e}. Using local summary instead.")
        return build_fallback_summary(student, perf)
