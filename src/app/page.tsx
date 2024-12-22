import { TitleBar } from "@/components/title-bar"
import { Player } from "@/components/player"
import { Playlist } from "@/components/playlist"

export default function Home() {
  return (
    <main className="h-screen bg-gray-900 flex flex-col">
      <div className="w-full max-w-[1200px] mx-auto h-full flex flex-col">
        <TitleBar />
        <div className="flex flex-col h-[calc(100%-2rem)]">
          <div className="h-1/2">
            <Player />
          </div>
          <div className="h-1/2">
            <Playlist />
          </div>
        </div>
      </div>
    </main>
  )
}

