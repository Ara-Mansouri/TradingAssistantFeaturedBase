"use client";

import { ReactNode } from "react";

interface OrbContainerProps {
  children: ReactNode;
  size?: "small" | "large";
}

/**
 * Container for the Voice Orb
 * - Mobile: Small size, fixed at bottom
 * - Desktop: Large size, in left panel
 */
export default function OrbContainer({ children, size = "large" }: OrbContainerProps) {
  const isSmall = size === "small";

  return (
    <div
      className={`
        flex items-center justify-center
        ${isSmall ? "w-full py-4" : "w-full h-full"}
      `}
    >
      {children}
    </div>
  );
}

