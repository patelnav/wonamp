import { TitleBar } from "@/components/title-bar"
import { Player } from "@/components/player"
import { Playlist } from "@/components/playlist"

export default function Home() {
  return (
    <div className="fixed inset-0 flex flex-col min-w-[320px]">
      <div className="bg-gray-900 p-2 flex flex-col h-full">
        <div className="flex flex-col flex-grow">
          <TitleBar />
          <div className="flex flex-col lg:flex-row flex-grow">
            <div className="h-[50%] lg:w-1/2">
              <Player />
            </div>
            <div className="h-[50%] lg:w-1/2">
              <Playlist />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

