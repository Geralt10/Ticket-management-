import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

const interactiveSelector = [
  'a',
  'button',
  '[role="button"]',
  '.button',
  '.nav-link',
  '.theme-toggle',
  '.hamburger',
  '.mobile-menu-close',
  '.hero-signal',
  '.spotlight-mini-card',
  '.support-console-item',
  '.command-metric',
  '.activity-item',
  '.experience-card',
  '.feature-card',
  '.timeline-card',
  '.dashboard-summary-card',
  '.ticket-card-mobile',
].join(', ')

const inputSelector = 'input, textarea, select, [contenteditable="true"]'

export function AnimatedCursor() {
  const prefersReducedMotion = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [interactive, setInteractive] = useState(false)
  const [editingField, setEditingField] = useState(false)
  const [pressed, setPressed] = useState(false)

  const pointerX = useMotionValue(-120)
  const pointerY = useMotionValue(-120)

  // 🔥 Smooth + Fast
  const ringX = useSpring(pointerX, { stiffness: 400, damping: 26, mass: 0.35 })
  const ringY = useSpring(pointerY, { stiffness: 400, damping: 26, mass: 0.35 })

  // ⚡ Instant dot (no lag)
  const dotX = pointerX
  const dotY = pointerY

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
    )

    const syncEnabled = () => setEnabled(mediaQuery.matches && !prefersReducedMotion)

    syncEnabled()
    mediaQuery.addEventListener('change', syncEnabled)

    return () => mediaQuery.removeEventListener('change', syncEnabled)
  }, [prefersReducedMotion])

  useEffect(() => {
    const className = 'custom-cursor-active'

    if (!enabled) {
      document.body.classList.remove(className)
      setVisible(false)
      setInteractive(false)
      setEditingField(false)
      return
    }

    document.body.classList.add(className)

    const updateTargetState = (target) => {
      if (!(target instanceof Element)) {
        setInteractive(false)
        setEditingField(false)
        return
      }

      const isEditing = Boolean(target.closest(inputSelector))
      setEditingField(isEditing)
      setInteractive(!isEditing && Boolean(target.closest(interactiveSelector)))
    }

    const handlePointerMove = (event) => {
      pointerX.set(event.clientX)
      pointerY.set(event.clientY)
      setVisible(true)
      updateTargetState(event.target)
    }

    const handlePointerDown = () => setPressed(true)
    const handlePointerUp = () => setPressed(false)

    const handleLeave = () => {
      setVisible(false)
      setPressed(false)
      setInteractive(false)
    }

    const handleWindowBlur = () => {
      setVisible(false)
      setPressed(false)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerdown', handlePointerDown, { passive: true })
    window.addEventListener('pointerup', handlePointerUp, { passive: true })
    window.addEventListener('pointercancel', handlePointerUp, { passive: true })
    window.addEventListener('blur', handleWindowBlur)
    document.documentElement.addEventListener('mouseleave', handleLeave)

    return () => {
      document.body.classList.remove(className)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
      window.removeEventListener('blur', handleWindowBlur)
      document.documentElement.removeEventListener('mouseleave', handleLeave)
    }
  }, [enabled, pointerX, pointerY])

  if (!enabled) return null

  const hidden = !visible || editingField

  return (
    <>
      {/* 🔵 RING */}
      <motion.div
        className={`custom-cursor custom-cursor-ring ${interactive ? 'is-interactive' : ''}`}
        style={{ left: ringX, top: ringY }}
        animate={{
          opacity: hidden ? 0 : 1,
          scale: pressed ? 0.92 : 1,
          width: interactive ? 54 : 38,
          height: interactive ? 54 : 38,
        }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      />

      {/* ⚡ DOT */}
      <motion.div
        className={`custom-cursor custom-cursor-dot ${interactive ? 'is-interactive' : ''}`}
        style={{ left: dotX, top: dotY }}
        animate={{
          opacity: hidden ? 0 : 1,
          scale: pressed ? 0.75 : interactive ? 1.3 : 1,
        }}
        transition={{ duration: 0.1, ease: 'easeOut' }}
      />
    </>
  )
}