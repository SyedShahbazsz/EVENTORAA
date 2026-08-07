import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/axios";

const UpdateEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    totalSeats: "",
    ticketPrice: "",
  });

  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const { data } = await api.get(`/events/${id}`);

      setFormData({
        title: data.title || "",
        description: data.description || "",
        date: data.date ? data.date.substring(0, 10) : "",
        location: data.location || "",
        category: data.category || "",
        totalSeats: data.totalSeats || "",
        ticketPrice: data.ticketPrice || "",
      });

      if (data.media) {
        setPreview(`http://localhost:5000${data.media}`);
      }
    } catch (err) {
      alert("Unable to load event.");
      navigate("/admin");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (media) {
        data.append("image", media);
      }

      await api.put(`/events/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Event updated successfully.");

      navigate("/admin");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-xl font-bold">Loading...</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-6 px-5">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
        Update Event
      </h1>

      <form
        onSubmit={handleUpdate}
        className="bg-white rounded-xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          required
        />

        <input
          type="text"
          placeholder="Category"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          required
        />

        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-full border border-gray-300 bg-white text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          required
        />

        <input
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          className="w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          required
        />

        <input
          type="number"
          placeholder="Seats"
          value={formData.totalSeats}
          onChange={(e) =>
            setFormData({ ...formData, totalSeats: e.target.value })
          }
          className="w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          required
        />

        <input
          type="number"
          placeholder="Ticket Price"
          value={formData.ticketPrice}
          onChange={(e) =>
            setFormData({ ...formData, ticketPrice: e.target.value })
          }
          className="w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          required
        />

        <div className="md:col-span-2">
          {preview && (
            <img
              src={preview}
              alt="Event"
              className="h-60 rounded-lg border object-cover mb-4"
            />
          )}

          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => {
              setMedia(e.target.files[0]);

              if (e.target.files[0]) {
                setPreview(URL.createObjectURL(e.target.files[0]));
              }
            }}
            className="w-full border border-gray-300 bg-white text-gray-900 file:bg-indigo-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-md file:mr-4 rounded-lg px-4 py-3 cursor-pointer"
          />
        </div>

        <textarea
          rows={5}
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-lg px-4 py-3 md:col-span-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
          required
        />

        <div className="md:col-span-2 flex gap-4">
          <button
            type="submit"
            className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-900"
          >
            Update Event
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="border px-8 py-3 rounded-lg font-bold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEvent;
