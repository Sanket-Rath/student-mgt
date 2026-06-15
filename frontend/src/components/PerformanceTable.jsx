import { useState } from 'react'

export default function PerformanceTable({ data, onEdit }) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const filtered = data.filter((p) => {
    if (!search) return true
    const studentId = String(p.student_id || '')
    const name = p.student?.name || ''
    return studentId.includes(search) || name.includes(search)
  })

  const pageSize = 10
  const pages = Math.ceil(filtered.length / pageSize)
  const start = (page - 1) * pageSize
  const paged = filtered.slice(start, start + pageSize)

  return (
    <div className="table-container">
      <div className="table-header">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="search-input"
        />
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Attendance</th>
            <th>Assignment Avg</th>
            <th>Midterm</th>
            <th>Endterm</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paged.map(p => (
            <tr key={p.id} className="table-row">
              <td>{p.student_id}</td>
              <td>{p.attendance ?? '-'}</td>
              <td>{p.assignment_average ?? '-'}</td>
              <td>{p.midterm_marks ?? '-'}</td>
              <td>{p.endsemester_marks ?? '-'}</td>
              <td>
                <button className="btn-edit" onClick={() => onEdit(p)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: pages }, (_, i) => (
          <button key={i + 1} onClick={() => setPage(i + 1)} className={page === i + 1 ? 'page-btn active' : 'page-btn'}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
