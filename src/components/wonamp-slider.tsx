import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface WonampSliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  orientation?: "horizontal" | "vertical"
}

const WonampSlider = forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, WonampSliderProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => {
    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex touch-none select-none items-center",
          orientation === "vertical" && "h-full flex-col",
          className
        )}
        orientation={orientation}
        {...props}
      >
        <SliderPrimitive.Track
          className={cn(
            "relative grow rounded-full bg-[#2A2A35]",
            orientation === "horizontal" ? "h-2 w-full" : "h-full w-2"
          )}
        >
          <SliderPrimitive.Range className="absolute rounded-full bg-[#00FF00]" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className={cn(
            "block h-4 w-4 rounded-sm bg-[#3D3D6B]",
            "border border-white/20",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          )}
        />
      </SliderPrimitive.Root>
    )
  }
)
WonampSlider.displayName = "WonampSlider"

export { WonampSlider }

