const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/booking.controller');

// new booking
router.post('/book', BookingController.createBooking);

// get bookings
router.get('/state', BookingController.getCurrentState);

// generate random occupancy
router.post('/random', BookingController.generateRandomOccupancy);

// reset all bookings
router.post('/reset', BookingController.resetAllBookings);

module.exports = router; 