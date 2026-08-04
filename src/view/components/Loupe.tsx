"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LoupeProps {
  src: string;
  alt: string;
  className?: string;
}

export const Loupe: React.FC<LoupeProps> = ({ src, alt, className }) => {
  const [isActive, setIsActive] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [bgPos, setBgPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    setPos({ x, y });
    setBgPos({ x: percentX, y: percentY });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      onMouseMove={handleMouseMove}
      className={cn("relative overflow-hidden cursor-crosshair group", className)}
    >
      <Image src={src} alt={alt} fill className="object-cover" priority />

      {/* Desktop 250px Magnifier Lens */}
      {isActive && (
        <div
          className="hidden md:block absolute w-[250px] h-[250px] rounded-full border-2 border-marigold pointer-events-none z-20 transition-all duration-loupe ease-silk shadow-none overflow-hidden"
          style={{
            left: `${pos.x - 125}px`,
            top: `${pos.y - 125}px`,
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "300%",
            backgroundPosition: `${bgPos.x}% ${bgPos.y}%`,
          }}
        />
      )}
    </div>
  );
};
