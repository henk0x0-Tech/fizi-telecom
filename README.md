# Fizi Telecom - Professional Company Profile

A modern, full-stack web application for Fizi Telecom's company profile, services, and products showcase.

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Styling**: CSS3 + Modern Design

## Project Structure

```
fizi-telecom/
├── server/                 # Node.js/Express backend
│   ├── controllers/        # Business logic
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── index.js           # Server entry point
│   └── package.json
├── client/                # React frontend with Vite
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── assets/        # Images, fonts, etc.
│   │   ├── App.jsx        # Main App component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
├── .env.example           # Environment variables template
└── package.json           # Root workspace config
```

## Installation & Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB (local or cloud)

### 1. Clone & Install Dependencies

```bash
# Install all dependencies (root, server, and client)
npm install
# OR
npm run install-all
```

### 2. Environment Configuration

```bash
# Copy .env.example to .env
cp .env.example .env

# Update .env with your configuration:
# - MongoDB connection string
# - Server port
# - API URL for frontend
```

### 3. Start MongoDB

```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (update MONGODB_URI in .env)
```

### 4. Run Development Servers

**Option A: Run both servers concurrently**
```bash
npm run dev
```

**Option B: Run separately in different terminals**
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

### 5. Access the Application

- **Frontend**: http://localhost:5173 (Vite default)
- **Backend API**: http://localhost:5000/api

## Available Scripts

### Root Level
- `npm run dev` - Run server and client concurrently
- `npm run server` - Run backend only
- `npm run client` - Run frontend only
- `npm run build` - Build both server and client
- `npm start` - Start production server
- `npm run install-all` - Install all dependencies

### Server Only (in `/server`)
- `npm run dev` - Start dev server with nodemon
- `npm run build` - Build for production
- `npm start` - Start production server

### Client Only (in `/client`)
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## API Endpoints

### Company Information
- `GET /api/company/profile` - Get company profile
- `GET /api/company/services` - Get all services
- `GET /api/company/products` - Get all products

### Testimonials & Case Studies
- `GET /api/testimonials` - Get customer testimonials
- `GET /api/case-studies` - Get case studies

### Contact & Inquiries
- `POST /api/contact` - Submit contact form
- `POST /api/inquiries/service` - Request service information
- `POST /api/inquiries/consultation` - Book consultation

## Features

- ✅ Company Profile & Branding
- ✅ Services Showcase
- ✅ Products Catalog
- ✅ Testimonials & Case Studies
- ✅ Contact Forms
- ✅ Blog/News Management
- ✅ Admin Dashboard (planned)
- ✅ Responsive Design
- ✅ API Documentation

## Database Models (MongoDB)

### Company
- Profile information
- Mission, Vision, Values
- Competitive advantages

### Services
- Service details
- Pricing information
- Case studies

### Products
- Product catalog
- Specifications
- Pricing

### Contacts/Inquiries
- Form submissions
- Consultation requests
- Lead tracking

## Development Guidelines

### Code Style
- Use ES6+ syntax
- Functional components in React
- Clear, descriptive variable names
- Consistent indentation (2 spaces)

### Component Structure
```jsx
// Functional component with hooks
export default function ComponentName() {
  return (
    <div className="component">
      {/* JSX content */}
    </div>
  );
}
```

### API Request Example
```javascript
// In React components
import { useEffect, useState } from 'react';

export default function MyComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/endpoint')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{/* Render data */}</div>;
}
```

## Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the dist/ folder
```

### Backend (Heroku/Railway)
```bash
npm run build
npm start
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| MONGODB_URI | Database connection | mongodb://localhost:27017/fizi |
| SERVER_PORT | Backend port | 5000 |
| NODE_ENV | Environment | development/production |
| VITE_API_URL | Backend API URL | http://localhost:5000/api |

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in .env
SERVER_PORT=5001
```

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in .env
- Verify network access (if using Atlas)

### CORS Issues
- Backend CORS is configured for http://localhost:5173
- Update for production in server/index.js

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

© 2024 Fizi Telecom. All rights reserved.

## Support

For questions or issues, contact: support@fiziservices.com

---

**Next Steps:**
- Set up MongoDB
- Configure `.env` file
- Run `npm run dev`
- Start building!
