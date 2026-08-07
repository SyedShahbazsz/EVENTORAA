const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    // User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Event
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    // Booking Status
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },

    // Payment Status
    paymentStatus: {
      type: String,
      enum: ["paid", "not_paid"],
      default: "not_paid",
    },

    // Ticket Amount
    amount: {
      type: Number,
      required: true,
    },

    // Razorpay Order ID
    orderId: {
      type: String,
      default: "",
    },

    // Razorpay Payment ID
    paymentId: {
      type: String,
      default: "",
    },

    // Payment Method
    paymentMethod: {
      type: String,
      default: "Razorpay",
    },

    // Booking Date
    bookedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
