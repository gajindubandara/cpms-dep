const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

 // Basic route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});