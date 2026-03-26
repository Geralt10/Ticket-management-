import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export function RegisterPage() {
  const navigate = useNavigate()
  const { getErrorMessage, isAuthenticated, isAdmin, loading, register } = useAuth()
  const [form, setForm] = useState({ name: '', username: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await register(form)
      navigate('/dashboard', { replace: true })
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-wrap">
      <motion.section
        className="auth-card"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <span className="eyebrow">New workspace</span>
        <h1>Create your account and start filing tickets.</h1>
        <p>Registration creates a regular user account. Admin access stays reserved for seeded or manually managed users.</p>

        {error ? <div className="alert alert-error">{error}</div> : null}

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              value={form.username}
              onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              required
            />
          </div>

          <button className="button button-primary" disabled={submitting} type="submit">
            {submitting ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="auth-link-row">
          Already have an account? <Link to="/login">Sign in instead</Link>.
        </p>
      </motion.section>
    </div>
  )
}
