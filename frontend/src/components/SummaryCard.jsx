export default function SummaryCard({ summary, title }) {
  return (
    <div className="summary-card">
      <h3>{title}</h3>
      <div className="summary-content">
        {summary ? <p>{summary}</p> : <p style={{ color: '#999' }}>No summary available</p>}
      </div>
    </div>
  )
}
