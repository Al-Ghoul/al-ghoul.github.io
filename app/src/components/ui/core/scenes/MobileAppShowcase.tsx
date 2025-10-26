import React, { useRef, useState, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { motion, useAnimation } from "motion/react";
import * as THREE from "three";
import { a, useSpring } from "@react-spring/three";

import { PROJECTS } from "@lib/data";
import PhoneModel from "./PhoneModel";
import Sidebar from "./Sidebar";
import Loader from "./Loader";

export type VideoEntry = {
  el: HTMLVideoElement;
  tex: THREE.VideoTexture;
};

interface Props {
  locale?: string;
};

export default function MobileAppShowcase({ locale = "ar" }: Props) {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState(PROJECTS[0].videos[0].src);
  const videosMapRef = useRef<Record<string, VideoEntry> | null>(null);
  const overlayControls = useAnimation();
  const switchLockRef = useRef(false);
  const [transitioning, setTransitioning] = useState(false);
  const [flipDirection, setFlipDirection] = useState<1 | -1>(1);
  const [isInteracting, setIsInteracting] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const TEXT_DIRECTION = locale === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    const el = document.getElementById("projects-section");
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const visible = entry.isIntersecting;
          setIsRevealed(visible);

          const map = videosMapRef.current;
          if (!map) return;

          Object.values(map).forEach(({ el }) => {
            if (visible) {
              if (el.src.includes(activeVideo)) el.play().catch(() => { });
            } else {
              el.pause();
            }
          });
        });
      },
      { threshold: 0.7 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [activeVideo]);

  // Initialize video elements and textures
  useEffect(() => {
    const sources = Array.from(new Set(PROJECTS.flatMap(p => p.videos.map(v => v.src))));
    const map: Record<string, VideoEntry> = {};

    sources.forEach(src => {
      const el = document.createElement("video");
      el.src = src;
      el.crossOrigin = "anonymous";
      el.loop = true;
      el.muted = true;
      el.playsInline = true;
      el.preload = "auto";
      el.style.display = "none";
      document.body.appendChild(el);

      const tex = new THREE.VideoTexture(el);
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.format = THREE.RGBAFormat;
      tex.generateMipmaps = false;

      map[src] = { el, tex };
      el.load();
    });

    videosMapRef.current = map;
    if (isRevealed) {
      map[activeVideo]?.el.play().catch(() => { });
    }

    return () => {
      Object.values(map).forEach(({ el, tex }) => {
        el.pause();
        if (el.parentElement) el.parentElement.removeChild(el);
        tex.dispose();
      });
    };
    // # it MUST NOT run on every render, only once (or it'll break the video player)
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  // Center the phone section in viewport
  const centerPhone = useCallback(() => {
    const sectionEl = document.querySelector("#projects-section") as HTMLElement | null;
    if (!sectionEl) return;

    sectionEl.scrollIntoView({ behavior: "smooth", block: "center" });

    // Lock scroll after centering
    setTimeout(() => {
      document.body.style.overflow = "hidden";
    }, 600);
  }, [isRevealed]);

  // Switch video within same project (crossfade)
  const switchVideo = useCallback((nextSrc: string) => {
    if (nextSrc === activeVideo || !videosMapRef.current || switchLockRef.current) return;

    switchLockRef.current = true;

    const map = videosMapRef.current;

    // Pause current video
    // map[activeVideo]?.el.pause();

    // Update active video
    setActiveVideo(nextSrc);

    // Play next video
    const nextVideo = map[nextSrc];
    if (nextVideo && isRevealed) {
      nextVideo.el.currentTime = 0;
      nextVideo.el.play().catch(() => { });
    }

    setTimeout(() => {
      switchLockRef.current = false;
    }, 400);
  }, [activeVideo, isRevealed]);

  // Switch project with animation
  const switchProject = useCallback(async (nextIndex: number) => {
    if (nextIndex === activeProjectIndex || !videosMapRef.current || switchLockRef.current) return;
    if (nextIndex < 0 || nextIndex >= PROJECTS.length) return;

    switchLockRef.current = true;

    const map = videosMapRef.current;
    map[activeVideo]?.el.pause();

    const nextVid = PROJECTS[nextIndex].videos[0].src;

    if (isRevealed) {
      map[nextVid].el.currentTime = 0;
      map[nextVid].el.play().catch(() => { });
    }

    setFlipDirection(nextIndex > activeProjectIndex ? 1 : -1);
    setTransitioning(true);

    await new Promise(r => setTimeout(r, 300));
    setActiveProjectIndex(nextIndex);
    setActiveVideo(nextVid);

    await new Promise(r => setTimeout(r, 300));
    setTransitioning(false);
    switchLockRef.current = false;
  }, [activeProjectIndex, activeVideo, isRevealed]);

  const isAtBoundary = useCallback(() => {
    const curProject = PROJECTS[activeProjectIndex];
    const curIndex = curProject.videos.findIndex(v => v.src === activeVideo);

    const atTop = activeProjectIndex === 0 && curIndex === 0;
    const atBottom =
      activeProjectIndex === PROJECTS.length - 1 &&
      curIndex === curProject.videos.length - 1;

    return { atTop, atBottom };
  }, [activeProjectIndex, activeVideo]);

  // Desktop: Wheel scroll handling
  useEffect(() => {
    const canvasEl = document.getElementById("mobile-canvas");
    if (!canvasEl) return;

    // Check if touch is supported (mobile/tablet)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return; // Skip wheel handling on touch devices

    let scrollTimeout: NodeJS.Timeout | null = null;

    const onWheel = (e: WheelEvent) => {
      if (!isInteracting || switchLockRef.current) return;

      const delta = e.deltaY;
      if (Math.abs(delta) < 40) return;

      const { atTop, atBottom } = isAtBoundary();
      const direction: 1 | -1 = delta > 0 ? 1 : -1;

      // Check if we should allow page scroll
      if ((atTop && direction === -1) || (atBottom && direction === 1)) {
        // At boundary and trying to scroll beyond - unlock and allow page scroll
        document.body.style.overflow = "";
        return;
      }

      // Not at boundary - prevent scroll and handle navigation
      e.preventDefault();
      e.stopPropagation();

      // Re-lock scroll when navigating
      document.body.style.overflow = "hidden";

      const curProject = PROJECTS[activeProjectIndex];
      const curIndex = curProject.videos.findIndex(v => v.src === activeVideo);
      const nextIndex = curIndex + direction;

      if (nextIndex >= 0 && nextIndex < curProject.videos.length) {
        switchVideo(curProject.videos[nextIndex].src);
      } else if (direction === 1 && activeProjectIndex < PROJECTS.length - 1) {
        switchProject(activeProjectIndex + 1);
      } else if (direction === -1 && activeProjectIndex > 0) {
        switchProject(activeProjectIndex - 1);
      }

      // Keep scroll locked for a bit after navigation
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (!isInteracting) {
          document.body.style.overflow = "";
        }
      }, 500);
    };

    canvasEl.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      canvasEl.removeEventListener("wheel", onWheel);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [activeProjectIndex, activeVideo, isInteracting, switchVideo, switchProject, isAtBoundary]);

  // Mobile: Touch gesture handling
  useEffect(() => {
    const canvasEl = document.getElementById("mobile-canvas");
    if (!canvasEl) return;

    // Check if touch is supported
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice) return; // Skip touch handling on non-touch devices

    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let isSwiping = false;
    const minSwipeDistance = 50;
    const tapTimeThreshold = 200; // ms for distinguishing tap from swipe

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
      touchStartTime = Date.now();
      isSwiping = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;

      const touchCurrentX = e.touches[0].clientX;
      const touchCurrentY = e.touches[0].clientY;
      const diffX = Math.abs(touchStartX - touchCurrentX);
      const diffY = Math.abs(touchStartY - touchCurrentY);

      // If user is swiping horizontally or vertically with intent, mark as swiping
      if (diffX > 10 || diffY > 10) {
        isSwiping = true;
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      const touchEndX = t.clientX;
      const touchEndY = t.clientY;
      const touchEndTime = Date.now();
      const touchDuration = touchEndTime - touchStartTime;

      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;
      const absDiffX = Math.abs(diffX);
      const absDiffY = Math.abs(diffY);

      // Check if it's a tap (short duration, minimal movement)
      if (!isSwiping && touchDuration < tapTimeThreshold && absDiffX < 10 && absDiffY < 10) {
        // It's a tap - center the phone
        centerPhone();
        return;
      }

      // It's a swipe - handle navigation
      if (absDiffX > absDiffY && absDiffX >= minSwipeDistance) {
        // HORIZONTAL SWIPE = Change video (left/right)
        const curProject = PROJECTS[activeProjectIndex];
        const curIndex = curProject.videos.findIndex(v => v.src === activeVideo);
        const direction: 1 | -1 = diffX > 0 ? 1 : -1;
        const nextIndex = curIndex + direction;

        if (nextIndex >= 0 && nextIndex < curProject.videos.length) {
          switchVideo(curProject.videos[nextIndex].src);
          centerPhone();
        } else {
          // At end of videos, cycle to next/prev video in same project
          if (direction === 1 && curIndex === curProject.videos.length - 1) {
            // At last video, go to first
            switchVideo(curProject.videos[0].src);
            centerPhone();
          } else if (direction === -1 && curIndex === 0) {
            // At first video, go to last
            switchVideo(curProject.videos[curProject.videos.length - 1].src);
            centerPhone();
          }
        }
      } else if (absDiffY >= minSwipeDistance) {
        // VERTICAL SWIPE = Change project (up/down)
        const direction: 1 | -1 = diffY > 0 ? 1 : -1;
        let nextIndex = activeProjectIndex + direction;

        // Cycle through projects
        if (nextIndex < 0) {
          nextIndex = PROJECTS.length - 1; // Go to last project
        } else if (nextIndex >= PROJECTS.length) {
          nextIndex = 0; // Go to first project
        }

        switchProject(nextIndex);
        centerPhone();
      }

      isSwiping = false;
    };

    canvasEl.addEventListener("touchstart", onTouchStart, { passive: true });
    canvasEl.addEventListener("touchmove", onTouchMove, { passive: true });
    canvasEl.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      canvasEl.removeEventListener("touchstart", onTouchStart);
      canvasEl.removeEventListener("touchmove", onTouchMove);
      canvasEl.removeEventListener("touchend", onTouchEnd);
    };
  }, [activeProjectIndex, activeVideo, switchVideo, switchProject, centerPhone]);

  // Desktop: Pointer enter/leave handling
  useEffect(() => {
    const canvasEl = document.getElementById("mobile-canvas");
    if (!canvasEl) return;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) return;

    const onPointerEnter = () => {
      setIsInteracting(true);
      centerPhone();
    };

    const onPointerLeave = () => {
      if (!transitioning && !switchLockRef.current) {
        setIsInteracting(false);
        document.body.style.overflow = "";
      }
    };

    canvasEl.addEventListener("pointerenter", onPointerEnter);
    canvasEl.addEventListener("pointerleave", onPointerLeave);

    return () => {
      canvasEl.removeEventListener("pointerenter", onPointerEnter);
      canvasEl.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [transitioning, centerPhone]);

  // Track video progress
  useEffect(() => {
    const map = videosMapRef.current;
    if (!map) return;

    const currentVideoEl = map[activeVideo]?.el;
    if (!currentVideoEl) return;

    const updateProgress = () => {
      if (currentVideoEl.duration) {
        const progress = (currentVideoEl.currentTime / currentVideoEl.duration) * 100;
        setVideoProgress(progress);
      }
    };

    // Update immediately
    updateProgress();

    // Update more frequently for smoother animation
    const interval = setInterval(updateProgress, 50);
    currentVideoEl.addEventListener('timeupdate', updateProgress);

    return () => {
      clearInterval(interval);
      currentVideoEl.removeEventListener('timeupdate', updateProgress);
    };
  }, [activeVideo]);

  const togglePlayPause = () => {
    const map = videosMapRef.current;
    if (!map) return;

    const cur = map[activeVideo];
    if (!cur) return;

    if (cur.el.paused) {
      cur.el.play().catch(() => { });
    } else {
      cur.el.pause();
    }
  };

  const handleSelectVideo = (src: string) => switchVideo(src);
  const handleSelectProject = (idx: number) => switchProject(idx);

  const activeProject = PROJECTS[activeProjectIndex];

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      const canvas = document.getElementById("mobile-canvas");
      if (!canvas) return;

      if (!canvas.contains(e.target as Node)) {
        document.body.style.overflow = "";
      }
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    return () => document.removeEventListener("touchstart", onTouchStart);
  }, []);

  return (
    <div id="projects-section" className="relative h-screen w-full">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          projects={PROJECTS}
          activeProjectIndex={activeProjectIndex}
          activeVideo={activeVideo}
          onSelectProject={handleSelectProject}
          onSelectVideo={handleSelectVideo}
        />
      </div>

      {/* Mobile Indicator */}
      <div className="md:hidden">
        <MobileIndicator
          projects={PROJECTS}
          activeProjectIndex={activeProjectIndex}
          activeVideo={activeVideo}
        />
      </div>

      {/* Mobile Instructions */}
      <div className="absolute bottom-4 left-4 text-white/70 text-sm z-40 md:hidden pointer-events-none">
        {locale == "ar" ? "إسحب لليسار أو اليمين لتبديل مقاطع الفيديو • مرر لأعلى أو لأسفل لتبديل المشاريع" : "Swipe left/right to cycle videos • Swipe up/down to cycle projects"}
      </div>

      {/* Desktop Instructions */}
      <div className="absolute bottom-4 left-4 rtl:right-1/5 text-white/70 text-sm z-40 hidden md:block pointer-events-none" dir={TEXT_DIRECTION}>
        {locale == "ar" ? "مرر الفأرة فوق الهاتف و قم باستخدام عجلة التمرير لتبديل المزايا • أو إستخدم الشريط الجانبي" : "Hover & scroll to navigate • Use sidebar to select features"}
      </div>

      {/* Transition Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={overlayControls}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 50,
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.06) 0%, rgba(255,0,0,0.3) 10%, rgba(0,255,255,0.4) 50%)",
          mixBlendMode: "screen",
          filter: "blur(6px) saturate(180%)"
        }}
      />

      {/* 3D Canvas */}
      <div className="absolute inset-0 z-10 pointer-events-auto px-4">
        <Canvas
          id="mobile-canvas"
          camera={{ position: [0, 0, 5], fov: 45 }}
          shadows
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <React.Suspense fallback={<Loader />}>
            <PhoneWrapper
              activeVideoSrc={activeVideo}
              videosMapRef={videosMapRef}
              direction={flipDirection}
              transitioning={transitioning}
              revealed={isRevealed}
            />
          </React.Suspense>
          <Environment preset="studio" />
        </Canvas>
      </div>

      {/* Project Info */}
      <div className="absolute top-20 left-4 text-white z-10 max-w-md pointer-events-none">
        <h1 className="text-2xl font-bold mb-1">{activeProject.title}</h1>
        <p className="text-gray-300 text-sm mb-3">{activeProject.description}</p>

        {/* Video progress bar */}
        <div className="mb-3 bg-white/10 rounded-full h-1 overflow-hidden backdrop-blur-sm">
          <div
            className="h-full bg-blue-500 transition-none"
            style={{ width: `${videoProgress}%` }}
          />
        </div>

        <div className="flex gap-2 pointer-events-auto">
          <button
            onClick={togglePlayPause}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white text-sm transition-colors"
          >
            Play / Pause
          </button>
        </div>
      </div>
    </div>
  );

}

