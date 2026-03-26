import { Canvas, useFrame } from '@react-three/fiber'
import { memo, useRef } from 'react'

function QueueCard({ position, rotation, color, accent, speed = 0.5, offset = 0 }) {
  const ref = useRef(null)

  useFrame((state) => {
    if (!ref.current) {
      return
    }

    const time = state.clock.elapsedTime * speed + offset
    ref.current.position.y = position[1] + Math.sin(time) * 0.08
    ref.current.rotation.z = rotation[2] + Math.sin(time * 0.75) * 0.03
    ref.current.rotation.x = rotation[0] + Math.cos(time * 0.55) * 0.02
  })

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[1.46, 0.9, 0.08]} />
        <meshStandardMaterial color={color} transparent opacity={0.84} metalness={0.06} roughness={0.5} />
      </mesh>

      <mesh position={[-0.24, 0.16, 0.05]}>
        <boxGeometry args={[0.62, 0.08, 0.01]} />
        <meshStandardMaterial color="#cfb995" transparent opacity={0.9} />
      </mesh>
      <mesh position={[0.08, -0.04, 0.05]}>
        <boxGeometry args={[0.9, 0.07, 0.01]} />
        <meshStandardMaterial color="#d8c6a4" transparent opacity={0.9} />
      </mesh>
      <mesh position={[-0.42, -0.24, 0.05]}>
        <sphereGeometry args={[0.11, 14, 14]} />
        <meshStandardMaterial color={accent} metalness={0.26} roughness={0.28} />
      </mesh>
    </group>
  )
}

function StatusOrb({ position, color, speed = 0.28, scale = 1 }) {
  const ref = useRef(null)

  useFrame((state) => {
    if (!ref.current) {
      return
    }

    ref.current.rotation.y = state.clock.elapsedTime * speed
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.32) * 0.22
  })

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh>
        <torusGeometry args={[0.38, 0.045, 14, 36]} />
        <meshStandardMaterial color={color} transparent opacity={0.78} metalness={0.44} roughness={0.24} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.22, 0.03, 14, 28]} />
        <meshStandardMaterial color="#f8f0e2" transparent opacity={0.66} metalness={0.18} roughness={0.28} />
      </mesh>
    </group>
  )
}

function BackgroundObjects() {
  return (
    <>
      <QueueCard position={[-4.1, 1.9, -1]} rotation={[0.34, 0.44, -0.18]} color="#fff7ea" accent="#d95f43" speed={0.42} />
      <QueueCard position={[4.3, -1.42, -1.4]} rotation={[-0.3, -0.5, 0.22]} color="#f7efde" accent="#2f6b52" speed={0.48} offset={0.5} />
      <QueueCard position={[-2.82, -2.22, -2.4]} rotation={[0.18, 0.26, -0.1]} color="#fbf4e7" accent="#f0c36a" speed={0.38} offset={1.1} />
      <QueueCard position={[2.62, 2.42, -2.1]} rotation={[-0.22, -0.34, 0.08]} color="#fffaf2" accent="#d95f43" speed={0.44} offset={1.7} />

      <StatusOrb position={[-5.05, -0.08, 0]} color="#d95f43" speed={0.26} />
      <StatusOrb position={[5.22, 1.08, -0.5]} color="#2f6b52" speed={0.22} scale={0.94} />
      <StatusOrb position={[0.72, -3.08, -1.3]} color="#f0c36a" speed={0.3} scale={0.88} />
    </>
  )
}

export const BackgroundScene = memo(function BackgroundScene() {
  return (
    <div className="background-scene-layer" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 8.8], fov: 34 }}
        dpr={[1, 1.05]}
        gl={{ antialias: false, powerPreference: 'low-power' }}
      >
        <ambientLight intensity={0.92} />
        <directionalLight position={[5, 4, 6]} intensity={1.12} color="#fff0d6" />
        <pointLight position={[-6, 2, 3]} intensity={0.6} color="#d95f43" />
        <pointLight position={[6, -2, 3]} intensity={0.6} color="#2f6b52" />
        <BackgroundObjects />
      </Canvas>
    </div>
  )
})
