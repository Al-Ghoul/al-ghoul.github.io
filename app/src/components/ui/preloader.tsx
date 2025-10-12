import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import logoUrl from "../../assets/logo.svg?url";

export default function Preloader({ children, onComplete, minDisplayTime = 2000 }: {
  children: React.ReactNode,
  onComplete?: () => void,
  minDisplayTime?: number
}) {
  const isDev = import.meta.env.DEV;
  const [logoComplete, setLogoComplete] = useState(false);
  const [minTimeComplete, setMinTimeComplete] = useState(false);
  const [isVisible, setIsVisible] = useState(!isDev);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeComplete(true), minDisplayTime);
    return () => clearTimeout(timer);
  }, [minDisplayTime]);

    useEffect(() => {
    if (isVisible) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isVisible]);

  const canHide = logoComplete && minTimeComplete;

  useEffect(() => {
    if (canHide) {
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 300);
      return () => clearTimeout(hideTimer);
    }
  }, [canHide, onComplete]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            className="fixed inset-0 bg-white dark:bg-black flex flex-col justify-center items-center z-10"
            initial={{ opacity: 1 }}
            animate={{ opacity: canHide ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Logo onAnimationComplete={() => setLogoComplete(true)} logoUrl={logoUrl} duration={4} />

            <motion.div
              className="mt-8 flex gap-x-1"

              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isVisible && children}
    </>
  );
}

function Logo({ onAnimationComplete, strokeWidth = 0.1, className = "", duration = 2, logoUrl }:
  {
    onAnimationComplete?: () => void,
    strokeWidth?: number,
    className?: string,
    duration?: number,
    logoUrl: string
  }) {
  const [pathData, setPathData] = useState("");

  useEffect(() => {
    fetch(logoUrl)
      .then((res) => res.text())
      .then((svg) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svg, "image/svg+xml");
        const path = doc.querySelector("path");
        if (path) {
          setPathData(path.getAttribute("d") || "");
        }
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
            delay: 0.2,
          },
        }}
        onAnimationComplete={onAnimationComplete}
      />
    </motion.svg>
  );
}
