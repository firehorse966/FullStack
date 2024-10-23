import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePollinationsImage } from '@pollinations/react';

function HomePage() {
  const [selectedCategories, setSelectedCategories] = useState({
    characteristic1: '',
    characteristic2: '',
    characteristic3: '',
    characteristic4: '',
    characteristic5: ''
  });
  const [prompt, setPrompt] = useState('');

  const imageUrl = usePollinationsImage(prompt, {
    width: 768,
    height: 768,
    seed: 42,
    model: 'flux',
    nologo: true
  });

  const handleCategoryChange = (event, characteristic) => {
    setSelectedCategories({
      ...selectedCategories,
      [characteristic]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Selected Categories:', selectedCategories);

    // Generate a detailed prompt based on the selected options
    const generatedPrompt = `Create a drawing of a Pokémon with the following characteristics:
    - Type: ${selectedCategories.characteristic1}
    - Species: ${selectedCategories.characteristic2}
    - Appearance: ${selectedCategories.characteristic3}
    - Color: ${selectedCategories.characteristic4}
    - Shape: ${selectedCategories.characteristic5}`;

    setPrompt(generatedPrompt);

    try {
      await axios.post('http://localhost:5000/api/gemini', { prompt: generatedPrompt });
    } catch (error) {
      console.error('Error calling Gemini API:', error);
    }
  };

  useEffect(() => {
    console.log('Generated image URL:', imageUrl);
  }, [imageUrl]);

  return (
    <div className="home-container">
      <h1>Welcome! unleash your inner Pokémon</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Type:</label>
          <input
            type="text"
            value={selectedCategories.characteristic1}
            onChange={(e) => handleCategoryChange(e, 'characteristic1')}
          />
        </div>
        <div>
          <label>Species:</label>
          <input
            type="text"
            value={selectedCategories.characteristic2}
            onChange={(e) => handleCategoryChange(e, 'characteristic2')}
          />
        </div>
        <div>
          <label>Appearance:</label>
          <input
            type="text"
            value={selectedCategories.characteristic3}
            onChange={(e) => handleCategoryChange(e, 'characteristic3')}
          />
        </div>
        <div>
          <label>Color:</label>
          <input
            type="text"
            value={selectedCategories.characteristic4}
            onChange={(e) => handleCategoryChange(e, 'characteristic4')}
          />
        </div>
        <div>
          <label>Shape:</label>
          <input
            type="text"
            value={selectedCategories.characteristic5}
            onChange={(e) => handleCategoryChange(e, 'characteristic5')}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {imageUrl && (
        <div className="generated-image">
          <h2>Your Creation:</h2>
          <img src={imageUrl} alt="Generated" />
        </div>
      )}
    </div>
  );
}

export default HomePage;