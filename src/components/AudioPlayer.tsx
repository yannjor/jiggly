'use client';

import React, { useRef } from 'react';

interface Props {
  src: string;
}

const AudioPlayer = ({ src }: Props) => {
  const audioRef = useRef(null);

  return (
    <div className="flex justify-center mt-4">
      {/* biome-ignore lint/a11y/useMediaCaption: not really possible to have captions */}
      <audio controls ref={audioRef} src={src} />
    </div>
  );
};

export default AudioPlayer;
