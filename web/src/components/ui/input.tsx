import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-full border border-custom-border bg-primary-bg/20 px-4 py-3 text-lg text-white placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
            "focus:outline-none focus:ring-0 focus:border-custom-border", // Remove focus styles
            "pr-24", // Add right padding for USDC text
            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none", // Remove arrows for number input
            className
          )}
          placeholder="10"
          ref={ref}
          {...props}
        />
        <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-lg font-bold text-primary-bg">
          USDC
        </span>
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }