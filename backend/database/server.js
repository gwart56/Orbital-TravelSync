// may not be using this file, but keeping it for reference
// Orbital-TravelSync Backend Server
const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/auth');

app.use(cors({
  origin: 'https://orbital-travelsync.vercel.app/', // Adjust this to your frontend URL
  credentials: true,
}));
app.use(express.json());
app.use('/api/auth', userRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
