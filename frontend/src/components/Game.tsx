'use client';

import React, { useState } from 'react';
import geojsondata from '@/data/GeoJSON';
import KantoMap from './KantoMap';
import type { Feature } from 'geojson';
import AudioPlayer from './AudioPlayer';
import ScoreCounter, { Score } from './ScoreCounter';

const getChallenge = (features: Feature[]): Feature[] => {
  return Array.from(
    { length: 5 },
    () => features.splice(Math.floor(Math.random() * features.length), 1)[0]
  );
};

const challenge = getChallenge([...(geojsondata.features as Feature[])]);

const Game = () => {
  const [randomFeature, setRandomFeature] = useState(challenge[0]);
  const currentTrack = randomFeature.properties?.title;
  const currentTrackName = randomFeature.properties?.name;
  const [showResult, setShowResult] = useState(false);
  const [canConfirm, setCanConfirm] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState<Score>({ correct: 0, total: 0 });
  const [round, setRound] = useState(1);

  const TOTAL_ROUNDS = 5;

  const handleConfirmGuess = () => {
    if (canConfirm) {
      setShowResult(true);
      setScore((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1,
      }));
    }
  };

  const handleNextRound = () => {
    if (round < TOTAL_ROUNDS) {
      setRound((prev) => prev + 1);
      setRandomFeature(challenge[round]);
      setShowResult(false);
      setCanConfirm(false);
      setIsCorrect(null);
    }
  };

  return (
    <div className="flex flex-col">
      {/* <ScoreCounter score={score} round={round} totalRounds={TOTAL_ROUNDS} /> */}
      <AudioPlayer
        src={`https://ia601409.us.archive.org/5/items/pkmn-frlg-soundtrack/Disc%201/${currentTrack}`}
      />
      {showResult && (
        <div className="z-50 text-center my-4 flex flex-col items-center gap-2">
          <p
            className={`font-semibold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}
          >
            {isCorrect ? 'Correct!' : 'Wrong!'} It was {currentTrackName}
          </p>
        </div>
      )}
      <KantoMap
        currentFeature={randomFeature}
        showResult={showResult}
        setCanConfirm={setCanConfirm}
        setIsCorrect={setIsCorrect}
      />
      <div className="w-full flex justify-center gap-4 my-4">
        <button
          type="button"
          onClick={handleConfirmGuess}
          disabled={!canConfirm || showResult}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 w-auto inline-flex ${
            canConfirm && !showResult
              ? 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Confirm guess
        </button>
        {showResult && round < TOTAL_ROUNDS && (
          <button
            type="button"
            onClick={handleNextRound}
            className="px-6 py-2 rounded-lg font-semibold transition-all duration-200 w-auto inline-flex
                     bg-green-600 hover:bg-green-700 text-white cursor-pointer"
          >
            Next round
          </button>
        )}
      </div>
    </div>
  );
};

export default Game;
