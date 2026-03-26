import { motion } from 'framer-motion'

const loadingSteps = [
  'Aligning intake lanes',
  'Syncing user roles',
  'Preparing support cockpit',
]

export function IntroScreen() {
  return (
    <motion.div
      className="intro-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }}
    >
      <div className="intro-orb intro-orb-primary" />
      <div className="intro-orb intro-orb-secondary" />

      <motion.div
        className="intro-card"
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.985, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <motion.div
          className="intro-badge"
          initial={{ rotate: -8, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          TM
        </motion.div>

        <motion.p
          className="intro-kicker"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18 }}
        >
          Ticket Management System
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.24 }}
        >
          Spinning up the support cockpit before your dashboard opens.
        </motion.h1>

        <motion.div
          className="intro-ticket-stack"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.28 }}
        >
          <motion.div
            className="intro-ticket intro-ticket-back"
            animate={{ y: [0, -6, 0], rotate: [-7, -5, -7] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="intro-ticket intro-ticket-mid"
            animate={{ y: [0, 6, 0], rotate: [4, 6, 4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.12 }}
          />
          <motion.div
            className="intro-ticket intro-ticket-front"
            animate={{ y: [0, -4, 0], rotate: [-2, 0, -2] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          >
            <div className="intro-ticket-line intro-ticket-line-short" />
            <div className="intro-ticket-line" />
            <div className="intro-ticket-line" />
            <div className="intro-status-pill">In Progress</div>
          </motion.div>
        </motion.div>

        <motion.div
          className="intro-steps"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.36 }}
        >
          {loadingSteps.map((step, index) => (
            <motion.div
              key={step}
              className="intro-step"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.45 + index * 0.14 }}
            >
              <span className="intro-step-dot" />
              <span>{step}</span>
            </motion.div>
          ))}
        </motion.div>

        <div className="intro-progress">
          <div className="intro-progress-bar" />
        </div>
      </motion.div>
    </motion.div>
  )
}
