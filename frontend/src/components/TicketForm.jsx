import { useState } from 'react'

const initialForm = {
  title: '',
  description: '',
}

export function TicketForm({ onSubmit, submitting }) {
  const [form, setForm] = useState(initialForm)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const created = await onSubmit(form)

    if (created) {
      setForm(initialForm)
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          value={form.title}
          onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          placeholder="Printer issue, VPN access, onboarding request..."
          required
        />
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={form.description}
          onChange={(event) =>
            setForm((current) => ({ ...current, description: event.target.value }))
          }
          placeholder="Share enough detail so the support team can act quickly."
          required
        />
      </div>

      <button className="button button-primary" disabled={submitting} type="submit">
        {submitting ? 'Submitting...' : 'Submit Ticket'}
      </button>
    </form>
  )
}
