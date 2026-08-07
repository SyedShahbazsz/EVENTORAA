import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../utils/axios.js";
import { Link, useNavigate } from "react-router-dom";
import { FaTicketAlt, FaTimesCircle } from "react-icons/fa";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      console.log("Fetching bookings...");

      const response = await api.get("/booking/my");

      console.log("Success:", response);

      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings");
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);
      console.error("URL:", error.config?.baseURL + error.config?.url);
    } finally {
      setLoading(false);
    }
  };
  // const fetchBookings = async () => {
  //     try {
  //         const { data } = await api.get('/booking/my');
  //         setBookings(data);
  //     } catch (error) {
  //         console.error('Error fetching bookings', error);
  //     } finally {
  //         setLoading(false);
  //     }
  // };

  const cancelBooking = async (id) => {
    if (
      window.confirm("Are you sure you want to cancel this booking request?")
    ) {
      try {
        await api.delete(`/booking/${id}`);
        fetchBookings();
      } catch (error) {
        alert(error.response?.data?.message || "Error cancelling booking");
      }
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Loading dashboard...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto mt-6 px-4">
      {/* Dashboard Header */}
      <div className="bg-black text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-lg">
        <div className="flex flex-col md:flex-row items-center md:items-center gap-6">
          {/* Profile Circle */}
          <div className="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center text-5xl font-bold uppercase shrink-0">
            {user?.name?.charAt(0)}
          </div>

          {/* Welcome Text */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
              Welcome back,
              <span className="text-white"> {user?.name}</span>
            </h2>

            <p className="text-gray-400 text-xl mt-3">
              Manage your bookings and view your event history.
            </p>
          </div>
        </div>
      </div>

      {/* Booking Heading */}
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-bold">
            {bookings.length}
          </span>
          <FaTicketAlt className="text-gray-700" />
          My Booking Requests
        </h2>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTicketAlt className="text-gray-300 text-3xl" />
          </div>
          <p className="text-xl text-gray-500 mb-6 mt-4 font-medium">
            You haven't booked any events yet.
          </p>
          <Link
            to="/"
            className="inline-block bg-gray-900 hover:bg-black text-white font-bold py-3 px-8 rounded-lg transition shadow-md"
          >
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col"
            >
              <div className="p-6 border-b border-gray-50 grow">
                {booking.eventId ? (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">
                        {booking.eventId.title}
                      </h3>
                      <div className="flex flex-col gap-1 items-end">
                        <span
                          className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : booking.status === "cancelled"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {booking.status}
                        </span>
                        {booking.status !== "cancelled" && (
                          <span
                            className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ${
                              booking.paymentStatus === "paid"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {booking.paymentStatus.replace("_", " ")}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-4 space-y-1">
                      <p>
                        <strong className="text-gray-700">Date:</strong>{" "}
                        {new Date(booking.eventId.date).toLocaleDateString()}
                      </p>
                      <p>
                        <strong className="text-gray-700">Amount:</strong>{" "}
                        {booking.amount === 0 ? "Free" : `₹${booking.amount}`}
                      </p>
                      <p>
                        <strong className="text-gray-700">Requested:</strong>{" "}
                        {new Date(booking.bookedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-red-500 italic">
                    Event details unavailable (might have been deleted)
                  </p>
                )}
              </div>
              <div className="p-4 bg-gray-50 flex justify-between items-center shrink-0">
                {booking.eventId && booking.status !== "cancelled" ? (
                  <>
                    <Link
                      to={`/events/${booking.eventId._id}`}
                      className="text-gray-900 font-semibold text-sm hover:underline"
                    >
                      View Event
                    </Link>
                    <button
                      onClick={() => cancelBooking(booking._id)}
                      className="text-red-500 font-semibold text-sm hover:text-red-700 transition flex items-center gap-1"
                    >
                      <FaTimesCircle /> Cancel
                    </button>
                  </>
                ) : (
                  <div className="w-full text-center text-sm text-gray-500 italic">
                    Booking Cancelled
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
