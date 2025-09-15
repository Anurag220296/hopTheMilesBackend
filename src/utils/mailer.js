const nodemailer = require('nodemailer');

let transporter;

function initTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  transporter.verify()
    .then(() => console.log('✅ Gmail transporter ready'))
    .catch(err => console.warn('⚠️ Gmail transporter error:', err.message));

  return transporter;
}

async function sendMail({ to, subject, html, text }) {
  initTransporter();
  return transporter.sendMail({
    from: `"HopTheMiles" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
    text
  });
}

function formatStopsHtml(stops = []) {
  if (!stops.length) return '<p>No stops added</p>';
  return `
    <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse">
      <tr>
        <th>Pickup</th>
        <th>Drop</th>
        <th>Ride Type</th>
        <th>Date & Time</th>
      </tr>
      ${stops.map(s => `
        <tr>
          <td>${s.pickupLocation}</td>
          <td>${s.dropLocation}</td>
          <td>${s.rideType}</td>
          <td>${new Date(s.dateTime).toLocaleString()}</td>
        </tr>
      `).join('')}
    </table>
  `;
}

async function sendBookingConfirmation(booking) {
  const stopsHtml = formatStopsHtml(booking.stops);

  const html = `
    <h2>📌 New Booking Received — HopTheMiles</h2>

    <p>Please process this booking as soon as possible.</p>

    <h3>Customer Details</h3>
    <ul>
      <li><strong>Name:</strong> ${booking.firstName} ${booking.lastName}</li>
      <li><strong>Email:</strong> ${booking.email}</li>
      <li><strong>Phone:</strong> ${booking.phone || "—"}</li>
      <li><strong>Alt Phone:</strong> ${booking.altPhone || "—"}</li>
    </ul>

    <h3>Booking Details</h3>
    <ul>
      <li><strong>Booking ID:</strong> ${booking._id}</li>
      <li><strong>Booking Date:</strong> ${new Date(booking.bookingDate).toLocaleString()}</li>
      <li><strong>Total Amount:</strong> ₹${booking.totalAmount}</li>
      <li><strong>Number of People:</strong> ${booking.numberOfPeople}</li>
      <li><strong>Payment Status:</strong> ${booking.paymentStatus}</li>
      <li><strong>Order Status:</strong> ${booking.orderStatus}</li>
      <li><strong>Notes:</strong> ${booking.notes || "—"}</li>
    </ul>

    <h3>Stops</h3>
    ${stopsHtml}

    <hr>
    <p>— HopTheMiles Booking System</p>
  `;

  const text = `Booking confirmed.`;

  return sendMail({
    to: "info@hopthemiles.com",
    subject: `Booking Confirmation — ${booking._id}`,
    html,
    text
  });
}

async function sendBookingCancelled(booking) {
  const html = `
    <h2>Booking Cancelled — HopTheMiles</h2>
    <p>Booking <strong>${booking._id}</strong> has been cancelled.</p>
  `;

  const text = `Booking ${booking._id} cancelled.`;

  return sendMail({
    to: "info@hopthemiles.com",
    subject: `Booking Cancelled — ${booking._id}`,
    html,
    text
  });
}

module.exports = {
  sendBookingConfirmation,
  sendBookingCancelled
};
