import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

interface WinampButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "control" | "text"
  size?: "sm" | "md" | "lg"
}

const WinampButton = forwardRef<HTMLButtonElement, WinampButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        className={cn(
          "relative select-none active:translate-y-[1px]",
          "before:absolute before:inset-0 before:border-t before:border-l before:border-white/20",
          "after:absolute after:inset-0 after:border-r after:border-b after:border-black/40",
          {
            "bg-[#3D3D6B] text-white": variant === "primary",
            "bg-[#2A2A35] text-[#00FF00]": variant === "secondary",
            "bg-[#3D3D6B] px-3 py-1": variant === "control",
            "bg-transparent": variant === "text",
            "p-1": size === "sm",
            "p-2": size === "md",
            "p-3": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
WinampButton.displayName = "WinampButton"

export { WinampButton }

