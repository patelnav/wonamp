import { WinampSlider } from "../ui/winamp-slider"

export function VolumeControl() {
  return (
    <div className="flex items-center gap-2 bg-[#282833] p-2 border border-[#1D1D29]">
      <div className="flex-1">
        <WinampSlider
          defaultValue={[75]}
          max={100}
          step={1}
          className="w-full"
        />
      </div>
      <div className="text-[#00FF00] font-mono text-sm px-2 bg-black border border-[#282833]">
        stereo
      </div>
    </div>
  )
}

