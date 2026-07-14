import { useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import { BRAIN_REGIONS } from './brainRegionsData';
import { useHotspotsStore } from '../../features/hotspots/model/useHotspotsStore';
import { useReducedMotion } from '../../shared/hooks';

const ALL_CENTERS = BRAIN_REGIONS.map((r) => new THREE.Vector3(...r.position));

// ─── GLSL noise — full quality (shaderQuality >= 2) ───
const NOISE_GLSL_FULL = `
  float vhash(vec3 p) {
    p = fract(p * vec3(0.1031, 0.1030, 0.0973));
    p += dot(p, p.yxz + 33.33);
    return fract((p.x + p.y) * p.z);
  }
  float vnoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(vhash(i), vhash(i+vec3(1,0,0)), f.x),
          mix(vhash(i+vec3(0,1,0)), vhash(i+vec3(1,1,0)), f.x), f.y),
      mix(mix(vhash(i+vec3(0,0,1)), vhash(i+vec3(1,0,1)), f.x),
          mix(vhash(i+vec3(0,1,1)), vhash(i+vec3(1,1,1)), f.x), f.y), f.z
    );
  }
  float vfbm(vec3 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * vnoise(p); p *= 2.1; a *= 0.5; }
    return v;
  }
`;

// ─── GLSL noise — reduced quality (shaderQuality == 1) — 2 octaves, no veins ───
const NOISE_GLSL_REDUCED = `
  float vhash(vec3 p) {
    p = fract(p * vec3(0.1031, 0.1030, 0.0973));
    p += dot(p, p.yxz + 33.33);
    return fract((p.x + p.y) * p.z);
  }
  float vnoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(vhash(i), vhash(i+vec3(1,0,0)), f.x),
          mix(vhash(i+vec3(0,1,0)), vhash(i+vec3(1,1,0)), f.x), f.y),
      mix(mix(vhash(i+vec3(0,0,1)), vhash(i+vec3(1,0,1)), f.x),
          mix(vhash(i+vec3(0,1,1)), vhash(i+vec3(1,1,1)), f.x), f.y), f.z
    );
  }
  float vfbm(vec3 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 2; i++) { v += a * vnoise(p); p *= 2.1; a *= 0.5; }
    return v;
  }
`;

/**
 * Pre-splits a BufferGeometry into per-region geometries using Voronoi assignment.
 * Each vertex is assigned to its closest region center — zero fragment discard needed.
 */
function splitGeometryByRegion(geometry) {
  const posAttr = geometry.getAttribute('position');
  const normalAttr = geometry.getAttribute('normal');
  const uvAttr = geometry.getAttribute('uv');
  const indexAttr = geometry.getIndex();
  const vertCount = posAttr.count;

  // Assign each vertex to its closest region
  const vertexRegion = new Uint8Array(vertCount);
  const tempPos = new THREE.Vector3();

  for (let i = 0; i < vertCount; i++) {
    tempPos.set(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
    let minDist = Infinity;
    let closest = 0;
    for (let r = 0; r < ALL_CENTERS.length; r++) {
      const d = tempPos.distanceTo(ALL_CENTERS[r]);
      if (d < minDist) {
        minDist = d;
        closest = r;
      }
    }
    vertexRegion[i] = closest;
  }

  // Build per-region face lists (using indexed or non-indexed)
  const regionFaces = BRAIN_REGIONS.map(() => []);

  if (indexAttr) {
    const indices = indexAttr.array;
    for (let f = 0; f < indices.length; f += 3) {
      const a = indices[f], b = indices[f + 1], c = indices[f + 2];
      // Majority vote — assign face to whichever region owns 2+ vertices
      const rA = vertexRegion[a], rB = vertexRegion[b], rC = vertexRegion[c];
      const winner = (rA === rB || rA === rC) ? rA : rB;
      regionFaces[winner].push(a, b, c);
    }
  } else {
    for (let f = 0; f < vertCount; f += 3) {
      const rA = vertexRegion[f], rB = vertexRegion[f + 1], rC = vertexRegion[f + 2];
      const winner = (rA === rB || rA === rC) ? rA : rB;
      regionFaces[winner].push(f, f + 1, f + 2);
    }
  }

  // Build per-region BufferGeometry from shared vertex data + region-specific indices
  return regionFaces.map((faces) => {
    if (faces.length === 0) return geometry; // fallback

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', posAttr);
    if (normalAttr) geo.setAttribute('normal', normalAttr);
    if (uvAttr) geo.setAttribute('uv', uvAttr);
    geo.setIndex(faces);
    return geo;
  });
}

export function BrainModel({ tierConfig }) {
  const groupRef = useRef();
  const activeHotspot = useHotspotsStore((s) => s.activeHotspot);
  const clearActiveHotspot = useHotspotsStore((s) => s.clearActiveHotspot);
  const setActiveHotspot = useHotspotsStore((s) => s.setActiveHotspot);
  const prefersReducedMotion = useReducedMotion();

  const shaderQuality = tierConfig?.shaderQuality ?? 2;
  const materialLayers = tierConfig?.materialLayers ?? 3;

  const { nodes, materials } = useGLTF('/models/stylizedbrain/scene.gltf');

  // Find the mesh node
  const brainMesh = useMemo(() => {
    let mesh = null;
    const root = nodes['Sketchfab_model'];
    if (root) root.traverse((child) => { if (child.isMesh) mesh = child; });
    if (!mesh) {
      const key = Object.keys(nodes).find((k) => nodes[k].isMesh);
      if (key) mesh = nodes[key];
    }
    return mesh;
  }, [nodes]);

  const geometry = brainMesh?.geometry;

  // Pre-split geometry by region (Phase 3 — eliminates per-fragment Voronoi discard)
  const regionGeometries = useMemo(() => {
    if (!geometry) return null;
    return splitGeometryByRegion(geometry);
  }, [geometry]);

  // Extract the model's own textures
  const textures = useMemo(() => {
    const mat = brainMesh?.material;
    const fallbackKey = Object.keys(materials || {})[0];
    const fallbackMat = fallbackKey ? materials[fallbackKey] : null;
    return {
      map: mat?.map || fallbackMat?.map || null,
      normalMap: mat?.normalMap || fallbackMat?.normalMap || null,
      roughnessMap: mat?.roughnessMap || fallbackMat?.roughnessMap || null,
    };
  }, [brainMesh, materials]);

  useFrame((state) => {
    if (!groupRef.current) return;
    if (prefersReducedMotion) return; // Respect OS reduced motion setting
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 0.4) * 0.03;
    groupRef.current.rotation.y += 0.0008;
  });

  const handleBrainClick = useCallback((e) => {
    e.stopPropagation();

    const point = e.point.clone();
    e.object.worldToLocal(point);

    let closestRegion = null;
    let minDist = Infinity;

    BRAIN_REGIONS.forEach((region) => {
      const center = new THREE.Vector3(...region.position);
      const dist = point.distanceTo(center);
      if (dist < minDist) {
        minDist = dist;
        closestRegion = region;
      }
    });

    if (closestRegion) {
      if (activeHotspot?.id === closestRegion.id) {
        clearActiveHotspot();
      } else {
        setActiveHotspot({
          id: closestRegion.id,
          title: closestRegion.name,
          biology: closestRegion.biology,
          skillTitle: closestRegion.skillTitle,
          description: closestRegion.skillDescription,
        });
      }
    }
  }, [activeHotspot, clearActiveHotspot, setActiveHotspot]);

  if (!geometry || !regionGeometries) return null;

  return (
    <group
      ref={groupRef}
      position={[0, 0, 0]}
      onPointerMissed={() => clearActiveHotspot()}
    >
      <group scale={28} rotation={[-Math.PI / 2, 0, 0]} onClick={handleBrainClick} onPointerOver={() => { document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = 'auto'; }}>
        <Center>
          {BRAIN_REGIONS.map((region, index) => (
            <BrainRegionMesh
              key={region.id}
              geometry={regionGeometries[index]}
              textures={textures}
              region={region}
              regionIndex={index}
              isActive={activeHotspot?.id === region.id}
              isOtherActive={activeHotspot !== null && activeHotspot?.id !== region.id}
              shaderQuality={shaderQuality}
              materialLayers={materialLayers}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </Center>
      </group>
    </group>
  );
}

/**
 * Injects region clipping and optional flesh tinting into a shader.
 * shaderQuality: 0 = flat, 1 = reduced FBM, 2 = full FBM + veins + mottling
 */
function injectShader(shader, region, otherCenters, hasColor, shaderQuality) {
  shader.uniforms.myCenter = { value: new THREE.Vector3(...region.position) };
  shader.uniforms.otherCenter0 = { value: otherCenters[0] };
  shader.uniforms.otherCenter1 = { value: otherCenters[1] };
  shader.uniforms.otherCenter2 = { value: otherCenters[2] };
  shader.uniforms.otherCenter3 = { value: otherCenters[3] };
  shader.uniforms.uOpacity = { value: 1.0 };

  // ── Vertex: pass model-space position ──
  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `#include <common>
     varying vec3 vLocalPos;`
  );
  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `#include <begin_vertex>
     vLocalPos = position;`
  );

  // Choose noise GLSL based on quality
  const noiseGLSL = shaderQuality >= 2
    ? NOISE_GLSL_FULL
    : shaderQuality === 1
      ? NOISE_GLSL_REDUCED
      : ''; // quality 0 = no noise at all

  // ── Fragment: uniforms + noise ──
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    `#include <common>
     uniform vec3 myCenter;
     uniform vec3 otherCenter0;
     uniform vec3 otherCenter1;
     uniform vec3 otherCenter2;
     uniform vec3 otherCenter3;
     uniform float uOpacity;
     varying vec3 vLocalPos;
     ${hasColor ? noiseGLSL : ''}`
  );

  // ── Fragment: Color pass — tier-adaptive ──
  if (hasColor && shaderQuality >= 1) {
    // Flesh re-tinting (medium + high)
    let colorCode = `#include <color_fragment>

       float lum = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114));

       vec3 fleshDark  = vec3(0.15, 0.02, 0.02);
       vec3 fleshMid   = vec3(0.72, 0.42, 0.38);
       vec3 fleshLight = vec3(0.88, 0.62, 0.55);

       vec3 fleshCol;
       if (lum < 0.45) {
         fleshCol = mix(fleshDark, fleshMid, smoothstep(0.05, 0.45, lum));
       } else {
         fleshCol = mix(fleshMid, fleshLight, smoothstep(0.45, 0.95, lum));
       }
       diffuseColor.rgb = fleshCol;`;

    // Veins + mottling — only on high quality
    if (shaderQuality >= 2) {
      colorCode += `

       // Visible vein network
       vec3 vp = vLocalPos * 120.0;

       float v1 = vfbm(vp * 0.4 + vec3(0.0, 80.0, 0.0));
       float vLine1 = 1.0 - smoothstep(0.0, 0.025, abs(v1 - 0.5));

       float v2 = vfbm(vp * 0.8 + vec3(25.0, 0.0, 40.0));
       float vLine2 = 1.0 - smoothstep(0.0, 0.035, abs(v2 - 0.48));

       float v3 = vfbm(vp * 1.6 + vec3(55.0, 15.0, 0.0));
       float vLine3 = 1.0 - smoothstep(0.0, 0.045, abs(v3 - 0.52));

       float totalVein = vLine1 * 0.7 + vLine2 * 0.4 + vLine3 * 0.2;
       totalVein = clamp(totalVein, 0.0, 1.0);

       vec3 veinCol = vec3(0.18, 0.02, 0.04);
       diffuseColor.rgb = mix(diffuseColor.rgb, veinCol, totalVein * 0.8);

       float mottle = vfbm(vp * 0.25 + 200.0);
       diffuseColor.rgb *= mix(0.9, 1.1, mottle);`;
    }

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <color_fragment>',
      colorCode
    );
  }

  // ── Fragment: Boundary edge shading (replaces Voronoi discard on pre-split geometry) ──
  const wobbleCode = (hasColor && shaderQuality >= 2)
    ? `vec3 wobble = vec3(
        vnoise(vLocalPos * 150.0),
        vnoise(vLocalPos * 150.0 + 10.0),
        vnoise(vLocalPos * 150.0 + 20.0)
       ) * 0.003;
       vec3 cellPos = vLocalPos + wobble;`
    : `vec3 cellPos = vLocalPos;`;

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <dithering_fragment>',
    `
     ${wobbleCode}

     // Boundary fissure darkening (no discard — geometry is pre-split)
     float myDist = distance(cellPos, myCenter);
     float minOD = min(
       min(distance(cellPos, otherCenter0), distance(cellPos, otherCenter1)),
       min(distance(cellPos, otherCenter2), distance(cellPos, otherCenter3))
     );
     float edgeDist = abs(myDist - minOD);
     float sulcus = smoothstep(0.0, 0.002, edgeDist);
     gl_FragColor.rgb = mix(vec3(0.12, 0.02, 0.02), gl_FragColor.rgb, sulcus);

     gl_FragColor.a *= uOpacity;

     #include <dithering_fragment>
    `
  );
}

