import { ReactNode } from "react"

interface PlayerContainerProps {
  children: ReactNode
}

export function PlayerContainer({ children }: PlayerContainerProps) {
  return (
    <div className="w-full bg-[#3B3B4F] flex-grow">
      {/* Top border with double gold lines */}
      <div className="h-[4px] flex flex-col gap-[2px] px-1 bg-[#3B3B4F]">
        <div className="h-[1px] bg-[#8B7355]" />
        <div className="h-[1px] bg-[#8B7355]" />
      </div>
      {children}
    </div>
  )
}

