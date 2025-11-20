"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "LIGHT" | "DARK" | "SYSTEM";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("SYSTEM");
    const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        // Get system preference
        const getSystemTheme = (): "light" | "dark" => {
            if (typeof window !== "undefined" && window.matchMedia) {
                return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            }
            return "light";
        };

        // Resolve theme
        const resolveTheme = (currentTheme: Theme): "light" | "dark" => {
            if (currentTheme === "SYSTEM") {
                return getSystemTheme();
            }
            return currentTheme.toLowerCase() as "light" | "dark";
        };

        const resolved = resolveTheme(theme);
        setResolvedTheme(resolved);

        // Apply theme to document
        const root = document.documentElement;
        root.classList.remove("light", "dark");

        if (theme === "LIGHT") {
            root.classList.add("light");
        } else if (theme === "DARK") {
            root.classList.add("dark");
        } else if (resolved === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.add("light");
        }

        // Listen for system theme changes
        if (theme === "SYSTEM") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            const handleChange = (e: MediaQueryListEvent) => {
                const newResolved = e.matches ? "dark" : "light";
                setResolvedTheme(newResolved);
                root.classList.remove("light", "dark");
                if (newResolved === "dark") {
                    root.classList.add("dark");
                } else {
                    root.classList.add("light");
                }
            };

            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
