import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: [
      'Connectivity',
      'Enterprise Networking',
      'IT Infrastructure',
      'Security',
      'WiFi & Smart Solutions',
      'Support & Maintenance'
    ]
  },
  description: {
    type: String,
    required: true
  },
  longDescription: String,
  features: [String],
  pricing: {
    startingPrice: Number,
    unit: String // per month, per project, etc.
  },
  icon: String,
  image: String,
  sla: String, // Service Level Agreement
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Service', serviceSchema);