function BrainRegionMesh({
  geometry, textures, region, regionIndex, isActive, isOtherActive,
  shaderQuality, materialLayers, prefersReducedMotion,
}) {
  const groupRef = useRef();
  const outerShaderRef = useRef(null);

  const restPos = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const activePos = useMemo(() => new THREE.Vector3(...region.popDirection), [region]);
  const otherCenters = useMemo(() => ALL_CENTERS.filter((_, i) => i !== regionIndex), [regionIndex]);

  // ── Outer material: matte organic flesh ──
  const outerMat = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: '#d4978e',
      roughness: 0.85,
      metalness: 0.0,
      emissive: new THREE.Color('#1a0606'),
      emissiveIntensity: 0.08,
      envMapIntensity: 0.15,
      side: THREE.FrontSide,
      transparent: true,
      depthWrite: true,
    });

    if (textures.map) mat.map = textures.map;
    if (textures.normalMap) {
      mat.normalMap = textures.normalMap;
      mat.normalScale = new THREE.Vector2(3.5, 3.5);
    }
    if (textures.roughnessMap) mat.roughnessMap = textures.roughnessMap;

    mat.customProgramCacheKey = () => `outer_${region.id}_q${shaderQuality}`;
    mat.onBeforeCompile = (shader) => {
      outerShaderRef.current = shader;
      injectShader(shader, region, otherCenters, true, shaderQuality);
    };
    mat.needsUpdate = true;

    return mat;
  }, [region, otherCenters, textures, shaderQuality]);

  // ── Inner: dark tissue on BackSide (medium + high only) ──
  const innerMat = useMemo(() => {
    if (materialLayers < 3) return null;

    const mat = new THREE.MeshPhysicalMaterial({
      color: region.innerColor,
      roughness: 0.85,
      emissive: new THREE.Color('#140505'),
      emissiveIntensity: 0.1,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: true,
    });

    mat.customProgramCacheKey = () => `inner_${region.id}_q${shaderQuality}`;
    mat.onBeforeCompile = (shader) => {
      injectShader(shader, region, otherCenters, false, shaderQuality);
    };

    return mat;
  }, [region, otherCenters, materialLayers, shaderQuality]);

  // ── Core: solid fill — slightly smaller (medium + high only) ──
  const coreMat = useMemo(() => {
    if (materialLayers < 2) return null;

    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(region.innerColor).offsetHSL(0, 0.02, 0.04),
      roughness: 0.92,
      emissive: new THREE.Color('#100404'),
      emissiveIntensity: 0.08,
      side: THREE.FrontSide,
      transparent: true,
      depthWrite: true,
    });

    mat.customProgramCacheKey = () => `core_${region.id}_q${shaderQuality}`;
    mat.onBeforeCompile = (shader) => {
      injectShader(shader, region, otherCenters, false, shaderQuality);
    };

    return mat;
  }, [region, otherCenters, materialLayers, shaderQuality]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (prefersReducedMotion) {
      // Snap to target instantly, no animation
      groupRef.current.position.copy(isActive ? activePos : restPos);
      groupRef.current.scale.setScalar(isActive ? 1.1 : 1.0);
    } else {
      const t = delta * 3.0;
      groupRef.current.position.lerp(isActive ? activePos : restPos, t);
      const ts = isActive ? 1.1 : 1.0;
      const s = THREE.MathUtils.lerp(groupRef.current.scale.x, ts, t);
      groupRef.current.scale.setScalar(s);
    }

    if (outerShaderRef.current) {
      const targetOp = isActive ? 1.0 : isOtherActive ? 0.2 : 1.0;
      const t = prefersReducedMotion ? 1.0 : delta * 3.0;
      outerShaderRef.current.uniforms.uOpacity.value = THREE.MathUtils.lerp(
        outerShaderRef.current.uniforms.uOpacity.value, targetOp, t
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Core layer — medium + high (materialLayers >= 2) */}
      {coreMat && <mesh geometry={geometry} material={coreMat} scale={0.92} renderOrder={0} />}

      {/* Inner layer — high only (materialLayers >= 3) */}
      {innerMat && <mesh geometry={geometry} material={innerMat} renderOrder={1} />}

      {/* Outer layer — always present */}
      <mesh geometry={geometry} material={outerMat} renderOrder={2} />
    </group>
  );
}

useGLTF.preload('/models/stylizedbrain/scene.gltf');
