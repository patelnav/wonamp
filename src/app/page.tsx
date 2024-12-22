import { TitleBar } from "@/components/title-bar"
import { Player } from "@/components/player"
import { Playlist } from "@/components/playlist"

export default function Home() {
  return (
    <main className="h-screen bg-gray-900 flex flex-col">
      <div className="w-full max-w-[1200px] mx-auto flex flex-col flex-grow">
        <TitleBar />
        <div className="flex flex-col flex-grow">
          <Player />
          <Playlist />
        </div>
      </div>
    </main>
  )
}

