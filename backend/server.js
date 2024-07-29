import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import mysql from 'mysql';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
console.log({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});


const app = express();
app.use(express.json());
app.use(cors());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('Error: OPENAI_API_KEY is not set. Please check your .env file.');
  process.exit(1);
}


app.post('/signin', (req, res) => {
  const { email, password } = req.body;

  // First, check if email and password were provided
  if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
  }

  // Query the database to find the user by email
  pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email],
      (error, results) => {
          if (error) {
              console.error("Database query error:", error); // Log detailed error
              return res.status(500).json({ error: 'Database error' });
          }

          // Check if any user was returned from the database
          if (results.length === 0) {
              return res.status(404).json({ error: 'User not found' });
          }

          // User found, now compare the provided password with the stored hashed password
          const user = results[0];
          bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) {
                  console.error("Error comparing password:", err);
                  return res.status(500).json({ error: 'Error while checking password' });
              }

              // If the password matches, return success; otherwise, return invalid credentials
              if (isMatch) {
                  return res.status(200).json({ message: 'Login successful' });
              } else {
                  return res.status(401).json({ error: 'Invalid credentials' });
              }
          });
      }
  );
});

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      (error, results) => {
        if (error) {
          console.error("Error during user creation:", error);
          if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Email already in use' });
          } else {
            return res.status(500).json({
              error: 'Internal server error',
              message: error.sqlMessage,
              details: error
            });
          }
        }
        return res.status(201).json({ message: 'User created successfully', userId: results.insertId });
      }
    );
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

app.post('/generate-workout-routine', async (req, res) => {
  const choices = req.body;
  const prompt = `
    You are a fitness expert. Create a personalized full body workout routine based on the following user preferences:
    
    Age: ${choices.age}
    Gender: ${choices.gender}
    Goal: ${choices.goal}
    Area of Workout: ${choices.area}
    Days Available per Week: ${choices.days_available}
    
    The response should be in valid JSON format and contain a workout plan for each day. The JSON should have the following structure:
    {
      "day1": [
        {"exercise": "Exercise Name", "sets": Number, "reps": "Rep Range"}
      ],
      "day2": [
        {"exercise": "Exercise Name", "sets": Number, "reps": "Rep Range"}
      ],
      ...
    }
    Ensure the JSON is properly formatted and filled with appropriate exercises, sets, and reps.
  `;

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    })
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', options);
    const data = await response.json();

    if (response.ok) {
      res.json(data);
    } else {
      res.status(response.status).json({ error: data.error || 'Failed to generate workout routine' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error generating workout routine', details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});