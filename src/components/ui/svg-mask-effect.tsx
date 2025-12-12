"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "../../lib/utils";

interface MaskContainerProps {
  children?: React.ReactNode;
  revealText?: React.ReactNode;
  size?: number;
  revealSize?: number;
  revealBg?: string;
  className?: string;
}

export function MaskContainer({
  children,
  revealText,
  size = 10,
  revealSize = 600,
  revealBg = "rgba(59,24,4,0.96)",
  className,
}: MaskContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const onEnter = () => setIsHovering(true);
    const onLeave = () => setIsHovering(false);

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", updateMousePosition);
      container.addEventListener("mouseenter", onEnter);
      container.addEventListener("mouseleave", onLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", updateMousePosition);
        container.removeEventListener("mouseenter", onEnter);
        container.removeEventListener("mouseleave", onLeave);
      }
    };
  }, []);

  const maskSize = isHovering ? revealSize : size;

  // style used for the colored reveal overlay (appears under content)
  const overlayMaskStyle: React.CSSProperties = {
    background: revealBg,
    maskImage: `url('/mask.svg')`,
    WebkitMaskImage: `url('/mask.svg')`,
    maskSize: `${maskSize}px ${maskSize}px`,
    WebkitMaskSize: `${maskSize}px ${maskSize}px`,
    maskPosition: `${mousePosition.x - maskSize / 2}px ${mousePosition.y - maskSize / 2}px`,
    WebkitMaskPosition: `${mousePosition.x - maskSize / 2}px ${mousePosition.y - maskSize / 2}px`,
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    transition: "mask-size 0.35s ease, mask-position 0.12s ease, opacity 0.25s ease",
    opacity: isHovering ? 1 : 0,
    pointerEvents: "none",
  };

  // expose css variables so children can animate colors smoothly
  const containerVars: React.CSSProperties = {
    // title becomes white on hover, dark-brown otherwise
    ["--title-color" as any]: isHovering ? "#ffffff" : "#2a1407",
    // body text becomes light yellow on hover, gray otherwise
    ["--body-color" as any]: isHovering ? "#ffefcf" : "#4b5563",
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      style={containerVars}
    // keep container itself stable; overlay will be masked
    >
      {/* Reveal overlay (under content) */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={overlayMaskStyle}
      />
      {/* Content goes above overlay */}
      <div className="relative z-10">{children}</div>

      {revealText && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          {revealText}
        </div>
      )}
    </div>
  );
}

