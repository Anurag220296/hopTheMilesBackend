require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const bookingRoutes = require('./routes/booking.routes');

const app = express();

// ✅ Connect MongoDB
connectDB();

// ✅ Middlewares
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// ✅ Routes
app.use('/api/bookings', bookingRoutes);

app.get('/', (req, res) => {
  res.send('HopTheMiles API is running 🚀');
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Server error' });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ✅ Export for Vercel
module.exports = app;