"use client";

import { ReactNode } from "react";

interface ResponsiveGridProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  leftClassName?: string;
  rightClassName?: string;
}

/**
 * Responsive 2-panel layout
 * - Mobile: Stacked vertically (chat at top, orb at bottom - fixed)
 * - Desktop: Side-by-side (orb left, chat right)
 */
export default function ResponsiveGrid({
  leftPanel,
  rightPanel,
  leftClassName = "",
  rightClassName = "",
}: ResponsiveGridProps) {
  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden">
      {/* Right Panel - Chat (Mobile: top, Desktop: right) */}
      <div
        className={`
          flex-1 overflow-hidden
          md:w-1/2 md:h-full
          order-1 md:order-2
          ${rightClassName}
        `}
      >
        {rightPanel}
      </div>

      {/* Left Panel - Orb (Mobile: bottom fixed, Desktop: left) */}
      <div
        className={`
          flex-shrink-0
          md:w-1/2 md:h-full
          order-2 md:order-1
          ${leftClassName}
        `}
      >
        {leftPanel}
      </div>
    </div>
  );
}

