import React from 'react';
import { usePollinationsImage } from '@pollinations/react';

const GeneratedImageComponent = () => {
  const imageUrl = usePollinationsImage('LOGO: TRACTOR EVENTS, bold, modern design, vibrant colors, graphic style, minimalistic, clean, branding, unknown artist,nologo=true', {
    width: 768,
    height: 768,
    seed: 42,
    model: 'flux',
    nologo: true
  });

  return (
    <div>
      {imageUrl ? <img src={imageUrl} alt="Generated Image" /> : <p>Loading...</p>}
    </div>
  );
};

export default GeneratedImageComponent;