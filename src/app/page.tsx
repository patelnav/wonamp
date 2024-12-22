import { TitleBar } from "@/components/title-bar"
import { Player } from "@/components/player"
import { Playlist } from "@/components/playlist"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl">
        <TitleBar />
        <Player />
        <Playlist />
      </div>
    </main>
  )
}

