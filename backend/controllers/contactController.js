const Contact = require('../models/Contact');

// @desc    Create a contact message
// @route   POST /api/contact
const createContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    const contact = new Contact({
      name,
      email,
      phone,
      message
    });

    const createdContact = await contact.save();
    res.status(201).json(createdContact);
  } catch (error) {
    res.status(400).json({ message: 'Invalid contact data', error: error.message });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact/admin
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createContact,
  getContacts
};
