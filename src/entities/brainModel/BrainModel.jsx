import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { BRAIN_REGIONS } from './brainRegionsData';
import { useHotspotsStore } from '../../features/hotspots/model/useHotspotsStore';
import { NeuralParticles } from './NeuralParticles';

const ALL_CENTERS = BRAIN_REGIONS.map((r) => new THREE.Vector3(...r.position));

export function BrainModel() {
  const groupRef = useRef();
  const activeHotspot = useHotspotsStore((s) => s.activeHotspot);
  const clearActiveHotspot = useHotspotsStore((s) => s.clearActiveHotspot);

  const { nodes } = useGLTF('/models/Brain.glb');
  const geometry = nodes.brain1.geometry;

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

      <NeuralParticles count={60} radius={150} />
    </group>
  );
}

function BrainRegionMesh({ geometry, region, regionIndex, isActive, isOtherActive }) {
  const groupRef = useRef();
  const meshRef = useRef();
  const innerRef = useRef();
  const wireRef = useRef();
  
  const setActiveHotspot = useHotspotsStore((s) => s.setActiveHotspot);
  const clearActiveHotspot = useHotspotsStore((s) => s.clearActiveHotspot);

  const restPos = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const activePos = useMemo(() => new THREE.Vector3(...region.popDirection), [region]);

  const otherCenters = useMemo(() => {
    return ALL_CENTERS.filter((_, i) => i !== regionIndex);
  }, [regionIndex]);

  // Common uniforms for Voronoi clipping
  const commonUniforms = useMemo(() => ({
    myCenter: { value: new THREE.Vector3(...region.position) },
    otherCenter0: { value: otherCenters[0] },
    otherCenter1: { value: otherCenters[1] },
    otherCenter2: { value: otherCenters[2] },
    otherCenter3: { value: otherCenters[3] },
  }), [region, otherCenters]);

  // Outer shell shader (FrontSide)
  const shaderMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        ...commonUniforms,
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
        varying vec3 vLocalPos;
        varying vec3 vNormal;

        void main() {
          float myDist = distance(vLocalPos, myCenter);
          if (distance(vLocalPos, otherCenter0) < myDist) discard;
          if (distance(vLocalPos, otherCenter1) < myDist) discard;
          if (distance(vLocalPos, otherCenter2) < myDist) discard;
          if (distance(vLocalPos, otherCenter3) < myDist) discard;

          vec3 viewDir = vec3(0.0, 0.0, 1.0);
          float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.5);
          vec3 color = baseColor * (0.6 + uEmissive * 0.6) + baseColor * fresnel * 0.4;

          float minOtherDist = min(
            min(distance(vLocalPos, otherCenter0), distance(vLocalPos, otherCenter1)),
            min(distance(vLocalPos, otherCenter2), distance(vLocalPos, otherCenter3))
          );
          float edgeDist = abs(myDist - minOtherDist);
          float edgeLine = smoothstep(0.0, 3.0, edgeDist);

          gl_FragColor = vec4(color, uOpacity * edgeLine);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.FrontSide, // Only render the outside surface
    });
  }, [commonUniforms, region.color]);

  // Inner cross-section shader (BackSide)
  // This renders the *inside* of the hollow mesh as a solid, flat color.
  // This creates the illusion of a solid volumetric cross-section when clipped.
  const innerMat = useMemo(() => {
    // Make the inside color a darker, richer version of the region color
    const innerColor = new THREE.Color(region.color).multiplyScalar(0.25);
    
    return new THREE.ShaderMaterial({
      uniforms: {
        ...commonUniforms,
        innerColor: { value: innerColor },
        uOpacity: { value: 0.9 }, // High opacity to look solid
      },
      vertexShader: `
        varying vec3 vLocalPos;
        void main() {
          vLocalPos = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 myCenter;
        uniform vec3 otherCenter0;
        uniform vec3 otherCenter1;
        uniform vec3 otherCenter2;
        uniform vec3 otherCenter3;
        uniform vec3 innerColor;
        uniform float uOpacity;
        varying vec3 vLocalPos;

        void main() {
          float myDist = distance(vLocalPos, myCenter);
          if (distance(vLocalPos, otherCenter0) < myDist) discard;
          if (distance(vLocalPos, otherCenter1) < myDist) discard;
          if (distance(vLocalPos, otherCenter2) < myDist) discard;
          if (distance(vLocalPos, otherCenter3) < myDist) discard;

          // Flat shading for the cross-section core to look solid
          gl_FragColor = vec4(innerColor, uOpacity);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.BackSide, // Only render the INSIDE back-faces
    });
  }, [commonUniforms, region.color]);

  const wireMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: region.color,
    wireframe: true,
    transparent: true,
    opacity: 0.06,
    depthWrite: false,
  }), [region.color]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = delta * 3.5;

    shaderMat.uniforms.uTime.value = state.clock.elapsedTime;

    const targetPos = isActive ? activePos : restPos;
    groupRef.current.position.lerp(targetPos, t);

    const targetScale = isActive ? 1.12 : 1.0;
    const s = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, t);
    groupRef.current.scale.setScalar(s);

    const targetOpacity = isActive ? 0.7 : isOtherActive ? 0.1 : 0.35;
    shaderMat.uniforms.uOpacity.value = THREE.MathUtils.lerp(
      shaderMat.uniforms.uOpacity.value, targetOpacity, t
    );
    
    // Fade inner cross-section slightly if another region is active
    const innerTargetOpacity = isOtherActive ? 0.2 : 0.9;
    innerMat.uniforms.uOpacity.value = THREE.MathUtils.lerp(
      innerMat.uniforms.uOpacity.value, innerTargetOpacity, t
    );

    const targetEmissive = isActive ? 0.8 : 0.0;
    shaderMat.uniforms.uEmissive.value = THREE.MathUtils.lerp(
      shaderMat.uniforms.uEmissive.value, targetEmissive, t
    );

    if (wireRef.current) {
      const targetWire = isActive ? 0.15 : isOtherActive ? 0.02 : 0.06;
      wireRef.current.material.opacity = THREE.MathUtils.lerp(
        wireRef.current.material.opacity, targetWire, t
      );
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (isActive) clearActiveHotspot();
    else setActiveHotspot({
      id: region.id,
      title: region.name,
      biology: region.biology,
      skillTitle: region.skillTitle,
      description: region.skillDescription,
    });
  };

  return (
    <group ref={groupRef}>
      {/* 1. Inner Cross-Section (renders backfaces of the hollow shell as a solid color) */}
      <mesh
        ref={innerRef}
        geometry={geometry}
        material={innerMat}
        renderOrder={1}
      />
      {/* 2. Outer Transparent Shell */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={shaderMat}
        onClick={handleClick}
        renderOrder={2}
      />
      {/* 3. Wireframe Overlay */}
      <mesh
        ref={wireRef}
        geometry={geometry}
        material={wireMat}
        renderOrder={3}
      />
    </group>
  );
}

useGLTF.preload('/models/Brain.glb');
