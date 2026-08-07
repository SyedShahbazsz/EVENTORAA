const express = require("express");
const router = express.Router();

const {
  createOrder,
  verifyPayment,
} = require("../controllers/paymentController");

const { protect } = require("../middleware/auth");

// Create Razorpay Order
router.post("/create-order", protect, createOrder);


// Verify Payment
router.post("/verify-payment", protect, verifyPayment);

module.exports = router;