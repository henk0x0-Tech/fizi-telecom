import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config({ path: '../.env' });

// Import routes
import companyRoutes from './routes/company.js';
import servicesRoutes from './routes/services.js';
import productsRoutes from './routes/products.js';
import contactRoutes from './routes/contact.js';

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    const isLocalDev = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
    const allowedOrigin = process.env.NODE_ENV === 'production'
      ? origin === process.env.CLIENT_URL
      : isLocalDev;

    return callback(allowedOrigin ? null : new Error('Not allowed by CORS'), allowedOrigin);
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Database Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fizi-telecom';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✓ MongoDB connected successfully');
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    console.warn('⚠ Running without MongoDB. Start MongoDB or set MONGODB_URI to enable database-backed APIs.');
  }
};

// Connect to Database
connectDB();

// API Routes
app.use('/api/company', companyRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/contact', contactRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Fizi Telecom API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║     FIZI TELECOM API SERVER STARTED           ║
╠════════════════════════════════════════════════╣
║  Server: http://localhost:${PORT}              ║
║  API: http://localhost:${PORT}/api             ║
║  Status: http://localhost:${PORT}/api/health   ║
║  Environment: ${process.env.NODE_ENV || 'development'}                ║
╚════════════════════════════════════════════════╝
  `);
});

export default app;
