import { useEffect, useState } from 'react'
import * as api from '../services/api'
import StudentTable from '../components/StudentTable'
import ConfirmDialog from '../components/ConfirmDialog'
import Loader from '../components/Loader'

export default function Students() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ roll_number: '', name: '', email: '', department: '', semester: '' })
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    loadStudents()
  }, [])

  async function loadStudents() {
    setLoading(true)
    try {
      const data = await api.getStudents()
      setStudents(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(student) {
    setEditingId(student.id)
    setForm(student)
  }

  async function handleUpdate(e) {
    e.preventDefault()
    try {
      await api.updateStudent(editingId, form)
      alert('Student updated!')
      setEditingId(null)
      loadStudents()
    } catch (err) {
      alert('Update failed')
    }
  }

  async function handleDelete() {
    try {
      await api.deleteStudent(deleteId)
      alert('Student deleted!')
      setDeleteId(null)
      loadStudents()
    } catch (err) {
      alert('Delete failed')
    }
  }

  if (loading) return <Loader />

  return (
    <div className="page">
      <h1 className="page-title">Student Database</h1>

      <div className="students-grid">
        <div className="card">
          <h2>{editingId ? 'Update Student' : 'Edit Student'}</h2>
          {editingId && (
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Roll Number</label>
                <input value={form.roll_number} onChange={(e) => setForm({ ...form, roll_number: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input value={form.department || ''} onChange={(e) => setForm({ ...form, department: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Semester</label>
                <input value={form.semester || ''} onChange={(e) => setForm({ ...form, semester: e.target.value })} />
              </div>
              <button type="submit" className="btn-primary btn-full">Update</button>
              <button type="button" className="btn-secondary btn-full" onClick={() => setEditingId(null)}>Cancel</button>
            </form>
          )}
          {!editingId && <p>Select a student from the table to edit</p>}
        </div>

        <div className="card">
          <h2>Delete Student</h2>
          <div className="form-group">
            <label>Roll Number to Delete</label>
            <input
              placeholder="Enter roll number"
              onBlur={(e) => {
                const s = students.find(st => st.roll_number === e.target.value)
                if (s) setDeleteId(s.id)
              }}
            />
          </div>
          {deleteId && (
            <button onClick={() => setDeleteId(null)} className="btn-danger btn-full">Cancel Delete</button>
          )}
          {deleteId && (
            <button onClick={handleDelete} className="btn-danger btn-full">Confirm Delete</button>
          )}
        </div>

        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h2>Student List</h2>
          <StudentTable data={students} onEdit={handleEdit} onDelete={(id) => setDeleteId(id)} />
        </div>
      </div>

      {deleteId && (
        <ConfirmDialog
          message="Are you sure you want to delete this student?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  )
}
