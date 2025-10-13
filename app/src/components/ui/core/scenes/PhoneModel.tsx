import React, { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { VideoEntry } from "./MobileAppShowcase";

interface PhoneModelProps {
  activeVideoSrc: string;
  videosMapRef: React.MutableRefObject<Record<string, VideoEntry> | null>;
}

export default function PhoneModel({ activeVideoSrc, videosMapRef }: PhoneModelProps) {
  const { scene } = useGLTF("/redmi-note-14.glb");
  const phoneRef = useRef<THREE.Object3D | null>(null);
  const shaderMatRef = useRef<THREE.ShaderMaterial | null>(null);
  const [glitchTimer, setGlitchTimer] = useState(0);

  // Setup shader material
  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mesh = child as THREE.Mesh;

        // Handle material being single or an array
        const materials: THREE.Material[] = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];

        // Check if any material matches your target
        if (!materials.some((mat) => mat.name === "Material.002")) return;

        const geometry = mesh.geometry;
        const uv = geometry.attributes.uv;
        if (uv) {
          const uvArray = uv.array;
          let minU = Infinity, maxU = -Infinity, minV = Infinity, maxV = -Infinity;

          for (let i = 0; i < uvArray.length; i += 2) {
            const u = uvArray[i], v = uvArray[i + 1];
            minU = Math.min(minU, u);
            maxU = Math.max(maxU, u);
            minV = Math.min(minV, v);
            maxV = Math.max(maxV, v);
          }

          for (let i = 0; i < uvArray.length; i += 2) {
            uvArray[i] = (uvArray[i] - minU) / (maxU - minU);
            uvArray[i + 1] = (uvArray[i + 1] - minV) / (maxV - minV);
          }
          uv.needsUpdate = true;
        }

        geometry.computeBoundingBox();
        const box = geometry.boundingBox!;
        const screenWidth = box.max.x - box.min.x;
        const screenHeight = box.max.y - box.min.y;
        const screenAspect = screenWidth / screenHeight;

        const placeholderTex = new THREE.Texture();
        const shaderMaterial = new THREE.ShaderMaterial({
          uniforms: {
            videoTex: { value: placeholderTex },
            screenAspect: { value: screenAspect },
            videoAspect: { value: 1 },
            edgeInsetX: { value: -0.1405 },
            glitchTime: { value: 0 },
            glitchAmount: { value: 0 },
          },
          vertexShader: `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform sampler2D videoTex;
            uniform float videoAspect;
            uniform float screenAspect;
            uniform float edgeInsetX;
            uniform float glitchTime;
            uniform float glitchAmount;
            varying vec2 vUv;

            // Preserve scaling
            vec2 scaleUV(vec2 uv, float aspect, float screenAspect){
                float scaleX = 1.0, scaleY = 1.0;
                vec2 offset = vec2(0.0);
                if(aspect > screenAspect){
                    scaleX = screenAspect / aspect;
                    offset.x = 0.5*(1.0 - scaleX);
                } else {
                    scaleY = aspect / screenAspect;
                    offset.y = 0.5*(1.0 - scaleY);
                }
                uv = uv * vec2(scaleX, scaleY) + offset;
                uv.x = uv.x * (1.0 - 2.0 * edgeInsetX) + edgeInsetX;
                return uv;
            }

            void main(){
                vec2 uv = scaleUV(vUv, videoAspect, screenAspect);

                // Strong RGB offsets
                float maxShift = 0.05 * glitchAmount;
                float rShift = maxShift * sin(uv.y * 80.0 + glitchTime * 30.0);
                float gShift = maxShift * cos(uv.y * 60.0 + glitchTime * 25.0);
                float bShift = maxShift * sin(uv.y * 100.0 + glitchTime * 40.0);

                // Vertical slices
                float slice = floor(mod(glitchTime * 10.0 + uv.y * 20.0, 5.0));
                float sliceShift = slice / 100.0 * glitchAmount;

                vec4 r = texture2D(videoTex, clamp(uv + vec2(rShift + sliceShift,0.0), 0.0, 1.0));
                vec4 g = texture2D(videoTex, clamp(uv + vec2(gShift + sliceShift,0.0), 0.0, 1.0));
                vec4 b = texture2D(videoTex, clamp(uv + vec2(bShift + sliceShift,0.0), 0.0, 1.0));

                gl_FragColor = vec4(r.r, g.g, b.b, 1.0);
            }
          `,
          side: THREE.DoubleSide,
        });

        child.material = shaderMaterial;
        child.material.needsUpdate = true;
        shaderMatRef.current = shaderMaterial;
      }
    });
  }, [scene]);

  // Update video texture on switch and trigger glitch
  useEffect(() => {
    const shader = shaderMatRef.current;
    const map = videosMapRef.current;
    if (!shader || !map) return;

    const entry = map[activeVideoSrc];
    if (!entry) return;

    shader.uniforms.videoTex.value = entry.tex;
    shader.uniforms.videoAspect.value = entry.el.videoWidth / entry.el.videoHeight || 1;

    if (!entry.el.videoWidth) {
      const onMeta = () => {
        shader.uniforms.videoAspect.value = entry.el.videoWidth / entry.el.videoHeight;
        entry.el.removeEventListener("loadedmetadata", onMeta);
      };
      entry.el.addEventListener("loadedmetadata", onMeta);
    }

    // trigger glitch effect
    setGlitchTimer(0.0); // start timer
  }, [activeVideoSrc, videosMapRef]);

  // Animate phone and glitch
  useFrame((state, delta) => {
    if (phoneRef.current) {
      const t = state.clock.elapsedTime;

      // Up/down floating
      phoneRef.current.position.y = Math.sin(t * 0.5) * 0.3;

      // Y-axis wiggle (gentle rotation)
      phoneRef.current.rotation.y = Math.sin(t * 0.2) * 0.1;

      // Cinematic X/Z tilt
      phoneRef.current.rotation.x = -0.15 + Math.sin(t * 0.3) * 0.03; // slight forward tilt + subtle oscillation
      phoneRef.current.rotation.z = 0.05 + Math.sin(t * 0.4) * 0.02;  // subtle side tilt
    }

    if (shaderMatRef.current) {
      // glitch effect
      let tGlitch = glitchTimer + delta;
      if (tGlitch > 0.5) tGlitch = 0.5;
      shaderMatRef.current.uniforms.glitchTime.value = state.clock.elapsedTime;
      shaderMatRef.current.uniforms.glitchAmount.value = 1.0 - tGlitch / 0.5;
      setGlitchTimer(tGlitch);
    }
  });

  return <primitive ref={phoneRef} object={scene} scale={[1, 1, 1]} position={[0, 0, -2]} />;
}
