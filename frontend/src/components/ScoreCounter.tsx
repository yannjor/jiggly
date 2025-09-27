import React from 'react';

export interface Score {
  correct: number;
  total: number;
}

interface Props {
  score: Score;
  round: number;
  totalRounds: number;
}

const ScoreCounter = ({ score, round, totalRounds }: Props) => {
  return (
    <div className="bg-gray-100 rounded-lg px-6 py-3 mb-4 flex gap-6">
      <div className="text-center">
        <p className="text-sm text-gray-600">Round</p>
        <p className="font-bold text-lg">
          {round}/{totalRounds}
        </p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-600">Score</p>
        <p className="font-bold text-lg">
          {score.correct}/{score.total}
        </p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-600">Accuracy</p>
        <p className="font-bold text-lg">
          {score.total > 0
            ? Math.round((score.correct / score.total) * 100)
            : 0}
          %
        </p>
      </div>
    </div>
  );
};

export default ScoreCounter;
