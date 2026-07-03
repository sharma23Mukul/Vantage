import { useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { BRAIN_REGIONS } from './brainRegionsData';
import { useHotspotsStore } from '../../features/hotspots/model/useHotspotsStore';

const ALL_CENTERS = BRAIN_REGIONS.map((r) => new THREE.Vector3(...r.position));

// ─── GLSL noise functions for procedural surface detail ───
const NOISE_GLSL = `
  float hash3(vec3 p) {
    p = fract(p * vec3(0.1031, 0.1030, 0.0973));
    p += dot(p, p.yxz + 33.33);
    return fract((p.x + p.y) * p.z);
  }

  float vnoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash3(i), hash3(i + vec3(1,0,0)), f.x),
          mix(hash3(i + vec3(0,1,0)), hash3(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash3(i + vec3(0,0,1)), hash3(i + vec3(1,0,1)), f.x),
          mix(hash3(i + vec3(0,1,1)), hash3(i + vec3(1,1,1)), f.x), f.y), f.z
    );
  }

  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * vnoise(p);
      p *= 2.1;
      a *= 0.5;
    }
    return v;
  }
`;

export function BrainModel() {
  const groupRef = useRef();
  const activeHotspot = useHotspotsStore((s) => s.activeHotspot);
  const clearActiveHotspot = useHotspotsStore((s) => s.clearActiveHotspot);

  const { nodes } = useGLTF('/models/Brain.glb');
  const geometry = nodes.brain1.geometry;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = -0.5 + Math.sin(t * 0.4) * 0.03;
    groupRef.current.rotation.y += 0.0008;
  });

  return (
    <group
      ref={groupRef}
      scale={0.024}
      rotation={[0, -Math.PI / 2, 0]}
      position={[0, -0.5, 0]}
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
    </group>
  );
}

/**
 * Injects Voronoi clipping + procedural surface detail into PBR shader.
 */
