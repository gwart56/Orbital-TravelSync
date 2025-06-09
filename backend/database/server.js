// backend/server.js
const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/auth');

app.use(cors({
  origin: 'http://localhost:5173', // Adjust this to your frontend URL
  credentials: true,
}));
app.use(express.json());
app.use('/api/auth', userRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
