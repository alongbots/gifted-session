const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const app = express();

const PORT = process.env.PORT || 50900;

// Temporary in-memory database to store sessions
// In a real app, use MongoDB or a JSON file
const sessionDb = {};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * HELPER: Generates a unique 5-digit ID
 */
function generateShortId() {
    return Math.floor(10000 + Math.random() * 90000).toString();
}

/**
 * ROUTE: Generate a Session
 * This simulates what happens when someone scans a QR/Pairing code
 */
app.get('/gen-session', (req, res) => {
    const sessionId = generateShortId();
    
    // This is where you'd normally put your long WhatsApp Auth data
    const mockAuthData = "Base64_Long_Auth_Data_Example_123456789"; 
    
    // Save it to our "database"
    sessionDb[sessionId] = {
        data: mockAuthData,
        created: new Date().toISOString()
    };

    res.json({
        success: true,
        sessionId: sessionId, // This will be 5 digits (e.g., 54921)
        message: "Session generated successfully"
    });
});

/**
 * ROUTE: Retrieve Session
 * Use this to get the data back using the 5-digit code
 */
app.get('/get-session/:id', (req, res) => {
    const id = req.params.id;
    const session = sessionDb[id];

    if (session) {
        res.json({ success: true, data: session.data });
    } else {
        res.status(404).json({ success: false, message: "Session ID not found" });
    }
});

// Default Routes
app.get('/', (req, res) => {
    res.send("Server is running. Use /gen-session to get a 5-digit ID.");
});

app.listen(PORT, () => {
    console.log(`
Deployment Successful!
Short Session Server Running on http://localhost:${PORT}
    `);
});
