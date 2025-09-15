const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");
const auth = require("../middleware/auth");

router.post("/", auth, bookingController.createBooking); // protected

// other routes (can remain open or protected as needed)
router.get("/", bookingController.getBookings);
router.get("/:id", bookingController.getBookingById);
router.put("/:id", bookingController.updateBooking);
router.delete("/:id", bookingController.deleteBooking);

router.post("/:id/cancel", bookingController.cancelBooking);

module.exports = router;
