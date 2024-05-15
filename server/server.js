const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
const crypto = require('crypto');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get('/characters', async (req, res) => {
  const { nameStartsWith } = req.query;
  const ts = new Date().getTime();
  const hash = crypto.createHash('md5').update(ts + process.env.MARVEL_PRIVATE_KEY + process.env.MARVEL_PUBLIC_KEY).digest('hex');
  const url = `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${nameStartsWith}&apikey=${process.env.MARVEL_PUBLIC_KEY}&ts=${ts}&hash=${hash}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching Marvel data:', error);
    res.status(500).send('Error fetching data');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
