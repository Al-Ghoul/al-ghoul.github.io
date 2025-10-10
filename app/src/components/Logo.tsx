"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import LogoTextSVG from "@/assets/logo.svg";

export default function Logo({
  onAnimationComplete,
  strokeWidth = 0.1,
  className,
  duration = 2,
}: Props) {
  const jsx = LogoTextSVG({});

  let d = "";

  const children = jsx.props.children;
  const pathElement = Array.isArray(children)
    ? children.find((el) => el?.type === "path")
    : children?.type === "path"
      ? children
      : null;

  if (pathElement?.props?.d) {
    d = pathElement.props.d;
  }

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 67 17"
      className={cn("w-48 h-24", className)}
    >
      {d && (
        <motion.path
          d={d}
          className="stroke-black dark:stroke-white"
          strokeWidth={strokeWidth}
          fill="transparent"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: {
              duration,
              ease: "circIn",
              delay: 0.2
            },
          }}
          onAnimationComplete={onAnimationComplete}
        />
      )}
    </motion.svg>
  );
}

interface Props {
  onAnimationComplete?: () => void;
  strokeWidth?: number;
  className?: string;
  duration?: number;
}
