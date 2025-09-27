import Image from 'next/image';

interface Props {
  handleStartGame: () => void;
}

const WelcomeScreen = ({ handleStartGame }: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
        <div className="max-w-md space-y-6">
          <div className="flex gap-4 items-center justify-center">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/jigglypuff.png`}
              width={40}
              height={40}
              alt="jigglypuff"
            />
            <h1 className="text-4xl font-bold">Jiggly</h1>
          </div>
          <p className="text-lg text-gray-400">
            Test your knowledge of Pokémon FireRed & LeafGreen music! Listen to
            tracks and guess their location on the Kanto map.
          </p>
          <p className="text-md text-gray-400">
            5 rounds • Click on the map to make your guess
          </p>
          <button
            type="button"
            onClick={handleStartGame}
            className="px-12 py-4 rounded-lg font-bold text-xl transition-all duration-200
                       bg-purple-600 hover:bg-purple-700 text-white cursor-pointer
                       shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};
export default WelcomeScreen;
