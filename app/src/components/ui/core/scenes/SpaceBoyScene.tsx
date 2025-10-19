import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";

useGLTF.preload("/space_boy_scene.glb");

function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;

    if (size.width < 1024) {
      cam.fov = 125;
      cam.position.set(-0.1, 0.6, 3.2);
      cam.lookAt(1.2, 0.25, 0.2);
    } else {
      cam.fov = 75;
      cam.position.set(-0.02, 0.45, 2.32);
      cam.lookAt(1.51, 0.30, 0.30);
    }

    cam.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}


export default function SpaceBoyScene() {
  return (
    <Canvas className="w-full h-full">
      <Scene />
    </Canvas>
  );
}

function Scene() {
  const { scene, animations } = useGLTF(
    "/space_boy_scene.glb"
  );
  const mixer = useRef<THREE.AnimationMixer | null>(null);

  useEffect(() => {
    mixer.current = new THREE.AnimationMixer(scene);
    animations.forEach((clip) => {
      const action = mixer.current?.clipAction(clip);
      action?.reset().play();
    });
    return () => {
      mixer.current?.stopAllAction();
    };
  }, [animations, scene]);

  useFrame((_state, delta) => {
    mixer.current?.update(delta);
  });

  return (
    <>
      <primitive object={scene} />

      <spotLight
        position={[-0.2, 0, 2.3]}
        angle={0.5}
        penumbra={0.3}
        intensity={20}
        castShadow
        color="#ff9044"
      />

      <directionalLight intensity={0.5} />

      <EffectComposer>
        <Bloom
          intensity={1.5}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>

      <ResponsiveCamera />
    </>
  );
}
