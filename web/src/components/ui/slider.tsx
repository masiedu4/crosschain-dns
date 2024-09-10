import React, { useState } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    value: number[];
    durations: number[];
  }
>(({ className, value, durations, ...props }, ref) => (
  <div className="relative pt-10">
    <div className="absolute top-0 left-0 right-0 flex justify-between">
      {durations.map((duration) => (
        <span
          key={duration}
          className={cn(
            "text-lg font-medium transition-colors",
            value[0] === duration ? "text-white" : "text-white"
          )}
        >
          {duration}s
        </span>
      ))}
    </div>
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-primary-bg" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
  </div>
));

Slider.displayName = "Slider";

export { Slider };
