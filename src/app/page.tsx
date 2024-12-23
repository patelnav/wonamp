import { TitleBar } from "@/components/title-bar"
import { Player } from "@/components/player"
import { Playlist } from "@/components/playlist"

export default function Home() {
  return (
    <main className="min-h-[100dvh] min-w-[320px] bg-gray-900 flex flex-col">
      <div className="w-full max-w-[1200px] mx-auto flex flex-col flex-grow">
        <TitleBar />
        <div className="flex flex-col lg:flex-row flex-grow">
          <div className="h-[50%] lg:h-full lg:w-1/2">
            <Player />
          </div>
          <div className="h-[50%] lg:h-full lg:w-1/2">
            <Playlist />
          </div>
        </div>
      </div>
    </main>
  )
}

