"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useLocalStorage } from "react-use";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  setTheme: () => null,
});

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: ThemeProviderProps) {
  const [theme, setTheme] = useLocalStorage<Theme>("theme", defaultTheme);

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove previous class
    root.classList.remove("light", "dark");

    // Apply theme
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else if (theme) {
      root.classList.add(theme);
    }

    setTheme(theme);
  }, [setTheme, theme]);

  return (
    <ThemeContext value={{ theme: theme!, setTheme }}>{children}</ThemeContext>
  );
}

export const useTheme = () => useContext(ThemeContext);
