"use client";

/* ============================================================
   Escena 3D del héroe · makis estilizados sobre plato cerámico
   React Three Fiber + Three.js · sin dependencias de red
   ============================================================ */

import { Component, Suspense, useEffect, useRef, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";

/* Colores de la marca */
const COL = {
  nori: "#161d14",
  rice: "#F4EFE2",
  salmon: "#F07A4E",
  salmonDeep: "#E05A34",
  plate: "#171310",
  plateRim: "#C9A24B",
  wood: "#8B5E3C",
  wasabi: "#6E8B3D",
  ginger: "#F2A9B8",
  gold: "#C9A24B",
  sesame: "#F7F1DC",
  aji: "#D93A2B",
  soy: "#241510",
};

/* ---------- Una pieza de maki ---------- */
function MakiPiece({
  position,
  rotation = 0,
  topping = false,
}: {
  position: [number, number, number];
  rotation?: number;
  topping?: boolean;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Nori exterior */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.44, 0.44, 0.34, 40]} />
        <meshPhysicalMaterial color={COL.nori} roughness={0.82} clearcoat={0.25} clearcoatRoughness={0.8} />
      </mesh>
      {/* Arroz */}
      <mesh castShadow position={[0, 0.015, 0]}>
        <cylinderGeometry args={[0.365, 0.365, 0.36, 40]} />
        <meshStandardMaterial color={COL.rice} roughness={0.55} />
      </mesh>
      {/* Núcleo de salmón */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.38, 28]} />
        <meshPhysicalMaterial
          color={COL.salmon}
          roughness={0.32}
          clearcoat={0.85}
          clearcoatRoughness={0.25}
          sheen={0.6}
          sheenColor={"#FFB08A"}
        />
      </mesh>
      {/* Lámina de salmón drapeada */}
      {topping ? (
        <mesh castShadow position={[0, 0.21, 0.02]} rotation={[-0.16, 0.4, 0]}>
          <cylinderGeometry args={[0.34, 0.36, 0.035, 34, 1, false, 0, Math.PI * 1.35]} />
          <meshPhysicalMaterial
            color={COL.salmonDeep}
            roughness={0.3}
            clearcoat={0.9}
            clearcoatRoughness={0.2}
            side={THREE.DoubleSide}
            sheen={0.8}
            sheenColor={"#FFC9A8"}
          />
        </mesh>
      ) : null}
      {/* Sésamo sobre el arroz */}
      <mesh position={[0.16, 0.2, 0.12]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <meshStandardMaterial color={COL.sesame} roughness={0.5} />
      </mesh>
      <mesh position={[-0.14, 0.2, -0.1]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color={COL.sesame} roughness={0.5} />
      </mesh>
    </group>
  );
}

/* ---------- Plato + guarniciones ---------- */
function Plate() {
  return (
    <group>
      {/* Plato cerámico */}
      <mesh receiveShadow castShadow>
        <cylinderGeometry args={[2.35, 2.05, 0.14, 72]} />
        <meshPhysicalMaterial color={COL.plate} roughness={0.28} metalness={0.35} clearcoat={0.6} />
      </mesh>
      {/* Aro dorado del plato */}
      <mesh position={[0, 0.035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.3, 0.022, 16, 96]} />
        <meshStandardMaterial color={COL.gold} metalness={1} roughness={0.22} />
      </mesh>
      {/* Plato pequeño de shoyu */}
      <group position={[1.7, 0.07, 1.35]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.34, 0.28, 0.09, 32]} />
          <meshPhysicalMaterial color={COL.plate} roughness={0.3} metalness={0.3} clearcoat={0.5} />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.27, 0.27, 0.02, 32]} />
          <meshPhysicalMaterial color={COL.soy} roughness={0.05} metalness={0.2} clearcoat={1} />
        </mesh>
      </group>
      {/* Wasabi */}
      <mesh castShadow position={[-1.75, 0.13, 1.15]} scale={[1, 1.25, 1]}>
        <sphereGeometry args={[0.16, 20, 18]} />
        <meshStandardMaterial color={COL.wasabi} roughness={0.7} />
      </mesh>
      {/* Jengibre */}
      <mesh castShadow position={[-1.95, 0.08, 1.6]} rotation={[0, 0.5, 0.12]} scale={[1, 0.35, 1]}>
        <cylinderGeometry args={[0.3, 0.3, 0.16, 26, 1, false, 0, Math.PI * 1.7]} />
        <meshStandardMaterial color={COL.ginger} roughness={0.55} side={THREE.DoubleSide} />
      </mesh>
      {/* Palillos */}
      <group position={[0.2, 0.16, 2.6]} rotation={[0, -0.5, 0]}>
        <mesh castShadow rotation={[Math.PI / 2, 0, 0]} position={[-0.09, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.028, 4.4, 12]} />
          <meshStandardMaterial color={COL.wood} roughness={0.55} />
        </mesh>
        <mesh castShadow rotation={[Math.PI / 2, 0, 0]} position={[0.09, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.028, 4.4, 12]} />
          <meshStandardMaterial color={COL.wood} roughness={0.55} />
        </mesh>
      </group>
    </group>
  );
}

