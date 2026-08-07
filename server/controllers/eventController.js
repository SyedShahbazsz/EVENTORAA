const Event = require("../models/Event.js");

// ==============================
// Get All Events
// ==============================
exports.getEvents = async (req, res) => {
  try {
    const filters = {};

    if (req.query.category) {
      filters.category = req.query.category;
    }

    if (req.query.search) {
      filters.title = {
        $regex: req.query.search,
        $options: "i",
      };
    }

    const events = await Event.find(filters).populate(
      "createdBy",
      "name email"
    );

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ==============================
// Get Single Event
// ==============================
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ==============================
// Create Event
// ==============================
exports.createEvent = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("==============");
    console.log(req.file);
    console.log("==============");

    const {
      title,
      description,
      date,
      location,
      category,
      totalSeats,
      ticketPrice,
    } = req.body;

    let media = "";
    let mediaType = "image";

    if (req.file) {
      media = `/uploads/${req.file.filename}`;

      if (req.file.mimetype.startsWith("video")) {
        mediaType = "video";
      } else {
        mediaType = "image";
      }
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      category,
      totalSeats: Number(totalSeats),
      availableSeats: Number(totalSeats),
      ticketPrice: Number(ticketPrice) || 0,
      media,
      mediaType,
      createdBy: req.user._id,
    });

    res.status(201).json(event);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ==============================
// Update Event
// ==============================
exports.updateEvent = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
    };

    // Handle image/video upload
    if (req.file) {
      updateData.media = `/uploads/${req.file.filename}`;

      updateData.mediaType = req.file.mimetype.startsWith("video")
        ? "video"
        : "image";
    }

    if (updateData.totalSeats) {
      updateData.totalSeats = Number(updateData.totalSeats);
    }

    if (updateData.ticketPrice) {
      updateData.ticketPrice = Number(updateData.ticketPrice);
    }

    // Get existing event
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // Preserve booked seats
    if (updateData.totalSeats) {
      const bookedSeats = event.totalSeats - event.availableSeats;

      const newAvailableSeats =
        Number(updateData.totalSeats) - bookedSeats;

      if (newAvailableSeats < 0) {
        return res.status(400).json({
          message:
            "Total seats cannot be less than the number of already booked seats.",
        });
      }

      updateData.availableSeats = newAvailableSeats;
    }

    // Update fields
    Object.assign(event, updateData);

    await event.save();

    res.status(200).json(event);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ==============================
// Delete Event
// ==============================
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.status(200).json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};