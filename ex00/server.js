const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const users = []; // In-memory user storage, replace with a database in production

app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Register new user
  users.push({ username, password });
  res.json({ message: 'Registration successful' });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  // Authenticate user
  const user = users.find(user => user.username === username && user.password === password);
  if (user) {
    res.json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/gemini', async (req, res) => {
  const { prompt } = req.body;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(prompt);
    res.json(result.response.text());
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Error generating response from Gemini API.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});