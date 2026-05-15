import Contact from '../models/Contact.js';
import { isDatabaseConnected } from '../utils/database.js';

export const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, company, subject, message, inquiryType } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: 'Database unavailable. Please contact us on WhatsApp.' });
    }
    
    const contact = new Contact({
      name,
      email,
      phone,
      company,
      subject,
      message,
      inquiryType,
      status: 'New'
    });
    
    await contact.save();
    res.status(201).json({ 
      message: 'Contact form submitted successfully',
      contactId: contact._id 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getContacts = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.json([]);
    }

    const { status } = req.query;
    const query = status ? { status } : {};
    const contacts = await Contact.find(query).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateContactStatus = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: 'Database unavailable. Start MongoDB before updating contacts.' });
    }

    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
