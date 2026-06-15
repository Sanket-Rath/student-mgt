import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <h1 className="big-heading">Welcome to Student Management System</h1>
      <p className="subtitle">One Platform. Endless Possibilities...</p>

      <div className="page-grid">
        <div className="card">
          <h2>Add Student</h2>
          <div className="field"><label>Roll No.</label><input placeholder="Enter the Roll No." /></div>
          <div className="field"><label>Name:</label><input placeholder="Enter the Name" /></div>
          <div className="field"><label>Email:</label><input placeholder="Enter the Email ID" /></div>
          <div className="field"><label>Department:</label><input placeholder="Enter the Department" /></div>
          <div className="field"><label>Current Semester:</label><input placeholder="Enter the Current Semester" /></div>
          <button className="btn-primary">Add</button>
        </div>

        <div className="card">
          <h2>Search Student</h2>
          <div className="field"><label>Roll No.:</label><input placeholder="Enter Roll No." /></div>
        </div>

        <div className="third-card">
          <h2>Services</h2>
          <div style={{marginTop:12}} className="card">
            <h3 style={{textAlign:'center'}}>Student Database</h3>
            <div style={{textAlign:'center',marginTop:12}}><Link to="/students" className="btn-primary">Database</Link></div>
          </div>

          <div style={{marginTop:18}} className="card">
            <h3 style={{textAlign:'center'}}>Student Performance</h3>
            <div style={{textAlign:'center',marginTop:12}}><Link to="/performance" className="btn-primary">Performance</Link></div>
          </div>

          <div style={{marginTop:18}} className="card">
            <h3 style={{textAlign:'center'}}>AI Based Performance Summary</h3>
            <div style={{textAlign:'center',marginTop:12}}><Link to="/summary" className="btn-primary">Summary</Link></div>
          </div>
        </div>
      </div>
    </div>
  )
}
