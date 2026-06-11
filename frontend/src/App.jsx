import { useState } from 'react'
import './App.css'

function App() {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  function handleToggleScreen() {
    setIsLogin(!isLogin)
    setName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (isLogin) {
      alert(`Trying to login with ${email}`)
      return
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.')
      return
    }

    alert(`Registering ${name} with ${email}`)
  }

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="brand-name">SMS - Student Management System</div>
      </header>

      <main className="screen-layout">
        <section className="screen-card">
          <div className="screen-header">
            <h1>{isLogin ? 'Login Back to your Account' : 'Register New User'}</h1>
            <p>
              {isLogin
                ? 'Enter your email and password to continue.'
                : 'Fill in your details to create a new account.'}
            </p>
          </div>

          <form className="form-block" onSubmit={handleSubmit}>
            {!isLogin && (
              <label className="field-group">
                <span>Username</span>
                <input
                  type="text"
                  placeholder="Enter Username"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </label>
            )}

            <label className="field-group">
              <span>Email address</span>
              <input
                type="email"
                placeholder="Enter email id"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label className="field-group">
              <span>Password</span>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>

            {!isLogin && (
              <label className="field-group">
                <span>Confirm password</span>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
              </label>
            )}

            <button type="submit" className="action-button">
              {isLogin ? 'Login' : 'Register now'}
            </button>
          </form>

          <div className="switch-line">
            <span>
              {isLogin ? 'New here?' : 'Already Registered?'}
            </span>
            <button type="button" className="switch-button" onClick={handleToggleScreen}>
              {isLogin ? 'Register' : 'Login'}
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
