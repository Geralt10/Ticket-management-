import { Canvas, useFrame } from '@react-three/fiber'
import { memo, useRef } from 'react'

function FloatingTicket({ position, rotation, color, accent, speed = 1, offset = 0 }) {
  const ref = useRef(null)

  useFrame((state) => {
    if (!ref.current) {
      return
    }

    const time = state.clock.elapsedTime * speed + offset
    ref.current.position.y = position[1] + Math.sin(time) * 0.12
    ref.current.rotation.z = rotation[2] + Math.sin(time * 0.85) * 0.04
    ref.current.rotation.y = rotation[1] + Math.cos(time * 0.6) * 0.05
  })

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[2.5, 1.5, 0.12]} />
        <meshStandardMaterial color={color} metalness={0.1} roughness={0.42} />
      </mesh>

      <mesh position={[-0.58, 0.34, 0.08]}>
        <boxGeometry args={[1.04, 0.12, 0.02]} />
        <meshStandardMaterial color="#cbb690" />
      </mesh>
      <mesh position={[0.14, 0.02, 0.08]}>
        <boxGeometry args={[1.58, 0.1, 0.02]} />
        <meshStandardMaterial color="#ddcdae" />
      </mesh>
      <mesh position={[0.02, -0.26, 0.08]}>
        <boxGeometry args={[1.84, 0.1, 0.02]} />
        <meshStandardMaterial color="#ddcdae" />
      </mesh>

      <mesh position={[-0.74, -0.42, 0.09]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color={accent} metalness={0.28} roughness={0.3} />
      </mesh>
    </group>
  )
}

function StatusHalo({ position, color, speed = 0.36 }) {
  const haloRef = useRef(null)

  useFrame((state) => {
    if (!haloRef.current) {
      return
    }

    haloRef.current.rotation.z = state.clock.elapsedTime * speed
  })

  return (
    <group position={position} ref={haloRef}>
      <mesh>
        <torusGeometry args={[0.46, 0.075, 14, 42]} />
        <meshStandardMaterial color={color} metalness={0.48} roughness={0.24} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.28, 0.045, 14, 36]} />
        <meshStandardMaterial color="#f4e8d2" metalness={0.22} roughness={0.3} />
      </mesh>
    </group>
  )
}

function TicketHeroModel() {
  const rootRef = useRef(null)

  useFrame((state, delta) => {
    if (!rootRef.current) {
      return
    }

    rootRef.current.rotation.y += delta * 0.1
    rootRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.06
  })

  return (
    <group ref={rootRef} scale={1.04}>
      <FloatingTicket
        position={[-0.84, 0.42, -0.52]}
        rotation={[-0.16, 0.34, 0.08]}
        color="#fffaf2"
        accent="#d95f43"
        speed={1.1}
      />
      <FloatingTicket
        position={[0.32, -0.05, 0]}
        rotation={[0.08, -0.2, -0.06]}
        color="#f6ecd7"
        accent="#2f6b52"
        speed={0.92}
        offset={0.7}
      />
      <FloatingTicket
        position={[1.02, -0.62, -0.36]}
        rotation={[0.18, 0.16, -0.12]}
        color="#fdf6eb"
        accent="#f0c36a"
        speed={0.84}
        offset={1.4}
      />

      <StatusHalo position={[2.04, 1.02, 0.56]} color="#d95f43" />
      <StatusHalo position={[-2.08, -0.92, 0.25]} color="#2f6b52" speed={0.28} />

      <mesh position={[0, 1.52, 0.34]}>
        <sphereGeometry args={[0.15, 18, 18]} />
        <meshStandardMaterial color="#f0c36a" emissive="#f0c36a" emissiveIntensity={0.18} />
      </mesh>
    </group>
  )
}

export const HeroScene = memo(function HeroScene() {
  return (
    <div className="hero-scene-shell" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.08, 6.1], fov: 40 }}
        dpr={[1, 1.1]}
        gl={{ antialias: false, powerPreference: 'low-power' }}
      >
        <ambientLight intensity={1.04} />
        <directionalLight position={[4, 4, 5]} intensity={1.9} color="#fff2df" />
        <pointLight position={[-4, -2, 2]} intensity={1.15} color="#2f6b52" />
        <pointLight position={[3, 2, 2]} intensity={1.2} color="#d95f43" />
        <TicketHeroModel />
      </Canvas>
    </div>
  )
})
