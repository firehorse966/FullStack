import React, { useState } from 'react';
import axios from 'axios';

function HomePage() {
  const [selectedCategories, setSelectedCategories] = useState({
    characteristic1: '',
    characteristic2: '',
    characteristic3: '',
    characteristic4: '',
    characteristic5: ''
  });
  const [aiResponse, setAiResponse] = useState('');

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
    const prompt = `Create a drawing with the following characteristics:
    - Type: ${selectedCategories.characteristic1}
    - Species: ${selectedCategories.characteristic2}
    - Appearance: ${selectedCategories.characteristic3}
    - Color: ${selectedCategories.characteristic4}
    - Shape: ${selectedCategories.characteristic5}`;

    try {
      const response = await axios.post('http://localhost:5000/api/gemini', { prompt });

      setAiResponse(response.data);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setAiResponse('Error generating response from Gemini API.');
    }
  };

  return (
    <div className="home-container">
      <h1>Welcome! unleash your inner pokemon</h1>
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
      {aiResponse && (
        <div className="ai-response">
          <h2>AI Response:</h2>
          <p>{aiResponse}</p>
        </div>
      )}
    </div>
  );
}

export default HomePage;