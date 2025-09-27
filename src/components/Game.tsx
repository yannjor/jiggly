'use client';

import type { Feature } from 'geojson';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import geojsondata from '@/data/GeoJSON';
import AudioPlayer from './AudioPlayer';
import ScoreCounter, { type Score } from './ScoreCounter';
import './jigglypuff-animations.css';
import WelcomeScreen from './WelcomeScreen';

const Game = () => {
  const getChallenge = (features: Feature[]): Feature[] => {
    return Array.from(
      { length: 5 },
      () => features.splice(Math.floor(Math.random() * features.length), 1)[0],
    );
  };

  const [gameStarted, setGameStarted] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState<Feature[]>([]);
  const [randomFeature, setRandomFeature] = useState<Feature | null>(null);
  const currentTrack = randomFeature?.properties?.title;
  const currentTrackName = randomFeature?.properties?.name;
  const [showResult, setShowResult] = useState(false);
  const [canConfirm, setCanConfirm] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState<Score>({ correct: 0, total: 0 });
  const [round, setRound] = useState(1);
  const [gameComplete, setGameComplete] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const TOTAL_ROUNDS = 5;

  const KantoMap = useMemo(
    () =>
      dynamic(() => import('./KantoMap'), {
        loading: () => <p className="text-center">Map is loading...</p>,
        ssr: false,
      }),
    [],
  );

  const handleStartGame = () => {
    const newChallenge = getChallenge([...(geojsondata.features as Feature[])]);
    setCurrentChallenge(newChallenge);
    setRandomFeature(newChallenge[0]);
    setGameStarted(true);
  };

  const handleConfirmGuess = () => {
    if (canConfirm) {
      setShowResult(true);
      setScore((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1,
      }));

      // Trigger celebration animation if correct
      if (isCorrect) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000); // Stop after 2 seconds
      }
    }
  };

  const handleNextRound = () => {
    if (round < TOTAL_ROUNDS) {
      setRound((prev) => prev + 1);
      setRandomFeature(currentChallenge[round]);
      setShowResult(false);
      setCanConfirm(false);
      setIsCorrect(null);
      setShowCelebration(false);
    } else {
      setGameComplete(true);
    }
  };

  const handlePlayAgain = () => {
    const newChallenge = getChallenge([...(geojsondata.features as Feature[])]);
    setCurrentChallenge(newChallenge);
    setRandomFeature(newChallenge[0]);
    setRound(1);
    setScore({ correct: 0, total: 0 });
    setShowResult(false);
    setCanConfirm(false);
    setIsCorrect(null);
    setGameComplete(false);
    setShowCelebration(false);
  };

  if (!gameStarted) {
    return <WelcomeScreen handleStartGame={handleStartGame} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-between items-center p-4">
        <div className="flex gap-4 items-center relative">
          <div className="relative">
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/jigglypuff.png`}
              width={40}
              height={40}
              alt="jigglypuff"
              className={showCelebration ? 'celebration-animation' : ''}
            />
            {showCelebration && (
              <>
                <div className="confetti-particle"></div>
                <div className="confetti-particle"></div>
                <div className="confetti-particle"></div>
                <div className="confetti-particle"></div>
                <div className="confetti-particle"></div>
              </>
            )}
          </div>
          <h1 className="text-xl font-bold">Jiggly</h1>
        </div>
        <ScoreCounter score={score} round={round} totalRounds={TOTAL_ROUNDS} />
      </div>

      {gameComplete ? (
        <div className="text-center my-8 flex flex-col items-center gap-4">
          <h2 className="text-2xl font-bold">Challenge Complete!</h2>
          <p className="text-lg">
            Final Score: {score.correct}/{TOTAL_ROUNDS} (
            {Math.round((score.correct / TOTAL_ROUNDS) * 100)}%)
          </p>
          <button
            type="button"
            onClick={handlePlayAgain}
            className="px-8 py-3 rounded-lg font-semibold transition-all duration-200
                     bg-purple-600 hover:bg-purple-700 text-white cursor-pointer text-lg"
          >
            Play Again
          </button>
        </div>
      ) : (
        <>
          <div className="p-4">
            <AudioPlayer
              src={`https://ia601409.us.archive.org/5/items/pkmn-frlg-soundtrack/Disc%201/${currentTrack}`}
            />
          </div>

          {showResult && (
            <div className="text-center py-3">
              <p
                className={`font-semibold text-lg ${isCorrect ? 'text-green-600' : 'text-red-600'}`}
              >
                {isCorrect ? 'Correct!' : 'Wrong!'} It was {currentTrackName}
              </p>
            </div>
          )}

          <div className="p-4">
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={handleConfirmGuess}
                disabled={!canConfirm || showResult}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  canConfirm && !showResult
                    ? 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer shadow-md hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Confirm guess
              </button>
              {showResult && round < TOTAL_ROUNDS && (
                <button
                  type="button"
                  onClick={handleNextRound}
                  className="px-6 py-2 rounded-lg font-semibold transition-all duration-200
                           bg-green-600 hover:bg-green-700 text-white cursor-pointer shadow-md hover:shadow-lg"
                >
                  Next round
                </button>
              )}
              {showResult && round === TOTAL_ROUNDS && (
                <button
                  type="button"
                  onClick={handleNextRound}
                  className="px-6 py-2 rounded-lg font-semibold transition-all duration-200
                           bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-md hover:shadow-lg"
                >
                  View Results
                </button>
              )}
            </div>
          </div>

          <div className="flex-1">
            {randomFeature && (
              <KantoMap
                currentFeature={randomFeature}
                showResult={showResult}
                setCanConfirm={setCanConfirm}
                setIsCorrect={setIsCorrect}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Game;
