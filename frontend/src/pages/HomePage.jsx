import { lazy, Suspense, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'

const HeroScene = lazy(() => import('../components/HeroScene').then((module) => ({ default: module.HeroScene })))

const fadeUp = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.24 },
  transition: { duration: 0.55, ease: 'easeOut' },
}

const cardReveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
  transition: { duration: 0.42, ease: 'easeOut' },
}

const listStagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
}

const heroContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.06,
    },
  },
}

const heroItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

const listItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
}

const heroSignals = [
  { label: 'Average first response', value: '09m' },
  { label: 'Shared queue visibility', value: 'Full' },
  { label: 'Ticket lifecycle clarity', value: '3 stages' },
]

const commandMetrics = [
  {
    label: 'Intake speed',
    value: 'Fast',
    text: 'Users can raise a request in a few clicks and push it directly into the working queue.',
  },
  {
    label: 'Queue discipline',
    value: 'Clear',
    text: 'Every ticket keeps a visible status so no one has to guess what is happening next.',
  },
  {
    label: 'Admin control',
    value: 'Live',
    text: 'Admins can update progress and clean up completed requests without leaving the board.',
  },
]

const activityFeed = [
  {
    title: 'VPN access reset',
    team: 'IT desk',
    time: 'Updated 2 min ago',
    status: 'In Progress',
    tone: 'progress',
  },
  {
    title: 'New employee onboarding kit',
    team: 'Operations',
    time: 'Opened 9 min ago',
    status: 'Open',
    tone: 'open',
  },
  {
    title: 'Printer spooler outage',
    team: 'Infrastructure',
    time: 'Closed 14 min ago',
    status: 'Closed',
    tone: 'closed',
  },
  {
    title: 'Finance portal permissions',
    team: 'Access control',
    time: 'Escalated 21 min ago',
    status: 'In Progress',
    tone: 'progress',
  },
]

const ribbonItems = [
  'Open intake lane',
  'Role-based dashboards',
  'Live queue visibility',
  'Admin triage controls',
  'Clear closure states',
  'Support operations cockpit',
]

const roleCards = [
  {
    eyebrow: 'For users',
    title: 'Submit and track requests without friction.',
    text: 'A focused entry flow, clearer status labels, and a calmer dashboard help users stay informed without hunting for updates.',
    points: ['Quick ticket intake', 'Clear progress states', 'Recent activity at a glance'],
  },
  {
    eyebrow: 'For admins',
    title: 'Run the queue like an operational control room.',
    text: 'The admin side is built around visibility, action density, and a cleaner sense of what needs attention next.',
    points: ['Unified request queue', 'Fast status changes', 'Immediate removal actions'],
  },
]

const spotlightNotes = [
  {
    label: 'Intake lane',
    value: 'Structured',
    text: 'Requests start with a clean entry point so the queue stays readable from the beginning.',
  },
  {
    label: 'Status model',
    value: 'Visible',
    text: 'Open, In Progress, and Closed keep the workflow understandable without exposing internal details.',
  },
  {
    label: 'Admin flow',
    value: 'Focused',
    text: 'Queue controls stay close to the ticket context so actions feel faster and more deliberate.',
  },
]

const features = [
  {
    icon: '01',
    title: 'Fast request intake',
    text: 'A cleaner ticket form makes it easy for users to submit issues with enough detail for quick triage.',
  },
  {
    icon: '02',
    title: 'Single source of truth',
    text: 'Users and admins stay aligned because every ticket lives in one workflow with a visible current state.',
  },
  {
    icon: '03',
    title: 'Actionable admin board',
    text: 'The admin queue combines context, status controls, and removal actions into one focused operations view.',
  },
]

const steps = [
  {
    title: 'Capture the issue',
    text: 'A user logs in, submits a ticket, and adds the information the support team needs to move quickly.',
  },
  {
    title: 'Prioritize the queue',
    text: 'Admins review incoming requests in one shared board and identify what should move first.',
  },
  {
    title: 'Work the request',
    text: 'Tickets move into In Progress while updates stay visible to both sides of the workflow.',
  },
  {
    title: 'Close with clarity',
    text: 'Resolved tickets move to Closed so the queue stays tidy and the outcome is obvious.',
  },
]

