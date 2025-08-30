"use client";
import fluidCursor from "@/hooks/useFluidCursor";
import { useEffect } from "react";

export default function FluidCanvas() {
  useEffect(() => {
    fluidCursor();
  }, []);

  return (
    <div className="fixed top-0 left-0 z-2 pointer-events-none">
      <canvas id='fluid' className='w-screen h-screen' />
    </div>
  );
}
