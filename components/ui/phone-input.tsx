"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type PhoneInputProps = React.ComponentProps<"input">

function PhoneInput({ className, ...props }: PhoneInputProps) {
  return (
    <div className="relative flex items-center">
      <span className="flex h-7 items-center rounded-l-md border border-r-0 border-input bg-input/20 px-2 py-0.5 text-sm text-muted-foreground">
        +212
      </span>
      <input
        type="tel"
        data-slot="phone-input"
        className={cn(
          "h-7 w-full min-w-0 rounded-md rounded-l-none border border-input bg-input/20 px-2 py-0.5 text-sm transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs/relaxed file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 md:text-xs/relaxed dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          className
        )}
        placeholder="6 12 34 56 78"
        {...props}
      />
    </div>
  )
}

export { PhoneInput }
