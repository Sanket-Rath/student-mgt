# Frontend Development Prompt for GitHub Copilot

## Project Overview

Create a **modern, responsive Student Management System frontend** using **React + Vite**.

The backend is built using **FastAPI** and exposes REST APIs. The frontend should only consume these APIs and should **not contain any dummy data**.

Theme:

* Dark background (#1E1E1E)
* Blue primary color (#3B82F6)
* White cards
* Rounded corners
* Smooth hover animations
* Responsive for desktop and laptop
* Minimalistic professional dashboard

The application should use **React Router**, **Axios**, and **Context API** (or Redux if preferred) for authentication.

Store JWT token in localStorage.

Every protected request should automatically include

```
Authorization: Bearer <token>
```

---

# Project Structure

```
src/

components/
    Navbar.jsx
    Sidebar.jsx
    StudentTable.jsx
    PerformanceTable.jsx
    SummaryCard.jsx
    SearchBar.jsx
    Loader.jsx
    ProtectedRoute.jsx
    ConfirmDialog.jsx

pages/
    Login.jsx
    Register.jsx
    Dashboard.jsx
    StudentDatabase.jsx
    StudentPerformance.jsx
    AISummary.jsx
    NotFound.jsx

services/
    api.js

context/
    AuthContext.jsx

hooks/

assets/

App.jsx

main.jsx
```

---

# Routing

```
/

Login

/register

Register

/dashboard

Dashboard

/students

Student Database

/performance

Student Performance

/summary

AI Performance Summary

/*
404 Page
```

Every page except Login/Register must be protected.

Unauthorized users should be redirected to Login.

---

# Navbar

Fixed top navbar.

Left

```
SMS

Student Management System
```

Right

```
Dashboard

Students

Performance

AI Summary

Logout
```

Logout should remove JWT and redirect to Login.

---

# Login Page

Card centered.

Fields

Email

Password

Button

Login

Bottom text

Don't have an account?

Register

Submit

POST

```
/auth/login
```

Store JWT.

Redirect

/dashboard

Display backend validation errors.

Show loading indicator.

---

# Register Page

Fields

Username

Email

Password

Confirm Password

Register button

Already have an account?

Login

Validation

Passwords match

Valid email

POST

```
/auth/register
```

Success

Redirect Login.

---

# Dashboard Page

Large welcome title

```
Welcome to Student Management System
```

Subtitle

```
One Platform. Endless Possibilities.
```

Three-column layout.

---

Left Card

Add Student

Fields

Roll Number

Name

Email

Department

Semester

Button

Add Student

Calls

POST

```
/students
```

On success

Reset form

Toast

Student Added

---

Center Card

Search Student

Input

Roll Number

Search button

Calls

GET

```
/students/search?roll_number=
```

If found

Display

Name

Department

Semester

Email

Buttons

View Database

View Performance

Generate Summary

If not found

Show

Student not found

---

Right Card

Services

Three service cards

Student Database

Button

Open

Student Performance

Button

Open

AI Summary Generator

Button

Open

Navigate accordingly.

---

# Student Database Page

Title

```
Student Database
```

Two-column layout.

---

Left

Update Student Card

Fields

Roll Number

Name

Email

Department

Semester

Button

Update

Calls

PUT

```
/students/{id}
```

Fill form automatically when table row selected.

---

Delete Student Card

Input

Roll Number

Button

Delete

Confirmation modal

Calls

DELETE

```
/students/{id}
```

---

Right

Student Table

Columns

Roll Number

Name

Email

Department

Semester

Actions

Edit

Delete

Search bar above table.

Pagination.

Sorting.

Fetch

GET

```
/students
```

Refresh after update/delete.

---

# Student Performance Page

Title

```
Student Performance
```

Two-column layout.

---

Left Card

Update Performance

Fields

Roll Number

Attendance

Assignment Average

Mid Semester Marks

End Semester Marks

Button

Update

Calls

PUT

```
/performance/{student_id}
```

---

Second Card

Generate AI Summary

Text

Generate AI based performance summary.

Button

Generate

Navigate

```
/summary
```

---

Right

Performance Table

Columns

Roll Number

Attendance

Assignment Average

Mid Semester

End Semester

Actions

Edit

Fetch

GET

```
/performance
```

Selecting row fills update form.

Search.

Pagination.

---

# AI Summary Page

Title

```
AI Based Performance Summary Generator
```

Layout

Left

Right

---

Left Top

Enter Roll Number

Input

Generate Button

Calls

POST

```
/summary/generate/{student_id}
```

After generation

Show latest summary on right.

---

Left Bottom

Previous Summary

Calls

GET

```
/summary/{student_id}
```

Display previously saved summary.

Scrollable container.

---

Right

Latest Summary

Large card.

Display AI generated summary.

Save button.

Calls

POST

```
/summary/save/{student_id}
```

Toast

Summary Saved

After save

Refresh previous summary.

---

# API Service

Create

```
services/api.js
```

Functions

login()

register()

getStudents()

getStudent()

searchStudent()

createStudent()

updateStudent()

deleteStudent()

getPerformance()

updatePerformance()

generateSummary()

saveSummary()

getSummary()

Axios interceptor should attach JWT automatically.

Handle 401 globally.

Redirect Login.

---

# Authentication Context

Maintain

```
user

token

login()

logout()

isAuthenticated
```

Persist after refresh.

---

# Components

## StudentTable

Reusable.

Props

```
data

onEdit

onDelete
```

Supports

Sorting

Pagination

Search

Hover effect

---

## PerformanceTable

Reusable.

Props

```
data

onEdit
```

Supports pagination.

---

## SummaryCard

Displays

Generated summary.

Scrollable.

Elegant typography.

---

## Loader

Animated spinner.

Centered.

Used during every API request.

---

## ConfirmDialog

Reusable confirmation popup.

Used before deleting.

---

# Styling

Use CSS Modules or Tailwind.

Cards

```
border-radius:20px;

padding:30px;

box-shadow;

transition:0.3s;
```

Buttons

Blue

Rounded

Hover scale

Inputs

Rounded

Consistent spacing

Tables

Sticky header

Alternate row colors

Hover effect

Responsive

---

# User Flow

Login

↓

Dashboard

↓

Add Student

↓

Search Student

↓

Open Database

↓

Update Student

↓

Open Performance

↓

Update Marks

↓

Generate AI Summary

↓

Display Summary

↓

Save Summary

↓

Retrieve Previous Summary

---

# Error Handling

Show toast notifications.

Loading state during API requests.

Handle

404

401

500

Network failure

Gracefully.

---

# Additional Enhancements

Skeleton loading

Debounced search

Responsive mobile layout

Empty state illustrations

Animated page transitions

Framer Motion animations

Dark mode support

CSV export (optional)

Profile dropdown

Keyboard accessibility

Proper form validation

Reusable components

Code splitting using lazy loading

Environment variables for API URL

Production-ready folder organization

The generated frontend should be clean, modular, scalable, and follow React best practices while matching the provided UI design and integrating seamlessly with the FastAPI backend.
