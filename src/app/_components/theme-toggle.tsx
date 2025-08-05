"use client";

import React from "react";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const toggleTheme = async (e: React.MouseEvent) => {
    const { clientX: x, clientY: y } = e;
    const newTheme = theme === "dark" ? "light" : "dark";
    

    const enableTransition =
      "startViewTransition" in document &&
      window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

    if (enableTransition) {
      await document.startViewTransition(async () => {
        setTheme(newTheme);
      }).ready;

      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y),
        )}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        { 
          clipPath: isDark?clipPath:clipPath.reverse(),
        },
        {
          duration: 300,
          easing: "ease-in",
          pseudoElement: `::view-transition-${isDark ? "new" : "old"}(root)`,
        },
      );
    } else {
      setTheme(newTheme);
    }
  };

  return (
    <button 
      onClick={toggleTheme} 
      className="rounded-md p-2"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}
