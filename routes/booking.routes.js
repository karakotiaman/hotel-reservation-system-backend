const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/booking.controller');

// Create a new booking
router.post('/book', BookingController.createBooking);

// Get current state of all rooms and bookings
router.get('/state', BookingController.getCurrentState);

// Generate random occupancy
router.post('/random', BookingController.generateRandomOccupancy);

// Reset all bookings
router.post('/reset', BookingController.resetAllBookings);

module.exports = router; 