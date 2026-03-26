import { lazy, Suspense, useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { AnimatedCursor } from './AnimatedCursor'
import { IntroScreen } from './IntroScreen'

const BackgroundScene = lazy(() =>
  import('./BackgroundScene').then((module) => ({ default: module.BackgroundScene })),
)

const themeStorageKey = 'ticket-management-theme'

function ThemeToggle({ theme, onToggle, compact = false }) {
  return (
    <button
      type="button"
      className={`theme-toggle ${compact ? 'theme-toggle-compact' : ''}`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      onClick={onToggle}
    >
      <span className="theme-toggle-track">
        <span className="theme-toggle-knob" />
      </span>
      <span className="theme-toggle-label">
        {theme === 'dark' ? 'Dark mode' : 'Light mode'}
      </span>
    </button>
  )
}

export function AppShell({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAdmin, isAuthenticated, logout } = useAuth()

  const [showBackground, setShowBackground] = useState(false)
  const [showIntro, setShowIntro] = useState(false)
  const [introPlayed, setIntroPlayed] = useState(false)
  const [introDone, setIntroDone] = useState(false) // ✅ NEW
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [allowBackgroundScene, setAllowBackgroundScene] = useState(() => {
    if (typeof window === 'undefined') return false
    return !window.matchMedia('(max-width: 900px), (prefers-reduced-motion: reduce)').matches
  })

  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light'
    const stored = window.localStorage.getItem(themeStorageKey)
    if (stored === 'dark' || stored === 'light') return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  // ✅ Background allowance
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 900px), (prefers-reduced-motion: reduce)')
    const sync = () => setAllowBackgroundScene(!mediaQuery.matches)

    sync()
    mediaQuery.addEventListener('change', sync)
    return () => mediaQuery.removeEventListener('change', sync)
  }, [])

  // ✅ Background load
  useEffect(() => {
    setShowBackground(false)

    if (location.pathname !== '/' || !allowBackgroundScene) return

    let id
    const enable = () => setShowBackground(true)

    if ('requestIdleCallback' in window) {
      id = window.requestIdleCallback(enable, { timeout: 900 })
      return () => window.cancelIdleCallback(id)
    }

    id = setTimeout(enable, 250)
    return () => clearTimeout(id)
  }, [allowBackgroundScene, location.pathname])

  // 🔥 INTRO CONTROL (FIXED)
  useEffect(() => {
    if (location.pathname !== '/' || introPlayed) {
      setShowIntro(false)
      setIntroDone(true)
      return
    }

    setShowIntro(true)

    const id = setTimeout(() => {
      setShowIntro(false)
      setIntroPlayed(true)
      setIntroDone(true) // ✅ TRIGGER MAIN CONTENT
    }, 3600)

    return () => clearTimeout(id)
  }, [introPlayed, location.pathname])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Theme apply
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem(themeStorageKey, theme)
  }, [theme])

  const handleLogout = async () => {
    setMobileMenuOpen(false)
    await logout()
    navigate('/')
  }

  const handleThemeToggle = () => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }

  const navItems = [{ to: '/', label: 'Home' }]

  if (isAuthenticated && !isAdmin) navItems.push({ to: '/dashboard', label: 'My Tickets' })
  if (isAdmin) navItems.push({ to: '/admin', label: 'Admin Board' })
  if (!isAuthenticated) {
    navItems.push({ to: '/login', label: 'Login' })
    navItems.push({ to: '/register', label: 'Register' })
  }

  return (
    <div className="app-shell">
      <AnimatedCursor />

      {/* 🔥 INTRO + MAIN TRANSITION */}
      <AnimatePresence mode="wait">
        {showIntro && <IntroScreen key="intro" />}
      </AnimatePresence>

      {/* Background */}
      {showBackground && (
        <Suspense fallback={null}>
          <BackgroundScene />
        </Suspense>
      )}

      {/* 🔥 MAIN CONTENT ONLY AFTER INTRO */}
      {introDone && (
        <motion.div
          key="app"
          className="container app-content"
          initial={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* HEADER */}
          <header className="topbar">
            <div className="desktop-header-row">
              <div className="brand">
                <div className="brand-badge">TM</div>
                <div className="brand-copy">
                  <strong>Ticket Management</strong>
                  <span>Support operations cockpit</span>
                </div>
              </div>

              <div className="desktop-nav-group">
                <nav className="nav-links">
                  {navItems.map((item) => (
                    <NavLink key={item.to} className="nav-link" to={item.to}>
                      {item.label}
                    </NavLink>
                  ))}
                </nav>

                <div className="nav-actions">
                  <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
                  {isAuthenticated && (
                    <>
                      <span className="nav-user-chip">{user.name}</span>
                      <button className="button button-secondary" onClick={handleLogout}>
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* PAGE CONTENT */}
          <AnimatePresence mode="wait">
            <motion.main
              key={location.pathname}
              className="page-shell"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.main>
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}