function injectVoronoiClipping(shader, region, otherCenters, extraFragCode = '') {
  shader.uniforms.myCenter = { value: new THREE.Vector3(...region.position) };
  shader.uniforms.otherCenter0 = { value: otherCenters[0] };
  shader.uniforms.otherCenter1 = { value: otherCenters[1] };
  shader.uniforms.otherCenter2 = { value: otherCenters[2] };
  shader.uniforms.otherCenter3 = { value: otherCenters[3] };

  // ── Vertex shader ──
  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `#include <common>
     varying vec3 vLocalPos;
     varying vec3 vWorldNormal;`
  );
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `#include <begin_vertex>
     vLocalPos = position;
     vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);`
  );

  // ── Fragment shader: uniforms + noise ──
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    `#include <common>
     uniform vec3 myCenter;
     uniform vec3 otherCenter0;
     uniform vec3 otherCenter1;
     uniform vec3 otherCenter2;
     uniform vec3 otherCenter3;
     varying vec3 vLocalPos;
     varying vec3 vWorldNormal;
     ${NOISE_GLSL}`
  );

  // ── Inject procedural color variation + visible veins ──
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <color_fragment>',
    `#include <color_fragment>
     // Base color variation — pinker near blood vessels, greyer elsewhere
     float colorVar = fbm(vLocalPos * 0.06);
     diffuseColor.rgb = mix(
       diffuseColor.rgb,
       diffuseColor.rgb * vec3(1.12, 0.85, 0.83),
       colorVar * 0.3
     );

     // ── Visible vein network ──
     // Large veins
     vec3 veinPos1 = vLocalPos * 0.08;
     float vein1 = fbm(veinPos1 + vec3(0.0, 100.0, 0.0));
     float veinLine1 = 1.0 - smoothstep(0.0, 0.06, abs(vein1 - 0.5));
     // Medium veins (higher frequency, offset)
     vec3 veinPos2 = vLocalPos * 0.18 + vec3(30.0, 0.0, 50.0);
     float vein2 = fbm(veinPos2);
     float veinLine2 = 1.0 - smoothstep(0.0, 0.08, abs(vein2 - 0.48));
     // Fine capillaries
     vec3 veinPos3 = vLocalPos * 0.35 + vec3(70.0, 20.0, 0.0);
     float vein3 = fbm(veinPos3);
     float veinLine3 = 1.0 - smoothstep(0.0, 0.10, abs(vein3 - 0.52));

     // Combine veins: large=dark, medium=medium, fine=subtle
     float totalVein = veinLine1 * 0.7 + veinLine2 * 0.4 + veinLine3 * 0.2;
     totalVein = clamp(totalVein, 0.0, 1.0);
     // Vein color: dark reddish-purple
     vec3 veinColor = diffuseColor.rgb * vec3(0.35, 0.18, 0.22);
     diffuseColor.rgb = mix(diffuseColor.rgb, veinColor, totalVein);
    `
  );

  // ── Inject procedural normal perturbation for wrinkly micro-texture ──
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <normal_fragment_maps>',
    `#include <normal_fragment_maps>
     // Procedural bump — wrinkly brain cortex micro-texture
     float bumpScale = 0.4;
     float eps = 0.3;
     vec3 samplePos = vLocalPos * 0.2;
     float dx = fbm(samplePos + vec3(eps, 0, 0)) - fbm(samplePos - vec3(eps, 0, 0));
     float dy = fbm(samplePos + vec3(0, eps, 0)) - fbm(samplePos - vec3(0, eps, 0));
     float dz = fbm(samplePos + vec3(0, 0, eps)) - fbm(samplePos - vec3(0, 0, eps));
     normal = normalize(normal + vec3(dx, dy, dz) * bumpScale);`
  );

  // ── Voronoi discard + fissure at the end ──
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <dithering_fragment>',
    `
     // Voronoi lobe clipping
     float myDist = distance(vLocalPos, myCenter);
     if (distance(vLocalPos, otherCenter0) < myDist) discard;
     if (distance(vLocalPos, otherCenter1) < myDist) discard;
     if (distance(vLocalPos, otherCenter2) < myDist) discard;
     if (distance(vLocalPos, otherCenter3) < myDist) discard;

     // Deep sulcus fissure between lobes
     float minOtherDist = min(
       min(distance(vLocalPos, otherCenter0), distance(vLocalPos, otherCenter1)),
       min(distance(vLocalPos, otherCenter2), distance(vLocalPos, otherCenter3))
     );
     float edgeDist = abs(myDist - minOtherDist);
     float sulcus = smoothstep(0.0, 14.0, edgeDist);
     // Deep dark reddish-brown sulcus
     vec3 sulcusColor = vec3(0.08, 0.02, 0.02);
     gl_FragColor.rgb = mix(sulcusColor, gl_FragColor.rgb, sulcus);

     ${extraFragCode}

     #include <dithering_fragment>
    `
  );
}

