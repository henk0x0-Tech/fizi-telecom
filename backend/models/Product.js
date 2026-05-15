import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: [
      'Networking Equipment',
      'Infrastructure',
      'Security',
      'Computing Hardware',
      'Smart Devices'
    ]
  },
  description: {
    type: String,
    required: true
  },
  specifications: {
    type: Map,
    of: String
  },
  price: Number,
  currency: {
    type: String,
    default: 'USD'
  },
  image: String,
  manufacturer: String,
  warranty: String,
  availability: {
    type: String,
    enum: ['In Stock', 'Pre-order', 'Out of Stock'],
    default: 'In Stock'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Product', productSchema);
