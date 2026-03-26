import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { api } from '../api/client'
import { TicketForm } from '../components/TicketForm'
import { TicketTable } from '../components/TicketTable'
import { useAuth } from '../context/AuthContext'

function getStatusCount(tickets, status) {
  return tickets.filter((ticket) => ticket.status === status).length
}

export function UserDashboardPage() {
  const { getErrorMessage, user } = useAuth()
  const prefersReducedMotion = useReducedMotion()
  const [tickets, setTickets] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/tickets')
        setTickets(response.data.tickets)
      } catch (requestError) {
        setError(getErrorMessage(requestError))
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [getErrorMessage])

  const handleCreateTicket = async (payload) => {
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      const response = await api.post('/tickets', payload)
      setTickets((current) => [response.data.ticket, ...current])
      setSuccess(response.data.message)
      return true
    } catch (requestError) {
      setError(getErrorMessage(requestError))
      return false
    } finally {
      setSubmitting(false)
    }
  }

  const totalTickets = tickets.length
  const openTickets = getStatusCount(tickets, 'Open')
  const progressTickets = getStatusCount(tickets, 'In Progress')
  const closedTickets = getStatusCount(tickets, 'Closed')
  const latestTicket = tickets[0]

  const summaryCards = [
    {
      label: 'Total requests',
      value: totalTickets,
      note: totalTickets ? 'Everything you have raised so far' : 'No tickets created yet',
    },
    {
      label: 'Still open',
      value: openTickets,
      note: 'Requests waiting for action or first review',
    },
    {
      label: 'In progress',
      value: progressTickets,
      note: 'Tickets the support team is actively working on',
    },
    {
      label: 'Closed',
      value: closedTickets,
      note: 'Resolved requests with a completed workflow',
    },
  ]

  const tapCard = prefersReducedMotion ? undefined : { scale: 0.985, y: -2 }

  return (
    <motion.section
      className="dashboard-stage"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="dashboard-hero panel">
        <div className="dashboard-hero-copy">
          <span className="eyebrow">User workspace</span>
          <h1>{user?.name}, your requests now live in a cleaner command view.</h1>
          <p>
            Submit a new issue, keep an eye on the queue, and understand exactly what moved from Open to In Progress to
            Closed without leaving the dashboard.
          </p>
        </div>

        <div className="dashboard-hero-spotlight">
          <span className="eyebrow">Latest movement</span>
          <strong>{latestTicket ? latestTicket.title : 'No recent ticket yet'}</strong>
          <p>
            {latestTicket
              ? `Current status: ${latestTicket.status}. Your newest request stays at the top so updates are easy to spot.`
              : 'Once you submit a ticket, the latest request will appear here with its current progress state.'}
          </p>
        </div>
      </div>

      <div className="dashboard-summary-grid">
        {summaryCards.map((card, index) => (
          <motion.article
            className="dashboard-summary-card panel"
            key={card.label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.38, delay: index * 0.05, ease: 'easeOut' }}
            whileTap={tapCard}
          >
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <p>{card.note}</p>
          </motion.article>
        ))}
      </div>

      <div className="dashboard-grid dashboard-grid-enhanced">
        <motion.article
          className="dashboard-card dashboard-card-form"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.16 }}
          transition={{ duration: 0.42, ease: 'easeOut' }}
          whileTap={tapCard}
        >
          <div className="card-header-block">
            <span className="eyebrow">Create ticket</span>
            <h2>Send a new request</h2>
            <p className="muted-copy">
              Capture the issue clearly so the support team gets enough context from the very first submission.
            </p>
          </div>

          {error ? <div className="alert alert-error">{error}</div> : null}
          {success ? <div className="alert alert-success">{success}</div> : null}

          <TicketForm onSubmit={handleCreateTicket} submitting={submitting} />
        </motion.article>

        <motion.aside
          className="dashboard-card workflow-rail"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.16 }}
          transition={{ duration: 0.42, delay: 0.06, ease: 'easeOut' }}
          whileTap={tapCard}
        >
          <div className="card-header-block">
            <span className="eyebrow">Queue guide</span>
            <h2>What the statuses mean</h2>
          </div>

          <div className="workflow-rail-list">
            <div className="workflow-rail-item">
              <span className="badge badge-open">Open</span>
              <p>Your request is in the intake lane and waiting for review or initial handling.</p>
            </div>
            <div className="workflow-rail-item">
              <span className="badge badge-progress">In Progress</span>
              <p>The support side is actively working on the request and the issue is moving through the queue.</p>
            </div>
            <div className="workflow-rail-item">
              <span className="badge badge-closed">Closed</span>
              <p>The issue has been resolved and the ticket lifecycle is complete.</p>
            </div>
          </div>
        </motion.aside>
      </div>

      <motion.article
        className="dashboard-card table-card"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.14 }}
        transition={{ duration: 0.42, delay: 0.08, ease: 'easeOut' }}
        whileTap={tapCard}
      >
        <div className="card-header-block">
          <span className="eyebrow">My tickets</span>
          <h2>Recent requests</h2>
          <p className="muted-copy">
            Your newest submissions appear first so it is easy to spot what changed most recently.
          </p>
        </div>

        {loading ? <div className="loading-panel">Loading tickets...</div> : <TicketTable tickets={tickets} />}
      </motion.article>
    </motion.section>
  )
}
