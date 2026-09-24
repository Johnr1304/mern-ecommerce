const Contact = require("../models/contact");

const createContact = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name?.trim() || !/^\S+@\S+\.\S+$/.test(email || "") || !message?.trim() || message.trim().length < 10) {
      return res.status(400).json({ success: false, message: "Please provide a valid name, email, and message of at least 10 characters" });
    }
    const contact = await Contact.create({ name, email, message });
    res.status(201).json({ success: true, message: "Your message was submitted successfully", contactId: contact._id });
  } catch (error) {
    next(error);
  }
};

module.exports = { createContact };
