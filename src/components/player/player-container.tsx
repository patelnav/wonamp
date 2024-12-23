import { ReactNode } from "react"

interface PlayerContainerProps {
  children: ReactNode
}

export function PlayerContainer({ children }: PlayerContainerProps) {
  return (
    <div className="w-full h-full bg-wonamp-bg flex flex-col">
      {children}
    </div>
  )
}

