function badgeClass(status) {
  switch (status) {
    case 'In Progress':
      return 'badge badge-progress'
    case 'Closed':
      return 'badge badge-closed'
    default:
      return 'badge badge-open'
  }
}

function formatDate(value) {
  return new Date(value).toLocaleString()
}

function AdminActions({ ticket, statuses, onStatusChange, onDelete, pendingId }) {
  return (
    <div className="table-actions">
      <select
        value={ticket.status}
        onChange={(event) => onStatusChange(ticket.id, event.target.value)}
        disabled={pendingId === ticket.id}
      >
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <button
        className="button button-danger"
        onClick={() => onDelete(ticket.id)}
        disabled={pendingId === ticket.id}
        type="button"
      >
        Delete
      </button>
    </div>
  )
}

export function TicketTable({
  tickets,
  showUser = false,
  statuses = [],
  onStatusChange,
  onDelete,
  pendingId,
}) {
  if (!tickets.length) {
    return (
      <div className="table-empty-state">
        <span className="eyebrow">No activity yet</span>
        <h3>No tickets found.</h3>
        <p>The queue is empty right now, so this space will fill up as soon as new requests are created.</p>
      </div>
    )
  }

  return (
    <>
      <div className="table-wrap table-desktop">
        <table className="ticket-table">
          <thead>
            <tr>
              <th>Ticket</th>
              {showUser ? <th>Owner</th> : null}
              <th>Status</th>
              <th>Created</th>
              {showUser ? <th>Actions</th> : null}
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>
                  <div className="ticket-title-cell">
                    <span className="ticket-id-chip">#{ticket.id}</span>
                    <div>
                      <strong>{ticket.title}</strong>
                      <span className="meta-line">{ticket.description}</span>
                    </div>
                  </div>
                </td>
                {showUser ? (
                  <td>
                    <strong>{ticket.user?.name}</strong>
                    <span className="meta-line">@{ticket.user?.username}</span>
                  </td>
                ) : null}
                <td>
                  <span className={badgeClass(ticket.status)}>{ticket.status}</span>
                </td>
                <td>
                  <span className="date-stamp">{formatDate(ticket.created_at)}</span>
                </td>
                {showUser ? (
                  <td>
                    <AdminActions
                      ticket={ticket}
                      statuses={statuses}
                      onStatusChange={onStatusChange}
                      onDelete={onDelete}
                      pendingId={pendingId}
                    />
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ticket-cards">
        {tickets.map((ticket) => (
          <article className="ticket-card-mobile" key={ticket.id}>
            <div className="ticket-card-head">
              <div className="ticket-title-cell">
                <span className="ticket-id-chip">#{ticket.id}</span>
                <strong>{ticket.title}</strong>
              </div>
              <span className={badgeClass(ticket.status)}>{ticket.status}</span>
            </div>

            {showUser ? (
              <div className="ticket-card-section">
                <span className="ticket-card-label">User</span>
                <strong>{ticket.user?.name}</strong>
                <span className="meta-line">@{ticket.user?.username}</span>
              </div>
            ) : null}

            <div className="ticket-card-section">
              <span className="ticket-card-label">Ticket</span>
              <span className="meta-line">{ticket.description}</span>
            </div>

            <div className="ticket-card-section">
              <span className="ticket-card-label">Created</span>
              <span className="date-stamp">{formatDate(ticket.created_at)}</span>
            </div>

            {showUser ? (
              <div className="ticket-card-section">
                <span className="ticket-card-label">Actions</span>
                <AdminActions
                  ticket={ticket}
                  statuses={statuses}
                  onStatusChange={onStatusChange}
                  onDelete={onDelete}
                  pendingId={pendingId}
                />
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </>
  )
}
