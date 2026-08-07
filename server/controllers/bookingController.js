const Booking = require("../models/Booking");
const Event = require("../models/Event");
const OTP = require("../models/OTP");
const { sendBookingEmail, sendOTPEmail } = require("../utils/email");

// ========================================
// Generate 6-digit OTP
// ========================================
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ========================================
// Send Booking OTP
// ========================================
exports.sendBookingOTP = async (req, res) => {
  try {
    const otp = generateOTP();

    // Remove old OTP if exists
    await OTP.findOneAndDelete({
      email: req.user.email,
      action: "event_booking",
    });

    // Save new OTP
    await OTP.create({
      email: req.user.email,
      otp,
      action: "event_booking",
    });

    // Send OTP Email
    await sendOTPEmail(req.user.email, otp, "event_booking");

    res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to send OTP.",
    });
  }
};

// ========================================
// Book Event (After Payment + OTP)
// ========================================
exports.bookEvent = async (req, res) => {
  try {
    const { eventId, otp } = req.body;

    if (!eventId || !otp) {
      return res.status(400).json({
        success: false,
        message: "Event ID and OTP are required.",
      });
    }

    // Verify OTP
    const validOTP = await OTP.findOne({
      email: req.user.email,
      otp,
      action: "event_booking",
    });

    if (!validOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid or Expired OTP.",
      });
    }

    // Delete OTP after successful verification
    await OTP.deleteOne({ _id: validOTP._id });

    // Find Event
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    // Seat Check
    if (event.availableSeats <= 0) {
      return res.status(400).json({
        success: false,
        message: "No seats available.",
      });
    }

    // Duplicate Booking Check
    const existingBooking = await Booking.findOne({
      userId: req.user.id,
      eventId,
      status: { $ne: "cancelled" },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "You have already booked this event.",
      });
    }

    // Create Booking
    const booking = await Booking.create({
      userId: req.user.id,
      eventId,
      status: "confirmed",
      paymentStatus: "paid",
      amount: event.ticketPrice,
    });

    // Reduce Seat
    event.availableSeats -= 1;
    await event.save();

    // Send Confirmation Email
    await sendBookingEmail(
      req.user.email,
      req.user.name,
      event.title
    );

    res.status(201).json({
      success: true,
      message: "Booking Confirmed Successfully.",
      booking,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};

// ========================================
// Admin Confirm Booking
// ========================================
exports.confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("userId")
      .populate("eventId");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (booking.status === "confirmed") {
      return res.status(400).json({
        success: false,
        message: "Booking already confirmed.",
      });
    }

    booking.status = "confirmed";

    if (req.body.paymentStatus) {
      booking.paymentStatus = req.body.paymentStatus;
    }

    await booking.save();

    await sendBookingEmail(
      booking.userId.email,
      booking.userId.name,
      booking.eventId.title
    );

    res.status(200).json({
      success: true,
      message: "Booking confirmed successfully.",
      booking,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};

// ========================================
// Get My Bookings
// ========================================
exports.getMyBookings = async (req, res) => {
  try {
    let bookings;

    if (req.user.role === "admin") {
      bookings = await Booking.find()
        .populate("eventId")
        .populate("userId", "name email")
        .sort({ createdAt: -1 });
    } else {
      bookings = await Booking.find({
        userId: req.user.id,
      })
        .populate("eventId")
        .sort({ createdAt: -1 });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};

// ========================================
// Cancel Booking
// ========================================
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (
      booking.userId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized.",
      });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking already cancelled.",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    const event = await Event.findById(booking.eventId);

    if (event) {
      event.availableSeats += 1;
      await event.save();
    }

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error.",
    });
  }
};
