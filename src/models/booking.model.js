const mongoose = require('mongoose');

const StopSchema = new mongoose.Schema({
  pickupLocation: { type: String, required: true },
  dropLocation: { type: String, required: true },
  vendor: { type: String, required: false },
  rideType: { type: String, enum: ['private', 'shared'], required: true },
  dateTime: { type: Date, required: true }
}, { _id: false });

const BookingSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  altPhone: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: false },
  bookingDate: { type: Date, default: Date.now },
  numberOfPeople: { type: Number, default: 1 },
  totalAmount: { type: Number, required: false },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
  orderStatus: { type: String, enum: ['order_received', 'offer_send', 'offer_rejected', 'order_confirm', 'vender_assigned', 'cancelled', 'pending', 'complete'], default: 'pending' },
  notes: { type: String },

  // 🆕 Array of stops
  stops: { type: [StopSchema], default: [] }

}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
