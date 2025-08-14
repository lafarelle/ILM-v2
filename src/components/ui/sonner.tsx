"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        style: {
          background: theme === "dark" ? "#1f2937" : "#ffffff",
          color: theme === "dark" ? "#f9fafb" : "#111827",
          border: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
        },
        className: "group toast group-[.toaster]:shadow-lg",
        descriptionClassName: "group-[.toast]:opacity-90",
      }}
      {...props}
    />
  )
}

export { Toaster }
