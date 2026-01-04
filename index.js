const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const app = express();

// Import your routes
const { qrRoute, pairRoute } = require('./routes');

// Standard Express setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/qr', qrRoute);
app.use('/code', pairRoute);

app.get('/pair', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pair.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: "OK", service: 'Gifted-Md' });
});

// DO NOT use app.listen(PORT) here for Vercel.
// Vercel handles the invocation automatically via the export below.
module.exports = app;
