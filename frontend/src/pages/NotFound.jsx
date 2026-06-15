import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="page" style={{ textAlign: 'center', paddingTop: '60px' }}>
      <h1 style={{ fontSize: '72px', color: '#3b82f6' }}>404</h1>
      <h2>Page Not Found</h2>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
        Go Home
      </Link>
    </div>
  )
}
