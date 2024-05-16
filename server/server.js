const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();
console.log(process.env.MARVEL_PUBLIC_KEY, process.env.MARVEL_PRIVATE_KEY);

const app = express();

app.use(cors());
app.use(express.json());

// Define API routes before the catch-all route
app.get('/characters', async (req, res) => {
    console.log("API endpoint hit with query:", req.query); // Logging the query
    const { nameStartsWith } = req.query;
    const ts = new Date().getTime();
    console.log("Timestamp:", ts);
    console.log("Private Key:", process.env.MARVEL_PRIVATE_KEY);
    console.log("Public Key:", process.env.MARVEL_PUBLIC_KEY);

    if (!process.env.MARVEL_PRIVATE_KEY || !process.env.MARVEL_PUBLIC_KEY) {
        console.error("API keys are not set properly.");
        return res.status(500).send('Server configuration error');
    }

    const hash = crypto.createHash('md5').update(ts.toString() + process.env.MARVEL_PRIVATE_KEY + process.env.MARVEL_PUBLIC_KEY).digest('hex');
    const url = `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${nameStartsWith}&apikey=${process.env.MARVEL_PUBLIC_KEY}&ts=${ts}&hash=${hash}`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching Marvel data:', error);
        res.status(500).send('Error fetching data');
    }
});

// Serve static files from React build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle SPA routing, return index.html for all non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