export function HomePage() {
  const prefersReducedMotion = useReducedMotion()
  const [showHeroScene, setShowHeroScene] = useState(false)
  const [allowHeroScene, setAllowHeroScene] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return !window.matchMedia('(max-width: 820px), (prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const mediaQuery = window.matchMedia('(max-width: 820px), (prefers-reduced-motion: reduce)')
    const syncAllowance = () => setAllowHeroScene(!mediaQuery.matches)

    syncAllowance()
    mediaQuery.addEventListener('change', syncAllowance)

    return () => mediaQuery.removeEventListener('change', syncAllowance)
  }, [])

  useEffect(() => {
    let timeoutId

    const enableScene = () => setShowHeroScene(true)

    if (prefersReducedMotion || !allowHeroScene) {
      setShowHeroScene(false)
      return undefined
    }

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      timeoutId = window.requestIdleCallback(enableScene, { timeout: 1200 })
      return () => window.cancelIdleCallback(timeoutId)
    }

    timeoutId = window.setTimeout(enableScene, 350)
    return () => window.clearTimeout(timeoutId)
  }, [allowHeroScene, prefersReducedMotion])

  const getTapMotion = (offset = -3) =>
    prefersReducedMotion
      ? {}
      : {
          whileTap: { scale: 0.985, y: offset },
        }

  const getHoverMotion = (offset = -6) =>
    prefersReducedMotion
      ? {}
      : {
          whileHover: { y: offset, scale: 1.01 },
          whileTap: { scale: 0.985, y: offset / 2 },
        }

  return (
    <>
    
    
      <motion.section
        className="hero-grid home-hero"
        variants={heroContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div
          className="hero-card hero-card-premium"
          variants={heroItem}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          <motion.span className="eyebrow" variants={heroItem}>
            Ticket Management System
          </motion.span>

          <div className="hero-lead-row">
            <motion.h1 variants={heroItem}>
              Support operations that feel precise, cinematic, and ready for real work.
            </motion.h1>

            <motion.div className="hero-orbit-badge" variants={heroItem} {...getTapMotion(-2)}>
              <span>Live queue</span>
              <strong>Always in sync</strong>
            </motion.div>
          </div>

          <motion.p variants={heroItem}>
            A modern support workflow built for clean intake, visible progress, and a stronger handoff between users
            and admins from first request to final closure.
          </motion.p>

          <motion.div className="hero-actions" variants={heroItem}>
            <Link className="button button-primary" to="/register">
              Start submitting tickets
            </Link>
            <Link className="button button-secondary" to="/login">
              Enter the dashboard
            </Link>
          </motion.div>

          <motion.div className="hero-signal-strip" variants={listStagger}>
            {heroSignals.map((signal) => (
              <motion.div
                className="hero-signal"
                key={signal.label}
                variants={listItem}
                {...getHoverMotion(-4)}
                transition={{ duration: 0.24, ease: 'easeOut' }}
              >
                <strong>{signal.value}</strong>
                <span>{signal.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
         
        <motion.aside
          className="spotlight-panel panel spotlight-panel-premium"
          variants={heroItem}
          transition={{ duration: 0.72, ease: 'easeOut' }}
        >
          <motion.div
            className="hero-visual-wrap"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.2, ease: 'easeOut' }}
          >
            {showHeroScene && allowHeroScene ? (
              <Suspense fallback={<div className="hero-scene-fallback" />}>
                <HeroScene />
              </Suspense>
            ) : (
              <div className="hero-scene-fallback" />
            )}
          </motion.div>

          <div className="spotlight-copy">
            <span className="eyebrow">Command view</span>
            <h2>One shared space for new issues, escalations, and closure.</h2>
            <p>
              The landing experience now frames the product like a support command center instead of a plain stack of
              forms and tables.
            </p>
          </div>

          <motion.div className="support-console" variants={listStagger}>
            <div className="support-console-head">
              <strong>Live activity lane</strong>
              <span>Newest requests appear first</span>
            </div>

            {activityFeed.slice(0, 3).map((item) => (
              <motion.div
                className="support-console-item"
                key={item.title}
                variants={listItem}
                {...getTapMotion(-2)}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <div>
                  <strong>{item.title}</strong>
                  <span>
                    {item.team} / {item.time}
                  </span>
                </div>
                <span className={`status-pill status-pill-${item.tone}`}>{item.status}</span>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div className="spotlight-footer-grid" variants={listStagger}>
            {spotlightNotes.map((note) => (
              <motion.article
                className="spotlight-mini-card"
                key={note.label}
                variants={listItem}
                {...getHoverMotion(-4)}
                transition={{ duration: 0.24, ease: 'easeOut' }}
              >
                <span>{note.label}</span>
                <strong>{note.value}</strong>
                <p>{note.text}</p>
              </motion.article>
            ))}
          </motion.div>
        </motion.aside>
      </motion.section>

      <motion.section
        className="workflow-ribbon"
        {...fadeUp}
      >
        <div className="workflow-ribbon-shell">
          <div className="workflow-ribbon-track">
            {[...ribbonItems, ...ribbonItems].map((item, index) => (
              <span className="workflow-ribbon-item" key={`${item}-${index}`}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </motion.section>
      
      <motion.section className="section section-emphasis" {...fadeUp}>
        <div className="section-header">
          <div>
            <span className="eyebrow">Command center</span>
            <h2>See the queue like an operations desk, not a plain form page.</h2>
            <p>
              The experience is designed to help users submit faster and help admins stay on top of every active
              request.
            </p>
          </div>
        </div>

        <div className="command-center-grid">
          <article className="command-center-card panel">
            <div className="command-center-copy">
              <span className="eyebrow">Control metrics</span>
              <h3>Make ticket handling feel intentional from the first screen.</h3>
              
            </div>

            <div className="command-metrics-grid">
              {commandMetrics.map((metric, index) => (
                <motion.article
                  className="command-metric"
                  key={metric.label}
                  {...cardReveal}
                  transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
                  {...getHoverMotion(-4)}
                >
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                  <p>{metric.text}</p>
                </motion.article>
              ))}
            </div>
          </article>

          <article className="activity-rail panel">
            <div className="activity-rail-head">
              <span className="eyebrow">Queue preview</span>
              <h3>Recent activity</h3>
            </div>

            <div className="activity-list">
              {activityFeed.map((item, index) => (
                <motion.div
                  className="activity-item"
                  key={`${item.title}-${item.time}`}
                  {...cardReveal}
                  transition={{ duration: 0.38, delay: index * 0.06, ease: 'easeOut' }}
                  {...getTapMotion(-2)}
                >
                  <div className={`activity-dot activity-dot-${item.tone}`} />
                  <div className="activity-copy">
                    <strong>{item.title}</strong>
                    <span>
                      {item.team} / {item.time}
                    </span>
                  </div>
                  <span className={`activity-pill activity-pill-${item.tone}`}>{item.status}</span>
                </motion.div>
              ))}
            </div>
          </article>
        </div>
      </motion.section>

      <motion.section className="section" {...fadeUp}>
        <div className="section-header">
          <div>
            <span className="eyebrow">Experience</span>
            <h2>Two sides of the workflow, designed with different priorities.</h2>
          </div>
        </div>

        <div className="experience-grid">
          {roleCards.map((role, index) => (
            <motion.article
              key={role.title}
              className="experience-card panel"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={prefersReducedMotion ? undefined : { y: -6, scale: 1.01 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.985, y: -3 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
            >
              <span className="eyebrow">{role.eyebrow}</span>
              <h3>{role.title}</h3>
              <p>{role.text}</p>
              <div className="experience-points">
                {role.points.map((point) => (
                  <div className="experience-point" key={point}>
                    <span className="experience-point-dot" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section className="section" {...fadeUp}>
        <div className="section-header">
          <div>
            <span className="eyebrow">Capabilities</span>
            <h2>Core features that keep the system usable for both sides of the workflow.</h2>
          </div>
        </div>

        <div className="feature-grid">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              className="feature-card"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={
                prefersReducedMotion
                  ? undefined
                  : { y: -8, rotateX: 3, rotateY: index === 1 ? 0 : index % 2 === 0 ? -3 : 3, scale: 1.01 }
              }
              whileTap={prefersReducedMotion ? undefined : { scale: 0.985, y: -3 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section className="section" {...fadeUp}>
        <div className="section-header">
          <div>
            <span className="eyebrow">Workflow</span>
            <h2>A visible path from issue creation to resolution.</h2>
          </div>
        </div>

        <div className="timeline-grid timeline-grid-extended">
          {steps.map((step, index) => (
            <motion.article
              key={step.title}
              className="timeline-card"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={prefersReducedMotion ? undefined : { y: -6, scale: 1.01 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.985, y: -3 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
            >
              <div className="timeline-index">{String(index + 1).padStart(2, '0')}</div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="cta-banner panel"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <div className="cta-banner-copy">
          <span className="eyebrow">Get started</span>
          <h2>Create a ticket as a user or step into the admin board and run the queue with clarity.</h2>
          <p>Built for teams that want smoother support flows, cleaner status tracking, and a front end that feels memorable.</p>
        </div>

        <div className="stack-row">
          <Link className="button button-primary" to="/login">
            Open dashboard
          </Link>
          <Link className="button button-secondary" to="/register">
            Create account
          </Link>
        </div>
      </motion.section>
    </>
  )
}
