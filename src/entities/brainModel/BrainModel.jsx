import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { BRAIN_REGIONS } from './brainRegionsData';
import { useHotspotsStore } from '../../features/hotspots/model/useHotspotsStore';
import { NeuralParticles } from './NeuralParticles';

// Collect all region center positions as a flat array for the shader
const ALL_CENTERS = BRAIN_REGIONS.map((r) => new THREE.Vector3(...r.position));

export function BrainModel() {
  const groupRef = useRef();
  const activeHotspot = useHotspotsStore((s) => s.activeHotspot);
  const clearActiveHotspot = useHotspotsStore((s) => s.clearActiveHotspot);

  const { nodes } = useGLTF('/models/Brain.glb');
  const geometry = nodes.brain1.geometry;

  // Gentle floating
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 0.4) * 0.04;
    groupRef.current.rotation.y += 0.001;
  });

  return (
    <group
      ref={groupRef}
      scale={0.012}
      onPointerMissed={() => clearActiveHotspot()}
    >
      {/* Each region is a Voronoi-partitioned slice of the brain */}
      {BRAIN_REGIONS.map((region, index) => (
        <BrainRegionMesh
          key={region.id}
          geometry={geometry}
          region={region}
          regionIndex={index}
          isActive={activeHotspot?.id === region.id}
          isOtherActive={activeHotspot !== null && activeHotspot?.id !== region.id}
        />
      ))}

      {/* Tiny ambient particles */}
      <NeuralParticles count={60} radius={150} />
    </group>
  );
}

/**
 * One brain lobe. Uses a Voronoi shader to show ONLY the part of the brain
 * surface that is closest to this region's center. Every pixel on the brain
 * belongs to exactly one region — no gaps, no overlap, clear boundaries.
 */
function BrainRegionMesh({ geometry, region, regionIndex, isActive, isOtherActive }) {
  const meshRef = useRef();
  const wireRef = useRef();
  const setActiveHotspot = useHotspotsStore((s) => s.setActiveHotspot);
  const clearActiveHotspot = useHotspotsStore((s) => s.clearActiveHotspot);

  const restPos = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const activePos = useMemo(() => new THREE.Vector3(...region.popDirection), [region]);

  // Build "other centers" array (the 4 centers that are NOT this region)
  const otherCenters = useMemo(() => {
    return ALL_CENTERS.filter((_, i) => i !== regionIndex);
  }, [regionIndex]);

  const shaderMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        myCenter: { value: new THREE.Vector3(...region.position) },
        otherCenter0: { value: otherCenters[0] },
        otherCenter1: { value: otherCenters[1] },
        otherCenter2: { value: otherCenters[2] },
        otherCenter3: { value: otherCenters[3] },
        baseColor: { value: new THREE.Color(region.color) },
        uOpacity: { value: 0.35 },
        uEmissive: { value: 0.0 },
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec3 vLocalPos;
        varying vec3 vNormal;
        void main() {
          vLocalPos = position;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 myCenter;
        uniform vec3 otherCenter0;
        uniform vec3 otherCenter1;
        uniform vec3 otherCenter2;
        uniform vec3 otherCenter3;
        uniform vec3 baseColor;
        uniform float uOpacity;
        uniform float uEmissive;
        uniform float uTime;
        varying vec3 vLocalPos;
        varying vec3 vNormal;

        void main() {
          float myDist = distance(vLocalPos, myCenter);

          // Voronoi: discard if ANY other center is closer
          if (distance(vLocalPos, otherCenter0) < myDist) discard;
          if (distance(vLocalPos, otherCenter1) < myDist) discard;
          if (distance(vLocalPos, otherCenter2) < myDist) discard;
          if (distance(vLocalPos, otherCenter3) < myDist) discard;

          // Boundary darkening — darken pixels near the Voronoi edge
          float minOtherDist = min(
            min(distance(vLocalPos, otherCenter0), distance(vLocalPos, otherCenter1)),
            min(distance(vLocalPos, otherCenter2), distance(vLocalPos, otherCenter3))
          );
          float edgeDist = abs(myDist - minOtherDist);
          float edgeFactor = smoothstep(0.0, 8.0, edgeDist);

          // Fresnel edge highlight
          vec3 viewDir = vec3(0.0, 0.0, 1.0);
          float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.5);

          // Final color
          vec3 color = baseColor * (0.6 + uEmissive * 0.6) + baseColor * fresnel * 0.4;

          // Dark edge line between regions
          float edgeLine = smoothstep(0.0, 3.0, edgeDist);

          float finalOpacity = uOpacity * edgeLine;
          gl_FragColor = vec4(color, finalOpacity);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }, [region, otherCenters]);

  // Wireframe material matching region color
  const wireMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: region.color,
    wireframe: true,
    transparent: true,
    opacity: 0.06,
    depthWrite: false,
  }), [region.color]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const t = delta * 3.5;

    shaderMat.uniforms.uTime.value = state.clock.elapsedTime;

    // Pop out position
    const targetPos = isActive ? activePos : restPos;
    meshRef.current.position.lerp(targetPos, t);
    if (wireRef.current) wireRef.current.position.lerp(targetPos, t);

    // Scale up when active
    const targetScale = isActive ? 1.12 : 1.0;
    const s = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, t);
    meshRef.current.scale.setScalar(s);
    if (wireRef.current) wireRef.current.scale.setScalar(s);

    // Opacity
    const targetOpacity = isActive ? 0.7 : isOtherActive ? 0.1 : 0.35;
    shaderMat.uniforms.uOpacity.value = THREE.MathUtils.lerp(
      shaderMat.uniforms.uOpacity.value, targetOpacity, t
    );

    // Emissive glow when active
    const targetEmissive = isActive ? 0.8 : 0.0;
    shaderMat.uniforms.uEmissive.value = THREE.MathUtils.lerp(
      shaderMat.uniforms.uEmissive.value, targetEmissive, t
    );

    // Wireframe opacity
    if (wireRef.current) {
      const targetWire = isActive ? 0.15 : isOtherActive ? 0.02 : 0.06;
      wireRef.current.material.opacity = THREE.MathUtils.lerp(
        wireRef.current.material.opacity, targetWire, t
      );
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (isActive) {
      clearActiveHotspot();
    } else {
      setActiveHotspot({
        id: region.id,
        title: region.name,
        biology: region.biology,
        skillTitle: region.skillTitle,
        description: region.skillDescription,
      });
    }
  };

  return (
    <group>
      {/* Solid colored region */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={shaderMat}
        onClick={handleClick}
      />
      {/* Wireframe overlay for texture */}
      <mesh
        ref={wireRef}
        geometry={geometry}
        material={wireMat}
      />
    </group>
  );
}

useGLTF.preload('/models/Brain.glb');