/* ---------- Semillas flotantes ---------- */
function FloatingSeeds() {
  const group = useRef<THREE.Group>(null);
  const seeds: Array<{ pos: [number, number, number]; speed: number; phase: number; color: string }> = [];
  const palette = [COL.sesame, COL.gold, COL.aji, COL.salmon];
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    const radius = 2.9 + Math.sin(i * 7.3) * 0.7;
    seeds.push({
      pos: [Math.cos(angle) * radius, 0.3 + Math.sin(i * 3.1) * 1.1, Math.sin(angle) * radius],
      speed: 0.5 + (i % 5) * 0.14,
      phase: i * 1.7,
      color: palette[i % palette.length],
    });
  }
  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      const s = seeds[i];
      child.position.y = s.pos[1] + Math.sin(t * s.speed + s.phase) * 0.28;
      child.rotation.x = t * 0.4 + s.phase;
      child.rotation.z = t * 0.3 + s.phase;
    });
  });
  return (
    <group ref={group}>
      {seeds.map((s, i) => (
        <mesh key={i} position={s.pos}>
          <capsuleGeometry args={[0.028, 0.06, 4, 8]} />
          <meshStandardMaterial color={s.color} roughness={0.45} metalness={s.color === COL.gold ? 0.8 : 0} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Aro dorado tipo ensō detrás del plato ---------- */
function GoldHalo() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.06;
  });
  return (
    <mesh ref={ref} position={[0, 1.15, -2.4]} rotation={[0.32, 0, 0]}>
      <torusGeometry args={[2.75, 0.018, 12, 128]} />
      <meshStandardMaterial color={COL.gold} metalness={1} roughness={0.18} />
    </mesh>
  );
}

/* ---------- Composición completa con parallax ---------- */
function MakiScene() {
  const group = useRef<THREE.Group>(null);
  const haloGroup = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    smooth.current.x = THREE.MathUtils.lerp(smooth.current.x, pointer.current.x, delta * 2.2);
    smooth.current.y = THREE.MathUtils.lerp(smooth.current.y, pointer.current.y, delta * 2.2);

    if (group.current) {
      group.current.rotation.y += delta * 0.12;
      group.current.rotation.x = smooth.current.y * 0.06;
      group.current.position.y = 0.12 + Math.sin(t * 0.8) * 0.09;
      group.current.rotation.z = smooth.current.x * 0.03;
    }
    if (haloGroup.current) {
      haloGroup.current.rotation.y = smooth.current.x * 0.08;
    }
  });

  return (
    <>
      <ambientLight intensity={0.35} color="#FFF4E0" />
      <directionalLight position={[5, 7, 4]} intensity={1.7} color="#FFE9C2" />
      <spotLight position={[-6, 5, -5]} intensity={70} angle={0.7} penumbra={0.9} color={COL.gold} />
      <pointLight position={[-3.5, 1.6, 4.5]} intensity={12} color={COL.salmon} distance={9} />

      <group ref={haloGroup}>
        <GoldHalo />
      </group>

      <group ref={group}>
        <Plate />
        {/* Dos filas de makis */}
        <MakiPiece position={[-0.85, 0.24, 0.3]} rotation={0.3} topping />
        <MakiPiece position={[0, 0.24, 0.42]} rotation={-0.2} />
        <MakiPiece position={[0.85, 0.24, 0.3]} rotation={0.8} topping />
        <MakiPiece position={[-0.85, 0.24, -0.72]} rotation={-0.6} />
        <MakiPiece position={[0, 0.24, -0.6]} rotation={1.3} topping />
        <MakiPiece position={[0.85, 0.24, -0.72]} rotation={2.1} />
      </group>

      <FloatingSeeds />

      <ContactShadows position={[0, -0.02, 0]} opacity={0.65} scale={9} blur={2.6} far={3.2} color="#000000" />
    </>
  );
}

/* ---------- Error boundary con fallback visual ---------- */
class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    /* WebGL no disponible → fallback estático */
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function Maki3D({ fallbackImage }: { fallbackImage: string }) {
  return (
    <SceneBoundary
      fallback={
        <div className="flex h-full w-full items-center justify-center">
          {/* Fallback accesible si WebGL falla */}
          <img
            src={fallbackImage}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover opacity-80"
          />
        </div>
      }
    >
      <Canvas
        camera={{ position: [0.4, 2.9, 5.6], fov: 32 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
        aria-hidden="true"
      >
        <Suspense fallback={null}>
          <MakiScene />
        </Suspense>
      </Canvas>
    </SceneBoundary>
  );
}
