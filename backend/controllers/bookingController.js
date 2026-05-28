const Booking = require('../models/Booking');
const Package = require('../models/Package');

// @desc    Create a new booking
// @route   POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { packageId, name, email, phone, travelDate, persons, message } = req.body;

    const pkg = await Package.findById(packageId);
    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' });
    }

    const booking = new Booking({
      userId: req.user._id,
      packageId,
      name,
      email,
      phone,
      travelDate,
      persons,
      message
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(400).json({ message: 'Invalid booking data', error: error.message });
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).populate('packageId', 'title image price');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings/admin
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('packageId', 'title').populate('userId', 'name email');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/admin/:id/status
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      booking.status = status;
      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid status data', error: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookings,
  updateBookingStatus
};
