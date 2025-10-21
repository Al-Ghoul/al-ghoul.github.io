import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useProgress } from "@react-three/drei";
import logoUrl from "../../assets/logo.svg?url";

export default function Preloader({
  children,
  minDisplayTime = 2000,
  onComplete,
}: {
  children: React.ReactNode;
  minDisplayTime?: number;
  onComplete?: () => void;
}) {
  const { progress } = useProgress();
  const [logoComplete, setLogoComplete] = useState(false);
  const [minTimeComplete, setMinTimeComplete] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [childrenReady, setChildrenReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeComplete(true), minDisplayTime);
    return () => clearTimeout(timer);
  }, [minDisplayTime]);

  useEffect(() => {
    document.body.style.overflow = isVisible ? "hidden" : "auto";
  }, [isVisible]);

  const canHide = logoComplete && minTimeComplete && progress >= 100;

  useEffect(() => {
    if (canHide) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setChildrenReady(true);
        document.body.style.overflow = "auto";
        onComplete?.();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [canHide, onComplete]);

  useEffect(() => {
    const blocker = document.getElementById("initial-blocker");
    if (blocker) blocker.style.display = "none";
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            className="fixed inset-0 z-[9999] flex flex-col justify-center items-center bg-white dark:bg-black"
            initial={{ opacity: 1 }}
            animate={{ opacity: canHide ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Logo
              logoUrl={logoUrl}
              duration={Math.max(progress / 40, 1)}
              onAnimationComplete={() => setLogoComplete(true)}
            />

            <motion.div
              className="relative w-48 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gray-400 via-gray-800 to-gray-500 dark:from-gray-400 dark:via-gray-800 dark:to-gray-400 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{
                  ease: [0.65, 0, 0.35, 1],
                  duration: 0.5,
                }}
              />

              {/* Shimmer overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "linear",
                }}
              />
            </motion.div>

            <motion.div
              className="mt-4 text-sm text-gray-500 dark:text-gray-400 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              {Math.round(progress)}%
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {childrenReady
        ? children
        : null}
    </>
  );
}
function Logo({
  onAnimationComplete,
  strokeWidth = 0.1,
  className = "",
  duration = 2,
  logoUrl,
}: {
  onAnimationComplete?: () => void;
  strokeWidth?: number;
  className?: string;
  duration?: number;
  logoUrl: string;
}) {
  const [pathData, setPathData] = useState("");

  useEffect(() => {
    fetch(logoUrl)
      .then((res) => res.text())
      .then((svg) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svg, "image/svg+xml");
        const path = doc.querySelector("path");
        if (path) setPathData(path.getAttribute("d") || "");
      });
  }, [logoUrl]);

  if (!pathData) return null;

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 67 17"
      className={`w-48 h-24 ${className}`}
    >
      <motion.path
        d={pathData}
        className="stroke-black dark:stroke-white"
        strokeWidth={strokeWidth}
        fill="transparent"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: {
            duration,
            ease: "circIn",
          },
        }}
        onAnimationComplete={onAnimationComplete}
      />
    </motion.svg>
  );
}
