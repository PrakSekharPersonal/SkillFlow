import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { Theme, ToastType } from "../types";

interface UIContextType {
  theme: Theme;
  toggleTheme: () => void;
  showToast: (message: string, type: ToastType) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("skillflow-theme");
    if (saved === "light" || saved === "dark") return saved;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  // Sync the theme to the HTML root element so that Tailwind's dark: classes work correctly.
  // This ensures components with createPortal also get the correct theme styles, since they are outside the normal React tree.
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("skillflow-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    console.log("Current theme:", theme);
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000); // Auto-hide toast after 3s
  }, []);

  return (
    <UIContext.Provider value={{ theme, toggleTheme, showToast }}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        {children}

        {toast &&
          createPortal(
            <div
              className={`fixed bottom-8 right-8 px-6 py-3 rounded-xl shadow-2xl text-white dark:text-slate-900 font-bold animate-bounce-in z-[200] flex items-center gap-3
              ${toast.type === "success" ? "bg-emerald-500" : "bg-red-500"}`}
            >
              <span>{toast.type === "success" ? "✅" : "🗑️"}</span>
              {toast.message}
            </div>,
            document.body,
          )}
      </div>
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI must be used within a UIProvider");
  return context;
};
