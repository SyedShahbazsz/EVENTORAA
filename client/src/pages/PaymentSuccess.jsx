import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 10000); // Redirect after 10 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl p-10 text-center border-t-8 border-green-500">

        {/* Success Icon */}
        <FaCheckCircle className="text-green-500 text-7xl mx-auto mb-6" />

        {/* Heading */}
        <h1 className="text-4xl font-black text-gray-900 mb-4">
          Payment Successful!
        </h1>

        {/* Message */}
        <p className="text-gray-600 text-lg leading-relaxed mb-2">
          Your payment has been verified successfully.
        </p>

        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          Your event booking has been confirmed and a confirmation email has
          been sent to your registered email address.
        </p>

        {/* Auto Redirect Message */}
        <p className="text-sm text-gray-500 mb-8">
          You will be redirected to the Home page in
          <span className="font-bold text-gray-800"> 10 seconds</span>.
        </p>

        {/* Buttons */}
        <div className="space-y-4">

          <Link
            to="/dashboard"
            className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition duration-300"
          >
            View My Bookings
          </Link>

          <Link
            to="/"
            className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-xl transition duration-300"
          >
            Explore More Events
          </Link>

        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