function BrainRegionMesh({ geometry, region, regionIndex, isActive, isOtherActive }) {
  const groupRef = useRef();
  const outerMatRef = useRef(null);
  const innerMatRef = useRef(null);

  const setActiveHotspot = useHotspotsStore((s) => s.setActiveHotspot);
  const clearActiveHotspot = useHotspotsStore((s) => s.clearActiveHotspot);

  const restPos = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const activePos = useMemo(() => new THREE.Vector3(...region.popDirection), [region]);

  const otherCenters = useMemo(
    () => ALL_CENTERS.filter((_, i) => i !== regionIndex),
    [regionIndex]
  );

  // ── Outer: Matte organic brain cortex (less shiny) ──
  const outerMat = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: region.color,
      roughness: 0.7,
      metalness: 0.0,
      clearcoat: 0.25,
      clearcoatRoughness: 0.5,
      emissive: new THREE.Color('#251010'),
      emissiveIntensity: 0.08,
      envMapIntensity: 0.4,
      side: THREE.FrontSide,
      transparent: true,
      depthWrite: true,
    });

    mat.customProgramCacheKey = () => `outer_${region.id}`;
    mat.onBeforeCompile = (shader) => {
      outerMatRef.current = shader;
      shader.uniforms.uOpacity = { value: 1.0 };
      shader.uniforms.uEmissiveBoost = { value: 0.0 };

      injectVoronoiClipping(shader, region, otherCenters, `
        gl_FragColor.a *= uOpacity;
        gl_FragColor.rgb += vec3(uEmissiveBoost * 0.06);
      `);

      shader.fragmentShader = shader.fragmentShader.replace(
        'uniform vec3 myCenter;',
        `uniform vec3 myCenter;
         uniform float uOpacity;
         uniform float uEmissiveBoost;`
      );
    };

    return mat;
  }, [region, otherCenters]);

  // ── Inner: Dark tissue interior (BackSide) ──
  const innerMat = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: region.innerColor,
      roughness: 0.8,
      metalness: 0.0,
      clearcoat: 0.1,
      clearcoatRoughness: 0.6,
      emissive: new THREE.Color('#1a0606'),
      emissiveIntensity: 0.15,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: true,
    });

    mat.customProgramCacheKey = () => `inner_${region.id}`;
    mat.onBeforeCompile = (shader) => {
      innerMatRef.current = shader;
      shader.uniforms.uInnerOpacity = { value: 1.0 };

      injectVoronoiClipping(shader, region, otherCenters, `
        gl_FragColor.a *= uInnerOpacity;
      `);

      shader.fragmentShader = shader.fragmentShader.replace(
        'uniform vec3 myCenter;',
        `uniform vec3 myCenter;
         uniform float uInnerOpacity;`
      );
    };

    return mat;
  }, [region, otherCenters]);

  // ── Core: Solid filled interior (slightly smaller FrontSide mesh) ──
  const coreMat = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(region.innerColor).offsetHSL(0, 0.05, 0.05),
      roughness: 0.9,
      metalness: 0.0,
      emissive: new THREE.Color('#180505'),
      emissiveIntensity: 0.12,
      side: THREE.FrontSide,
      transparent: true,
      depthWrite: true,
    });

    mat.customProgramCacheKey = () => `core_${region.id}`;
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uCoreOpacity = { value: 1.0 };

      injectVoronoiClipping(shader, region, otherCenters, `
        gl_FragColor.a *= uCoreOpacity;
      `);

      shader.fragmentShader = shader.fragmentShader.replace(
        'uniform vec3 myCenter;',
        `uniform vec3 myCenter;
         uniform float uCoreOpacity;`
      );
    };

    return mat;
  }, [region, otherCenters]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const t = delta * 3.0;

    const targetPos = isActive ? activePos : restPos;
    groupRef.current.position.lerp(targetPos, t);

    const targetScale = isActive ? 1.12 : 1.0;
    const s = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, t);
    groupRef.current.scale.setScalar(s);

    if (outerMatRef.current) {
      const targetOpacity = isActive ? 1.0 : isOtherActive ? 0.2 : 1.0;
      outerMatRef.current.uniforms.uOpacity.value = THREE.MathUtils.lerp(
        outerMatRef.current.uniforms.uOpacity.value, targetOpacity, t
      );
      const targetEmissive = isActive ? 1.0 : 0.0;
      outerMatRef.current.uniforms.uEmissiveBoost.value = THREE.MathUtils.lerp(
        outerMatRef.current.uniforms.uEmissiveBoost.value, targetEmissive, t
      );
    }

    if (innerMatRef.current) {
      const innerTarget = isOtherActive ? 0.2 : 1.0;
      innerMatRef.current.uniforms.uInnerOpacity.value = THREE.MathUtils.lerp(
        innerMatRef.current.uniforms.uInnerOpacity.value, innerTarget, t
      );
    }
  });

  const handleClick = useCallback((e) => {
    e.stopPropagation();
    if (isActive) clearActiveHotspot();
    else setActiveHotspot({
      id: region.id,
      title: region.name,
      biology: region.biology,
      skillTitle: region.skillTitle,
      description: region.skillDescription,
    });
  }, [isActive, region, setActiveHotspot, clearActiveHotspot]);

  return (
    <group ref={groupRef}>
      {/* Solid core fill (scaled down, fills the hollow interior) */}
      <mesh geometry={geometry} material={coreMat} scale={0.92} renderOrder={0} />
      {/* Inner shell (BackSide) */}
      <mesh geometry={geometry} material={innerMat} renderOrder={1} />
      {/* Outer cortex surface */}
      <mesh geometry={geometry} material={outerMat} onClick={handleClick} renderOrder={2} />
    </group>
  );
}

useGLTF.preload('/models/Brain.glb');
