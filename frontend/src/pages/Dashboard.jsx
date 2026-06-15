import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as api from '../services/api'
import Loader from '../components/Loader'

export default function Dashboard() {
  const [rollAdd, setRollAdd] = useState('')
  const [nameAdd, setNameAdd] = useState('')
  const [emailAdd, setEmailAdd] = useState('')
  const [deptAdd, setDeptAdd] = useState('')
  const [semAdd, setSemAdd] = useState('')

  const [rollSearch, setRollSearch] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [searching, setSearching] = useState(false)

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleAddStudent(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.createStudent({
        roll_number: rollAdd,
        name: nameAdd,
        email: emailAdd,
        department: deptAdd,
        semester: semAdd,
      })
      alert('Student added!')
      setRollAdd('')
      setNameAdd('')
      setEmailAdd('')
      setDeptAdd('')
      setSemAdd('')
    } catch (err) {
      alert('Failed to add student')
    } finally {
      setLoading(false)
    }
  }

  async function handleSearchStudent(e) {
    e.preventDefault()
    setSearching(true)
    try {
      const result = await api.searchStudent(rollSearch)
      setSearchResult(result)
    } catch (err) {
      alert('Student not found')
      setSearchResult(null)
    } finally {
      setSearching(false)
    }
  }

  if (loading || searching) return <Loader />

  return (
    <div className="page">
      <h1 className="page-title">Welcome to Student Management System</h1>
      <p className="page-subtitle">One Platform. Endless Possibilities.</p>

      <div className="dashboard-grid">
        <div className="card">
          <h2>Add Student</h2>
          <form onSubmit={handleAddStudent}>
            <div className="form-group">
              <label>Roll Number</label>
              <input value={rollAdd} onChange={(e) => setRollAdd(e.target.value)} placeholder="Enter Roll No." required />
            </div>
            <div className="form-group">
              <label>Name</label>
              <input value={nameAdd} onChange={(e) => setNameAdd(e.target.value)} placeholder="Enter Name" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={emailAdd} onChange={(e) => setEmailAdd(e.target.value)} placeholder="Enter Email" required />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input value={deptAdd} onChange={(e) => setDeptAdd(e.target.value)} placeholder="Enter Department" />
            </div>
            <div className="form-group">
              <label>Current Semester</label>
              <input value={semAdd} onChange={(e) => setSemAdd(e.target.value)} placeholder="Enter Semester" />
            </div>
            <button type="submit" className="btn-primary btn-full">Add Student</button>
          </form>
        </div>

        <div className="card">
          <h2>Search Student</h2>
          <form onSubmit={handleSearchStudent}>
            <div className="form-group">
              <label>Roll Number</label>
              <input value={rollSearch} onChange={(e) => setRollSearch(e.target.value)} placeholder="Enter Roll No." required />
            </div>
            <button type="submit" className="btn-primary btn-full">Search</button>
          </form>
          {searchResult && (
            <div className="search-result">
              <p><strong>Name:</strong> {searchResult.name}</p>
              <p><strong>Email:</strong> {searchResult.email}</p>
              <p><strong>Department:</strong> {searchResult.department}</p>
              <p><strong>Semester:</strong> {searchResult.semester}</p>
              <div style={{ marginTop: '10px' }}>
                <button onClick={() => navigate('/students')} className="btn-secondary">View Database</button>
                <button onClick={() => navigate('/performance')} className="btn-secondary">View Performance</button>
                <button onClick={() => navigate('/summary')} className="btn-secondary">Generate Summary</button>
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h2>Services</h2>
          <div className="services-grid">
            <div className="service-item">
              <h3>Student Database</h3>
              <p>Manage all students</p>
              <button onClick={() => navigate('/students')} className="btn-primary">Open</button>
            </div>
            <div className="service-item">
              <h3>Student Performance</h3>
              <p>Track performance</p>
              <button onClick={() => navigate('/performance')} className="btn-primary">Open</button>
            </div>
            <div className="service-item">
              <h3>AI Summary</h3>
              <p>Generate summaries</p>
              <button onClick={() => navigate('/summary')} className="btn-primary">Open</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
