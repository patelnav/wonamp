export function TrackInfo() {
  return (
    <div className="flex justify-between items-center mt-2 text-wonamp-text-green font-mono text-sm">
      <div className="text-xl tabular-nums hidden sm:block">00:04</div>
      <div className="flex items-center gap-2">
        <span className="bg-black px-1 border border-wonamp-border">192 kbps</span>
        <span className="bg-black px-1 border border-wonamp-border">44 khz</span>
      </div>
    </div>
  )
}