interface PhoneWrapperProps {
  activeVideoSrc: string;
  videosMapRef: React.MutableRefObject<Record<string, VideoEntry> | null>;
  transitioning: boolean;
  direction: 1 | -1;
  revealed: boolean;
}

function PhoneWrapper({
  activeVideoSrc,
  videosMapRef,
  transitioning,
  direction,
  revealed,
}: PhoneWrapperProps) {
  const TARGETS = {
    // Normal on-screen targets (when revealed)
    onScreen: {
      rotationX: transitioning
        ? Math.PI / 2 * direction + Math.sin(Date.now() / 500) * 0.05
        : 0,
      rotationY: transitioning
        ? Math.PI / 8 * direction + Math.sin(Date.now() / 600) * 0.02
        : 0,
      positionY: transitioning ? 2 * direction : 0,
      positionZ: transitioning ? 5 : 0,
      scaleY: transitioning ? 1.05 : 1,
      scaleZ: transitioning ? 0.95 : 1,
    },
    // Hidden / off-screen targets (before reveal)
    offScreen: {
      rotationX: 0,
      rotationY: 0,
      positionY: -6,  // off the bottom of the viewport (comes up)
      positionZ: 8,   // a bit further away so the entry feels deeper
      scaleY: 1,
      scaleZ: 1,
    },
  };

  const target = revealed ? TARGETS.onScreen : TARGETS.offScreen;

  const { rotationX, rotationY, positionY, positionZ, scaleY, scaleZ } = useSpring({
    rotationX: target.rotationX,
    rotationY: target.rotationY,
    positionY: target.positionY,
    positionZ: target.positionZ,
    scaleY: target.scaleY,
    scaleZ: target.scaleZ,
    config: { mass: 1, tension: 280, friction: 35 },
  });

  return (
    <a.group
      rotation-x={rotationX}
      rotation-y={rotationY}
      position-y={positionY}
      position-z={positionZ}
      scale-y={scaleY}
      scale-z={scaleZ}
    >
      <PhoneModel activeVideoSrc={activeVideoSrc} videosMapRef={videosMapRef} />
    </a.group>
  );
}

const MobileIndicator = ({ projects, activeProjectIndex, activeVideo }:
  { projects: typeof PROJECTS; activeProjectIndex: number; activeVideo: string; }) => {
  const activeProject = projects[activeProjectIndex];
  const activeVideoIndex = activeProject.videos.findIndex(v => v.src === activeVideo);

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2">
      {/* Project dots */}
      <div className="flex gap-2">
        {projects.map((_, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 rounded-full transition-all ${idx === activeProjectIndex
              ? "bg-white w-6"
              : "bg-white/30"
              }`}
          />
        ))}
      </div>

      {/* Video dots for active project */}
      {activeProject.videos.length > 1 && (
        <div className="flex gap-1.5">
          {activeProject.videos.map((_, idx) => (
            <div
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-all ${idx === activeVideoIndex
                ? "bg-purple-400 w-4"
                : "bg-white/20"
                }`}
            />
          ))}
        </div>
      )}

      {/* Project name */}
      <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
        <p className="text-white text-xs font-medium">{activeProject.title}</p>
      </div>
    </div>
  );
};
