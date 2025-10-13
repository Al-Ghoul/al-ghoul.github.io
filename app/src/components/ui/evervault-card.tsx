import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useMotionTemplate } from "motion/react";
import { cn } from "@lib/utils";

interface EvervaultCardProps {
  text?: string;
  className?: string;
  children?: React.ReactNode;
}

export function EvervaultCard({ text, className, children }: EvervaultCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [randomString, setRandomString] = useState("");

  useEffect(() => {
    setRandomString(generateRandomString(1500));
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
    setRandomString(generateRandomString(1500));
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className={cn(
        "relative w-full h-auto rounded-3xl overflow-hidden group/card",
        className
      )}
    >
      {/* Content first */}
      <div className="relative z-10 rounded-3xl bg-white/10 dark:bg-black/10 border border-black/[0.1] dark:border-white/[0.1] backdrop-blur-md p-4">
        {text && (
          <div className="relative mx-auto mb-4 flex h-44 w-44 items-center justify-center rounded-full font-bold text-4xl">
            <div className="absolute inset-0 rounded-full bg-white/80 dark:bg-black/80 blur-sm" />
            <span className="relative z-10 text-black dark:text-white">
              {text}
            </span>
          </div>
        )}
        {children}
      </div>

      {/* Gradient overlay ABOVE the content layer */}
      <CardPattern
        mouseX={mouseX}
        mouseY={mouseY}
        randomString={randomString}
      />
    </div>
  );
}

interface CardPatternProps {
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  randomString: string;
}

export function CardPattern({ mouseX, mouseY, randomString }: CardPatternProps) {
  const maskImage = useMotionTemplate`radial-gradient(250px at ${mouseX}px ${mouseY}px, white, transparent)`;
  const style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <motion.div
      style={style}
      className="pointer-events-none absolute inset-0 z-20 rounded-3xl bg-gradient-to-r from-emerald-500/40 to-blue-600/40 opacity-0 group-hover/card:opacity-40 transition duration-500"
    >
      <p className="absolute inset-x-0 h-full break-words whitespace-pre-wrap text-[10px] font-mono font-bold text-white/40 p-2 leading-tight">
        {randomString}
      </p>
    </motion.div>
  );
}


const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
export function generateRandomString(length: number): string {
  return Array.from({ length }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join("");
}
