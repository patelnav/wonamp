import { Play, Pause, SkipBack, SkipForward, Square, Shuffle, Repeat } from 'lucide-react'

export function TransportControls() {
  return (
    <div className="bg-[#282833] border border-[#1D1D29] p-2 flex justify-between items-center">
      <div className="flex gap-1">
        {['prev', 'play', 'pause', 'stop', 'next'].map((button) => (
          <button
            key={button}
            className="h-[18px] w-[18px] bg-gradient-to-b from-[#777790] to-[#3B3B4F] 
                     border border-[#1D1D29] active:from-[#3B3B4F] active:to-[#777790]
                     flex items-center justify-center"
          >
            {button === 'prev' && <SkipBack className="h-3 w-3 text-[#1D1D29]" />}
            {button === 'play' && <Play className="h-3 w-3 text-[#1D1D29]" />}
            {button === 'pause' && <Pause className="h-3 w-3 text-[#1D1D29]" />}
            {button === 'stop' && <Square className="h-3 w-3 text-[#1D1D29]" />}
            {button === 'next' && <SkipForward className="h-3 w-3 text-[#1D1D29]" />}
          </button>
        ))}
      </div>
      <div className="flex gap-1">
        <button className="h-[18px] px-2 bg-gradient-to-b from-[#777790] to-[#3B3B4F] 
                       border border-[#1D1D29] active:from-[#3B3B4F] active:to-[#777790]
                       flex items-center justify-center">
          <Shuffle className="h-3 w-3 text-[#1D1D29]" />
        </button>
        <button className="h-[18px] px-2 bg-gradient-to-b from-[#777790] to-[#3B3B4F] 
                       border border-[#1D1D29] active:from-[#3B3B4F] active:to-[#777790]
                       flex items-center justify-center">
          <Repeat className="h-3 w-3 text-[#1D1D29]" />
        </button>
      </div>
    </div>
  )
}

