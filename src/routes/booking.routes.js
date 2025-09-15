const express = require('express');
const router = express.Router();
const controller = require('../controllers/booking.controller');

// CRUD
router.post('/', controller.createBooking);
router.get('/', controller.getBookings);
router.get('/:id', controller.getBookingById);
router.put('/:id', controller.updateBooking);
router.delete('/:id', controller.deleteBooking);

// Cancel endpoint
router.put('/:id/cancel', controller.cancelBooking);

module.exports = router;
