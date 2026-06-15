import { useState } from 'react'
import * as api from '../services/api'
import SummaryCard from '../components/SummaryCard'
import Loader from '../components/Loader'

export default function Summary() {
  const [studentId, setStudentId] = useState('')
  const [latest, setLatest] = useState(null)
  const [saved, setSaved] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleGenerate(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.generateSummary(parseInt(studentId, 10))
      setLatest(res)
    } catch (err) {
      alert('Failed to generate')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!latest) return
    setLoading(true)
    try {
      await api.saveSummary(parseInt(studentId, 10), latest.summary)
      alert('Summary saved!')
      handleLoadSaved()
    } catch (err) {
      alert('Save failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleLoadSaved() {
    setLoading(true)
    try {
      const res = await api.getSummary(parseInt(studentId, 10))
      setSaved(res)
    } catch (err) {
      alert('No saved summary')
      setSaved(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loader />

  return (
    <div className="page">
      <h1 className="page-title">AI Based Performance Summary Generator</h1>

      <div className="summary-grid">
        <div className="card">
          <h2>Generate Summary</h2>
          <form onSubmit={handleGenerate}>
            <div className="form-group">
              <label>Enter Student ID</label>
              <input
                type="number"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter Student ID"
                required
              />
            </div>
            <button type="submit" className="btn-primary btn-full">Generate</button>
          </form>

          <div style={{ marginTop: '20px' }}>
            <h3>Previous Summary</h3>
            <SummaryCard summary={saved?.summary} title="" />
            {studentId && (
              <button onClick={handleLoadSaved} className="btn-secondary btn-full" style={{ marginTop: '10px' }}>
                Load Saved
              </button>
            )}
          </div>
        </div>

        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h2>Latest Summary</h2>
          <SummaryCard summary={latest?.summary} title="" />
          {latest && (
            <button onClick={handleSave} className="btn-primary btn-full" style={{ marginTop: '15px' }}>
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
