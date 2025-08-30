"use client";
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, extend, useFrame, useLoader, useThree } from "@react-three/fiber";
import { CameraShake, Effects } from '@react-three/drei'
import { FilmPass, WaterPass, UnrealBloomPass, LUTPass, LUTCubeLoader } from 'three-stdlib'
extend({ WaterPass, UnrealBloomPass, FilmPass, LUTPass })

export default function SwarmScene() {
  return (
    <Canvas className="w-full h-full" dpr={1} camera={{ fov: 100, position: [0, 0, 30] }}>
      <ambientLight intensity={0.01} />
      <pointLight distance={60} intensity={4} decay={0} color="lightblue" />
      <spotLight
        intensity={1.5}
        position={[0, 0, 2000]}
        penumbra={1}
        decay={0}
        color="red"
      />
      <mesh>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial
          color="#00ffff"
          roughness={0.5}
          depthTest={false}
          toneMapped={false}
        />
      </mesh>
      <Swarm count={10000} />
      <Postpro />
      <Rig />
    </Canvas>
  );
}


function Swarm({ count, dummy = new THREE.Object3D() }: { count: number, dummy?: THREE.Object3D }) {
  const mesh = useRef<THREE.InstancedMesh | null>(null)
  const light = useRef<THREE.PointLight | null>(null)
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100
      const factor = 20 + Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const xFactor = -50 + Math.random() * 100
      const yFactor = -50 + Math.random() * 100
      const zFactor = -50 + Math.random() * 100
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
    }
    return temp
  }, [count])
  useFrame((state) => {
    light.current?.position.set((-state.pointer.x * state.viewport.width) / 5, (-state.pointer.y * state.viewport.height) / 5, 0)
    particles.forEach((particle, i) => {
      let { t } = particle
      const { factor, speed, xFactor, yFactor, zFactor } = particle
      t = particle.t += speed / 2
      const a = Math.cos(t) + Math.sin(t * 1) / 10
      const b = Math.sin(t) + Math.cos(t * 2) / 10
      const s = Math.cos(t)
      particle.mx += (state.pointer.x * 1000 - particle.mx) * 0.01
      particle.my += (state.pointer.y * 1000 - 1 - particle.my) * 0.01
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      )
      dummy.scale.setScalar(s)
      dummy.rotation.set(s * 5, s * 5, s * 5)
      dummy.updateMatrix()
      mesh.current?.setMatrixAt(i, dummy.matrix)
    })
    mesh.current!.instanceMatrix.needsUpdate = true
  })
  return (
    <>
      <pointLight ref={light} distance={40} intensity={8} color="lightblue">
        <mesh scale={[1, 1, 6]}>
          <dodecahedronGeometry args={[4, 0]} />
        </mesh>
      </pointLight>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#020000" roughness={0.5} />
      </instancedMesh>
    </>
  )
}

function Postpro() {
  const water = useRef<WaterPass | null>(null)
  const data = useLoader(LUTCubeLoader, '/cubicle.CUBE')
  useFrame((state) => (water.current!.time = state.clock.elapsedTime * 4))
  return (
    <Effects disableGamma>
      <waterPass ref={water} factor={1} />
      <unrealBloomPass args={[undefined, 1.25, 1, 0]} />
      <filmPass args={[0.2, 0.5, 1500, false]} />
      <lUTPass lut={data.texture} intensity={0.75} />
    </Effects>
  )
}

function Rig() {
  const [vec] = useState(() => new THREE.Vector3())
  const { camera, mouse } = useThree()
  useFrame(() => camera.position.lerp(vec.set(mouse.x * 2, 1, 60), 0.05))
  return <CameraShake maxYaw={0.01} maxPitch={0.1} maxRoll={0.1} yawFrequency={0.1} pitchFrequency={0.5} rollFrequency={0.4} />
}


