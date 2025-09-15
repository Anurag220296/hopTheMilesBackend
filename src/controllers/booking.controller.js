const Booking = require('../models/booking.model');
const { sendBookingConfirmation, sendBookingCancelled } = require('../utils/mailer');

exports.createBooking = async (req, res) => {
  try {
    const booking = new Booking({
      ...req.body,
      userId: req.user.id,
    });

    await booking.save();

    try {
      await sendBookingConfirmation(booking);
    } catch (mailErr) {
      console.warn('Mail send failed:', mailErr.message);
      return res.status(201).json({
        message: 'Booking created, but failed to send confirmation email',
        booking
      });
    }

    return res.status(201).json({
      message: 'Booking created and confirmation email sent',
      booking
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};


exports.getBookings = async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = {};
    if (userId) filter.userId = userId;

    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    return res.json({ bookings });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    return res.json({ booking });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const updates = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    return res.json({ message: 'Booking updated', booking });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    return res.json({ message: 'Booking deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    booking.paymentStatus = 'cancelled';
    await booking.save();

    try {
      await sendBookingCancelled(booking);
    } catch (mailErr) {
      console.warn('Mail send failed:', mailErr.message);
      return res.json({ message: 'Booking cancelled but failed to send email', booking });
    }

    return res.json({ message: 'Booking cancelled and email sent', booking });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
