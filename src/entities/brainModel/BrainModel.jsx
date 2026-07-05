import { useRef, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import { BRAIN_REGIONS } from './brainRegionsData';
import { useHotspotsStore } from '../../features/hotspots/model/useHotspotsStore';

const ALL_CENTERS = BRAIN_REGIONS.map((r) => new THREE.Vector3(...r.position));

// ─── Minimal GLSL: just noise for veins + wobble ───
const NOISE_GLSL = `
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

export function BrainModel() {
  const groupRef = useRef();
  const activeHotspot = useHotspotsStore((s) => s.activeHotspot);
  const clearActiveHotspot = useHotspotsStore((s) => s.clearActiveHotspot);

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

  // Extract the model's own textures — these have baked brain fold detail
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
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 0.4) * 0.03;
    groupRef.current.rotation.y += 0.0008;
  });

  if (!geometry) return null;

  return (
    <group
      ref={groupRef}
      position={[0, 0, 0]}
      onPointerMissed={() => clearActiveHotspot()}
    >
      <group scale={28} rotation={[-Math.PI / 2, 0, 0]}>
        <Center>
          {BRAIN_REGIONS.map((region, index) => (
            <BrainRegionMesh
              key={region.id}
              geometry={geometry}
              textures={textures}
              region={region}
              regionIndex={index}
              isActive={activeHotspot?.id === region.id}
              isOtherActive={activeHotspot !== null && activeHotspot?.id !== region.id}
            />
          ))}
        </Center>
      </group>
    </group>
  );
}

/**
 * Injects Voronoi clipping into a shader.
 * hasColor: if true, also injects flesh tinting + veins into the color pass.
 */
function injectShader(shader, region, otherCenters, hasColor) {
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
     ${hasColor ? NOISE_GLSL : ''}`
  );

  // ── Fragment: Re-tint the baked texture to realistic flesh + add veins ──
  if (hasColor) {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <color_fragment>',
      `#include <color_fragment>

       // The baked texture has colorful stylized regions.
       // Convert to luminance to preserve the fold/shadow detail,
       // then remap into a realistic flesh palette.
       float lum = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114));

       // Flesh gradient: dark blood-red in crevices → pinkish-tan on peaks
       vec3 fleshDark  = vec3(0.15, 0.02, 0.02);  // deep, very dark sulcus for prominent folds
       vec3 fleshMid   = vec3(0.72, 0.42, 0.38);  // mid-tone
       vec3 fleshLight = vec3(0.88, 0.62, 0.55);  // peak of gyrus

       vec3 fleshCol;
       if (lum < 0.45) {
         fleshCol = mix(fleshDark, fleshMid, smoothstep(0.05, 0.45, lum));
       } else {
         fleshCol = mix(fleshMid, fleshLight, smoothstep(0.45, 0.95, lum));
       }
       diffuseColor.rgb = fleshCol;

       // ── Visible vein network on outer surface ──
       vec3 vp = vLocalPos * 120.0;

       // Large arteries — thick, prominent
       float v1 = vfbm(vp * 0.4 + vec3(0.0, 80.0, 0.0));
       float vLine1 = 1.0 - smoothstep(0.0, 0.025, abs(v1 - 0.5));

       // Medium vessels — branching
       float v2 = vfbm(vp * 0.8 + vec3(25.0, 0.0, 40.0));
       float vLine2 = 1.0 - smoothstep(0.0, 0.035, abs(v2 - 0.48));

       // Fine capillaries — thin web
       float v3 = vfbm(vp * 1.6 + vec3(55.0, 15.0, 0.0));
       float vLine3 = 1.0 - smoothstep(0.0, 0.045, abs(v3 - 0.52));

       // Combine: arteries strongest, capillaries lightest
       float totalVein = vLine1 * 0.7 + vLine2 * 0.4 + vLine3 * 0.2;
       totalVein = clamp(totalVein, 0.0, 1.0);

       // Dark blood-red vein color
       vec3 veinCol = vec3(0.18, 0.02, 0.04);
       diffuseColor.rgb = mix(diffuseColor.rgb, veinCol, totalVein * 0.8);

       // ── Mottling for organic variation ──
       float mottle = vfbm(vp * 0.25 + 200.0);
       diffuseColor.rgb *= mix(0.9, 1.1, mottle);
      `
    );
  }

  // ── Fragment: Voronoi region clipping ──
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <dithering_fragment>',
    `
     // Organic wobble on boundary
     ${hasColor ? `
     vec3 wobble = vec3(
       vnoise(vLocalPos * 150.0),
       vnoise(vLocalPos * 150.0 + 10.0),
       vnoise(vLocalPos * 150.0 + 20.0)
     ) * 0.003;
     vec3 cellPos = vLocalPos + wobble;
     ` : `
     vec3 cellPos = vLocalPos;
     `}

     float myDist = distance(cellPos, myCenter);
     if (distance(cellPos, otherCenter0) < myDist) discard;
     if (distance(cellPos, otherCenter1) < myDist) discard;
     if (distance(cellPos, otherCenter2) < myDist) discard;
     if (distance(cellPos, otherCenter3) < myDist) discard;

     // Thin dark fissure at region boundaries
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
  geometry, textures, region, regionIndex, isActive, isOtherActive
}) {
  const groupRef = useRef();
  const outerShaderRef = useRef(null);

  const setActiveHotspot = useHotspotsStore((s) => s.setActiveHotspot);
  const clearActiveHotspot = useHotspotsStore((s) => s.clearActiveHotspot);

  const restPos = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const activePos = useMemo(() => new THREE.Vector3(...region.popDirection), [region]);
  const otherCenters = useMemo(() => ALL_CENTERS.filter((_, i) => i !== regionIndex), [regionIndex]);

  // ── Outer material: matte organic flesh — NO glass/shine ──
  const outerMat = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: '#d4978e',
      roughness: 0.85,         // Very rough — raw tissue
      metalness: 0.0,
      emissive: new THREE.Color('#1a0606'),
      emissiveIntensity: 0.08,
      envMapIntensity: 0.15,   // Barely any env reflection
      side: THREE.FrontSide,
      transparent: true,
      depthWrite: true,
    });

    // Apply the model's baked textures
    if (textures.map) mat.map = textures.map;
    if (textures.normalMap) {
      mat.normalMap = textures.normalMap;
      mat.normalScale = new THREE.Vector2(3.5, 3.5); // drastically boost for prominent fold depth
    }
    if (textures.roughnessMap) mat.roughnessMap = textures.roughnessMap;

    mat.customProgramCacheKey = () => `outer_${region.id}`;
    mat.onBeforeCompile = (shader) => {
      outerShaderRef.current = shader;
      injectShader(shader, region, otherCenters, true);
    };
    mat.needsUpdate = true;

    return mat;
  }, [region, otherCenters, textures]);

  // ── Inner: dark tissue on BackSide ──
  const innerMat = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: region.innerColor,
      roughness: 0.85,
      emissive: new THREE.Color('#140505'),
      emissiveIntensity: 0.1,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: true,
    });

    mat.customProgramCacheKey = () => `inner_${region.id}`;
    mat.onBeforeCompile = (shader) => {
      injectShader(shader, region, otherCenters, false);
    };

    return mat;
  }, [region, otherCenters]);

  // ── Core: solid fill (slightly smaller) ──
  const coreMat = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(region.innerColor).offsetHSL(0, 0.02, 0.04),
      roughness: 0.92,
      emissive: new THREE.Color('#100404'),
      emissiveIntensity: 0.08,
      side: THREE.FrontSide,
      transparent: true,
      depthWrite: true,
    });

    mat.customProgramCacheKey = () => `core_${region.id}`;
    mat.onBeforeCompile = (shader) => {
      injectShader(shader, region, otherCenters, false);
    };

    return mat;
  }, [region, otherCenters]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const t = delta * 3.0;

    groupRef.current.position.lerp(isActive ? activePos : restPos, t);

    const ts = isActive ? 1.1 : 1.0;
    const s = THREE.MathUtils.lerp(groupRef.current.scale.x, ts, t);
    groupRef.current.scale.setScalar(s);

    if (outerShaderRef.current) {
      const targetOp = isActive ? 1.0 : isOtherActive ? 0.2 : 1.0;
      outerShaderRef.current.uniforms.uOpacity.value = THREE.MathUtils.lerp(
        outerShaderRef.current.uniforms.uOpacity.value, targetOp, t
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
      <mesh geometry={geometry} material={coreMat} scale={0.92} renderOrder={0} />
      <mesh geometry={geometry} material={innerMat} renderOrder={1} />
      <mesh geometry={geometry} material={outerMat} onClick={handleClick} renderOrder={2} />
    </group>
  );
}

useGLTF.preload('/models/stylizedbrain/scene.gltf');
