import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Fizi Telecom',
    required: true
  },
  tagline: {
    type: String,
    default: 'Connecting Communities. Empowering Businesses. Building Tomorrow.'
  },
  description: String,
  vision: String,
  mission: String,
  logo: String,
  website: String,
  email: String,
  phone: String,
  address: String,
  founded: Number,
  employees: Number,
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Company', companySchema);
