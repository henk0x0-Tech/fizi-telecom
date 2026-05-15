import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: String,
  company: String,
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  inquiryType: {
    type: String,
    enum: [
      'Service Inquiry',
      'Product Information',
      'Consultation',
      'Partnership',
      'Support',
      'Other'
    ]
  },
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Resolved', 'Closed'],
    default: 'New'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Contact', contactSchema);
