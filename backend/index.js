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
import uploadRoutes from './routes/upload.js';
import authRoutes from './routes/auth.js';
import siteContentRoutes from './routes/siteContent.js';
import plansRoutes from './routes/plans.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import path from 'path';

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

// Middleware
const allowedOrigins = [
  /^http:\/\/(localhost|127\.0\.0\.1):\d+$/,   // any localhost port (dev)
  process.env.CLIENT_URL,                        // e.g. https://fizitelecom.netlify.app
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);
    const allowed = allowedOrigins.some(o =>
      o instanceof RegExp ? o.test(origin) : o === origin
    );
    return callback(allowed ? null : new Error(`CORS: origin ${origin} not allowed`), allowed);
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security Middleware
// Set security HTTP headers
app.use(helmet());
// Prevent NoSQL injection
app.use(mongoSanitize());
// Prevent XSS attacks
app.use(xss());
// Prevent HTTP Param Pollution
app.use(hpp());

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

// Rate limiting — protect auth endpoint from brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { error: 'Too many login attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/site-content', siteContentRoutes);
app.use('/api/plans', plansRoutes);

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

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
