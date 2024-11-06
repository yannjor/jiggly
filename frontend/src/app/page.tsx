import AudioPlayer from '@/components/AudioPlayer';
import KantoMap from '@/components/KantoMap';

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-center mt-12">🎵 Chatot</h1>
      <AudioPlayer src="https://ia601409.us.archive.org/5/items/pkmn-frlg-soundtrack/Disc%201/04%20-%20Pallet%20Town.flac" />
      <KantoMap />
    </div>
  );
}
