const express = require('express');
const path = require('path');
const { spawn } = require('child_process'); // Added import
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'symtm.html'));
});

// Endpoint to handle prediction POST requests with child_process
app.post('/predict', (req, res) => {
  // Extract input text from request body
  const inputText = req.body.text;

  // Spawn a child process with Python interpreter and script path
  const python = spawn('python', ['predictor.py', inputText]);

  // Capture standard output from the Python script
  let prediction = '';
  python.stdout.on('data', (data) => {
    prediction += data.toString();
  });

  // Handle errors from the Python script
  python.stderr.on('data', (data) => {
    console.error('Python error:', data.toString());
    return res.status(500).json({ error: 'An error occurred during prediction.' });
  });

  // Handle successful execution and send response
  python.on('close', (code) => {
    if (code === 0) {
      // Assuming prediction is the first line of output
      prediction = prediction.trim().split('\n')[0];
      res.json({ prediction });
    } else {
      console.error('Python script exited with code:', code);
      res.status(500).json({ error: 'An error occurred during prediction.' });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
