import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { api } from '../api/client'
import { TicketTable } from '../components/TicketTable'
import { useAuth } from '../context/AuthContext'

function getStatusCount(tickets, status) {
  return tickets.filter((ticket) => ticket.status === status).length
}

export function AdminDashboardPage() {
  const { getErrorMessage, user } = useAuth()
  const prefersReducedMotion = useReducedMotion()
  const [tickets, setTickets] = useState([])
  const [statuses, setStatuses] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [pendingId, setPendingId] = useState(null)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/admin/tickets')
        setTickets(response.data.tickets)
        setStatuses(response.data.statuses)
      } catch (requestError) {
        setError(getErrorMessage(requestError))
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [getErrorMessage])

  const handleStatusChange = async (ticketId, status) => {
    setError('')
    setSuccess('')
    setPendingId(ticketId)

    try {
      const response = await api.patch(`/admin/tickets/${ticketId}`, { status })
      setTickets((current) =>
        current.map((ticket) => (ticket.id === ticketId ? response.data.ticket : ticket)),
      )
      setSuccess(response.data.message)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setPendingId(null)
    }
  }

  const handleDelete = async (ticketId) => {
    setError('')
    setSuccess('')
    setPendingId(ticketId)

    try {
      const response = await api.delete(`/admin/tickets/${ticketId}`)
      setTickets((current) => current.filter((ticket) => ticket.id !== ticketId))
      setSuccess(response.data.message)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setPendingId(null)
    }
  }

  const totalTickets = tickets.length
  const openTickets = getStatusCount(tickets, 'Open')
  const progressTickets = getStatusCount(tickets, 'In Progress')
  const closedTickets = getStatusCount(tickets, 'Closed')
  const oldestOpenTicket = tickets.find((ticket) => ticket.status === 'Open')

  const summaryCards = [
    {
      label: 'Total queue',
      value: totalTickets,
      note: 'Every request currently in the system',
    },
    {
      label: 'Open lane',
      value: openTickets,
      note: 'Requests waiting for first touch or prioritization',
    },
    {
      label: 'Active lane',
      value: progressTickets,
      note: 'Tickets the team is working through right now',
    },
    {
      label: 'Closed lane',
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
          <span className="eyebrow">Admin board</span>
          <h1>{user?.name}, the queue is now framed like an operations cockpit.</h1>
          <p>
            Review incoming requests, move work through the status pipeline, and keep the system clean without hopping
            between multiple screens.
          </p>
        </div>

        <div className="dashboard-hero-spotlight">
          <span className="eyebrow">Priority lane</span>
          <strong>{oldestOpenTicket ? oldestOpenTicket.title : 'No open ticket waiting right now'}</strong>
          <p>
            {oldestOpenTicket
              ? `Next obvious action: review ticket #${oldestOpenTicket.id} and decide whether it should move into active work.`
              : 'The open lane is clear. New requests will surface here as soon as they appear.'}
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

      <div className="board-insight-grid">
        <motion.article
          className="dashboard-card insight-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.16 }}
          transition={{ duration: 0.42, ease: 'easeOut' }}
          whileTap={tapCard}
        >
          <div className="card-header-block">
            <span className="eyebrow">Queue notes</span>
            <h2>What matters most right now</h2>
          </div>

          <div className="workflow-rail-list">
            <div className="workflow-rail-item">
              <span className="badge badge-open">Open</span>
              <p>Keep this lane lean so first-response time stays low and new requests do not pile up.</p>
            </div>
            <div className="workflow-rail-item">
              <span className="badge badge-progress">In Progress</span>
              <p>Update this state consistently so users know their issue is actively moving through the queue.</p>
            </div>
            <div className="workflow-rail-item">
              <span className="badge badge-closed">Closed</span>
              <p>Use closure aggressively for completed work so the board stays sharp and operationally readable.</p>
            </div>
          </div>
        </motion.article>

        <motion.article
          className="dashboard-card insight-card insight-card-strong"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.16 }}
          transition={{ duration: 0.42, delay: 0.06, ease: 'easeOut' }}
          whileTap={tapCard}
        >
          <div className="card-header-block">
            <span className="eyebrow">Operator focus</span>
            <h2>Fewer clicks, clearer actions.</h2>
            <p className="muted-copy">
              Status controls and deletion actions stay near the ticket data so admins can process the queue with less
              context switching.
            </p>
          </div>
        </motion.article>
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
          <span className="eyebrow">All tickets</span>
          <h2>Operations overview</h2>
          <p className="muted-copy">
            This board combines user details, timestamps, and queue actions so admins can work the pipeline from one
            place.
          </p>
        </div>

        {error ? <div className="alert alert-error">{error}</div> : null}
        {success ? <div className="alert alert-success">{success}</div> : null}

        {loading ? (
          <div className="loading-panel">Loading the admin queue...</div>
        ) : (
          <TicketTable
            tickets={tickets}
            showUser
            statuses={statuses}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            pendingId={pendingId}
          />
        )}
      </motion.article>
    </motion.section>
  )
}
