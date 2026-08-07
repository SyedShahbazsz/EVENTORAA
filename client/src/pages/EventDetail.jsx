import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axios.js";
import { AuthContext } from "../context/AuthContext.jsx";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChair,
  FaMoneyBillWave,
} from "react-icons/fa";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [bookingLoading, setBookingLoading] = useState(false);

  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
      } catch (err) {
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // ----------------------------
  // Load Razorpay
  // ----------------------------
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);

      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  // ----------------------------
  // Handle Payment
  // ----------------------------
  const handlePayment = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setError("");
    setSuccessMsg("");

    const loaded = await loadRazorpay();

    if (!loaded) {
      alert("Unable to load Razorpay");
      return;
    }

    try {
      const { data } = await api.post("/payment/create-order", {
        amount: event.ticketPrice,
      });

      const order = data.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: order.amount,

        currency: order.currency,

        name: "Eventora",

        description: event.title,

        order_id: order.id,

        handler: async function (response) {
          try {
            // Verify Payment
            await api.post("/payment/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // Send OTP
            await api.post("/booking/send-otp");

            // Show OTP Box
            setShowOTP(true);

            setSuccessMsg(
              "Payment Successful! OTP has been sent to your email.",
            );
          } catch (err) {
            console.log(err);

            setError(
              err.response?.data?.message || "Payment verification failed.",
            );
          }
        },

        prefill: {
          name: user?.name || "",

          email: user?.email || "",
        },

        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay using UPI",

                instruments: [
                  {
                    method: "upi",
                  },
                ],
              },

              other: {
                name: "Other Payment Methods",

                instruments: [
                  {
                    method: "card",
                  },

                  {
                    method: "netbanking",
                  },

                  {
                    method: "wallet",
                  },
                ],
              },
            },

            sequence: ["upi", "other"],

            preferences: {
              show_default_blocks: true,
            },
          },
        },

        theme: {
          color: "#111827",
        },
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.open();
    } catch (err) {
      console.log(err);

      alert("Unable to initiate payment.");
    }
  };

  // ------------------------------------
  // Verify OTP & Create Booking
  // ------------------------------------
  const handleBooking = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setBookingLoading(true);
    setError("");

    try {
      // Create Booking after OTP Verification
      await api.post("/booking", {
        eventId: event._id,
        otp,
      });

      // Reduce available seats locally
      setEvent((prev) => ({
        ...prev,
        availableSeats: prev.availableSeats - 1,
      }));

      setSuccessMsg("Booking Confirmed Successfully!");

      // Hide OTP Box
      setShowOTP(false);

      // Clear OTP
      setOtp("");

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/payment-success");
      }, 2000);
    } catch (err) {
      console.log(err);

      setError(err.response?.data?.message || "OTP verification failed.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 text-xl font-semibold">Loading...</div>
    );
  if (error && !event)
    return (
      <div className="text-center py-20 text-xl text-red-500">
        {error || "Event not found"}
      </div>
    );

  const isSoldOut = event.availableSeats <= 0;

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden mt-10">
      {event.media ? (
        event.mediaType === "video" ? (
          <video controls className="w-full h-80 object-cover bg-black">
            <source
              src={`http://localhost:5000${event.media}`}
              type={
                event.media.endsWith(".webm")
                  ? "video/webm"
                  : event.media.endsWith(".mov")
                    ? "video/quicktime"
                    : "video/mp4"
              }
            />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={`http://localhost:5000${event.media}`}
            alt={event.title}
            className="w-full h-80 object-cover"
          />
        )
      ) : (
        <div className="w-full h-80 bg-gray-900 flex items-center justify-center text-white/50 text-6xl font-black uppercase tracking-widest">
          {event.category}
        </div>
      )}

      <div className="p-8">
        <div className="grid md:grid-cols-[2fr_1fr] gap-8 items-start">
          <div>
            <div className="inline-block bg-gray-200 text-gray-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
              {event.category}
            </div>
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
              {event.title}
            </h1>
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              {event.description}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-5">
              Booking Details
            </h3>
            <p className="text-gray-500 text-sm mb-6 leading-6">
              Complete the payment securely using Razorpay. After successful
              payment, an OTP will be sent to your email to confirm your
              booking.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 text-gray-600">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 shrink-0">
                  <FaMoneyBillWave />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-400 uppercase">
                    Ticket Price
                  </p>
                  <p className="font-bold text-gray-800 text-lg">
                    {event.ticketPrice === 0 ? (
                      <span className="text-green-500">Free</span>
                    ) : (
                      `₹${event.ticketPrice}`
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-gray-600">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 shrink-0">
                  <FaChair />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-400 uppercase">
                    Availability
                  </p>
                  <p className="font-bold text-gray-800">
                    <span
                      className={
                        event.availableSeats < 10 ? "text-orange-500" : ""
                      }
                    >
                      {event.availableSeats}
                    </span>{" "}
                    / {event.totalSeats}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-gray-600">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 shrink-0">
                  <FaCalendarAlt />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-400 uppercase">
                    Date
                  </p>
                  <p className="font-bold text-gray-800">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-gray-600">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-900 shrink-0">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-400 uppercase">
                    Location
                  </p>
                  <p className="font-bold text-gray-800">{event.location}</p>
                </div>
              </div>
            </div>

            {showOTP && (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter the OTP sent to your registered email
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter 6-digit OTP"
                  className="w-full h-14 px-4 rounded-xl border border-gray-300 bg-white text-gray-800 placeholder:text-gray-400 text-base font-semibold text-center tracking-normal focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-gray-700"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                />
              </div>
            )}

            <button
              onClick={showOTP ? handleBooking : handlePayment}
              disabled={isSoldOut || bookingLoading || (showOTP && !otp)}
              className={`w-full py-3 px-6 rounded-xl font-bold text-lg transition shadow-lg ${
                isSoldOut
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-black text-white hover:shadow-xl hover:-translate-y-1"
              }`}
            >
              {bookingLoading
                ? "Processing..."
                : showOTP
                  ? "Verify OTP & Confirm"
                  : isSoldOut
                    ? "Sold Out"
                    : `Pay Now ₹${event.ticketPrice}`}
            </button>
            {error && (
              <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-4">
                <p className="text-center text-red-700 font-semibold">
                  ❌ {error}
                </p>
              </div>
            )}
            {successMsg && (
              <div className="mt-4 rounded-xl bg-green-50 border border-green-200 p-4">
                <p className="text-center text-green-700 font-semibold">
                  ✅ {successMsg}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
