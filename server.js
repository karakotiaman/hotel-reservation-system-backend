const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const bookingRoutes = require('./routes/booking.routes');
const initializeHotel = require('./scripts/initializeHotel');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', bookingRoutes);

async function startServer() {
  try {
    await sequelize.sync({ force: false, logging: false, alter: false });
    // await initializeHotel();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer(); 