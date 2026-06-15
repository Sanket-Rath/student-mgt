```javascript
import axios from "axios";

// ======================================
// Base URL Configuration
// ======================================

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ======================================
// Request Interceptor
// Attach JWT Token
// ======================================

client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ======================================
// Response Interceptor
// Global Error Handling
// ======================================

client.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem("token");
          localStorage.removeItem("userEmail");

          if (
            window.location.pathname !== "/" &&
            window.location.pathname !== "/login"
          ) {
            window.location.href = "/";
          }

          break;

        case 403:
          console.error("Access Forbidden");
          break;

        case 404:
          console.error("Resource Not Found");
          break;

        case 500:
          console.error("Internal Server Error");
          break;

        default:
          console.error(error.response.data);
      }
    }

    return Promise.reject(error);
  }
);

// ======================================
// Authentication APIs
// ======================================

export async function login(email, password) {
  const formData = new URLSearchParams();

  formData.append("username", email);
  formData.append("password", password);

  const response = await client.post("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
}

export async function register(username, email, password) {
  const response = await client.post("/auth/register", {
    username,
    email,
    password,
  });

  return response.data;
}

// ======================================
// Student APIs
// ======================================

export async function getStudents() {
  const response = await client.get("/students");
  return response.data;
}

export async function getStudent(studentId) {
  const response = await client.get(`/students/${studentId}`);
  return response.data;
}

export async function searchStudent(rollNumber) {
  const response = await client.get("/students/search", {
    params: {
      roll_number: rollNumber,
    },
  });

  return response.data;
}

export async function createStudent(studentData) {
  const response = await client.post("/students", studentData);
  return response.data;
}

export async function updateStudent(studentId, studentData) {
  const response = await client.put(
    `/students/${studentId}`,
    studentData
  );

  return response.data;
}

export async function deleteStudent(studentId) {
  const response = await client.delete(`/students/${studentId}`);
  return response.data;
}

// ======================================
// Performance APIs
// ======================================

export async function getPerformance() {
  const response = await client.get("/performance");
  return response.data;
}

export async function getPerformanceByStudent(studentId) {
  const response = await client.get(`/performance/${studentId}`);
  return response.data;
}

export async function createPerformance(performanceData) {
  const response = await client.post(
    "/performance",
    performanceData
  );

  return response.data;
}

export async function updatePerformance(
  studentId,
  performanceData
) {
  const response = await client.put(
    `/performance/${studentId}`,
    performanceData
  );

  return response.data;
}

export async function deletePerformance(studentId) {
  const response = await client.delete(
    `/performance/${studentId}`
  );

  return response.data;
}

// ======================================
// AI Summary APIs
// ======================================

export async function generateSummary(studentId) {
  const response = await client.post(
    `/summary/generate/${studentId}`
  );

  return response.data;
}

export async function saveSummary(studentId, summary) {
  const response = await client.post(
    `/summary/save/${studentId}`,
    {
      summary,
    }
  );

  return response.data;
}

export async function getSummary(studentId) {
  const response = await client.get(
    `/summary/${studentId}`
  );

  return response.data;
}

export async function deleteSummary(studentId) {
  const response = await client.delete(
    `/summary/${studentId}`
  );

  return response.data;
}

// ======================================
// Dashboard APIs (Future Ready)
// ======================================

export async function getDashboardStats() {
  const response = await client.get("/dashboard/stats");
  return response.data;
}

// ======================================
// Export Axios Instance
// ======================================

export default client;
```
