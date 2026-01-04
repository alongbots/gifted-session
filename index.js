const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const { 
  qrRoute,
  pairRoute
} = require('./routes');

const app = express();

// Increase listeners for complex event-heavy logic (like Baileys/Socket)
require('events').EventEmitter.defaultMaxListeners = 2000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files - Vercel handles this best via path.join
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/qr', qrRoute);
app.use('/code', pairRoute);

// HTML Routes
app.get('/pair', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pair.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        service: 'Gifted-Md Session',
        timestamp: new Date().toISOString()
    });
});

// IMPORTANT: Do NOT use app.listen() for Vercel. 
// Vercel turns your Express app into a Serverless Function automatically.
// Only use listen for local development.
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 50900;
    app.listen(PORT, () => {
        console.log(`Local Server running on http://localhost:${PORT}`);
    });
}

// Export the app for Vercel
module.exports = app;
