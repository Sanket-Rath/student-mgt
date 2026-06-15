import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as api from '../services/api'
import PerformanceTable from '../components/PerformanceTable'
import Loader from '../components/Loader'

const emptyForm = {
  student_id: '',
  attendance: '',
  assignment_average: '',
  midterm_marks: '',
  endsemester_marks: '',
}

export default function Performance() {
  const [performances, setPerformances] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const navigate = useNavigate()

  useEffect(() => {
    loadPerformances()
  }, [])

  async function loadPerformances() {
    setLoading(true)
    try {
      const data = await api.getPerformance()
      setPerformances(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function getExistingPerformance(studentId) {
    return performances.find((p) => p.student_id === studentId)
  }

  function handleEdit(perf) {
    setForm({
      student_id: perf.student_id,
      attendance: perf.attendance ?? '',
      assignment_average: perf.assignment_average ?? '',
      midterm_marks: perf.midterm_marks ?? '',
      endsemester_marks: perf.endsemester_marks ?? '',
    })
  }

  function handleStudentIdChange(value) {
    const studentId = parseInt(value, 10)

    if (!value || !studentId) {
      setForm({ ...emptyForm, student_id: value })
      return
    }

    const existing = getExistingPerformance(studentId)
    if (existing) {
      setForm({
        student_id: studentId,
        attendance: existing.attendance ?? '',
        assignment_average: existing.assignment_average ?? '',
        midterm_marks: existing.midterm_marks ?? '',
        endsemester_marks: existing.endsemester_marks ?? '',
      })
    } else {
      setForm({ ...emptyForm, student_id: value })
    }
  }

  function resetForm() {
    setForm(emptyForm)
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const studentId = parseInt(form.student_id, 10)
    const payload = {
      attendance: form.attendance !== '' ? parseFloat(form.attendance) : null,
      assignment_average: form.assignment_average !== '' ? parseFloat(form.assignment_average) : null,
      midterm_marks: form.midterm_marks !== '' ? parseFloat(form.midterm_marks) : null,
      endsemester_marks: form.endsemester_marks !== '' ? parseFloat(form.endsemester_marks) : null,
    }

    const existing = getExistingPerformance(studentId)

    try {
      if (existing) {
        await api.updatePerformance(studentId, payload)
        alert('Performance updated!')
      } else {
        await api.createPerformance({ student_id: studentId, ...payload })
        alert('Performance added!')
      }
      resetForm()
      loadPerformances()
    } catch (err) {
      alert(existing ? 'Update failed' : 'Add failed')
    }
  }

  const studentId = parseInt(form.student_id, 10)
  const isUpdate = !!getExistingPerformance(studentId)

  if (loading) return <Loader />

  return (
    <div className="page">
      <h1 className="page-title">Student Performance</h1>

      <div className="performance-grid">
        <div className="card">
          <h2>Add / Update Performance</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Student ID</label>
              <input
                type="number"
                value={form.student_id}
                onChange={(e) => handleStudentIdChange(e.target.value)}
                placeholder="Enter student ID"
                required
              />
              {studentId ? (
                <small style={{ color: '#666' }}>
                  {isUpdate ? 'Existing record found — will update' : 'No record found — will add new'}
                </small>
              ) : null}
            </div>
            <div className="form-group">
              <label>Attendance</label>
              <input
                type="number"
                step="0.1"
                value={form.attendance}
                onChange={(e) => setForm({ ...form, attendance: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Assignment Average</label>
              <input
                type="number"
                step="0.1"
                value={form.assignment_average}
                onChange={(e) => setForm({ ...form, assignment_average: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Mid Semester Marks</label>
              <input
                type="number"
                step="0.1"
                value={form.midterm_marks}
                onChange={(e) => setForm({ ...form, midterm_marks: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>End Semester Marks</label>
              <input
                type="number"
                step="0.1"
                value={form.endsemester_marks}
                onChange={(e) => setForm({ ...form, endsemester_marks: e.target.value })}
              />
            </div>
            <button type="submit" className="btn-primary btn-full">
              {isUpdate ? 'Update Performance' : 'Add Performance'}
            </button>
            <button type="button" onClick={resetForm} className="btn-secondary btn-full" style={{ marginTop: '10px' }}>
              Clear Form
            </button>
          </form>
        </div>

        <div className="card">
          <h2>Generate AI Summary</h2>
          <p>Generate AI based performance summary for a student.</p>
          <button onClick={() => navigate('/summary')} className="btn-primary btn-full">Generate</button>
        </div>

        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h2>Performance Table</h2>
          <PerformanceTable data={performances} onEdit={handleEdit} />
        </div>
      </div>
    </div>
  )
}
