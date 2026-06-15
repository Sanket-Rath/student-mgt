import { useState } from 'react'

export default function StudentTable({ data, onEdit, onDelete, onSearch }) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState('roll_number')

  const filtered = data.filter(s => 
    s.roll_number.includes(search) || s.name.includes(search)
  )

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'roll_number') return a.roll_number.localeCompare(b.roll_number)
    if (sort === 'name') return a.name.localeCompare(b.name)
    return 0
  })

  const pageSize = 10
  const pages = Math.ceil(sorted.length / pageSize)
  const start = (page - 1) * pageSize
  const paged = sorted.slice(start, start + pageSize)

  return (
    <div className="table-container">
      <div className="table-header">
        <input
          type="text"
          placeholder="Search by roll number or name..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="search-input"
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="sort-select">
          <option value="roll_number">Sort by Roll</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Semester</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paged.map(s => (
            <tr key={s.id} className="table-row">
              <td>{s.roll_number}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.department}</td>
              <td>{s.semester}</td>
              <td>
                <button className="btn-edit" onClick={() => onEdit(s)}>Edit</button>
                <button className="btn-delete" onClick={() => onDelete(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: pages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={page === i + 1 ? 'page-btn active' : 'page-btn'}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
