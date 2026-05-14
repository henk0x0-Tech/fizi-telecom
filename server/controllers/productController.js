import Product from '../models/Product.js';
import { isDatabaseConnected } from '../utils/database.js';

const defaultProducts = [
  // Networking Equipment
  { id: 'ne1', name: 'Wi-Fi Router', category: 'Networking Equipment', description: 'Dual-band gigabit router for reliable wireless networking.', price: 120, currency: 'USD', availability: 'In Stock' },
  { id: 'ne2', name: 'Network Switch', category: 'Networking Equipment', description: '24-port Gigabit Ethernet switch for high-speed local networks.', price: 150, currency: 'USD', availability: 'In Stock' },
  { id: 'ne3', name: 'Modem', category: 'Networking Equipment', description: 'High-speed broadband modem for reliable internet connection.', price: 90, currency: 'USD', availability: 'In Stock' },
  { id: 'ne4', name: 'Ethernet Cable', category: 'Networking Equipment', description: 'Cat6 Ethernet cable for stable wired network connections.', price: 15, currency: 'USD', availability: 'In Stock' },
  { id: 'ne5', name: 'Wi-Fi Range Extender', category: 'Networking Equipment', description: 'Boosts Wi-Fi signal to eliminate dead zones.', price: 45, currency: 'USD', availability: 'In Stock' },
  { id: 'ne6', name: 'Access Point', category: 'Networking Equipment', description: 'Enterprise-grade wireless access point for large coverage.', price: 200, currency: 'USD', availability: 'In Stock' },
  { id: 'ne7', name: 'USB Wi-Fi Adapter', category: 'Networking Equipment', description: 'Compact wireless adapter for desktop and laptop connectivity.', price: 25, currency: 'USD', availability: 'In Stock' },
  { id: 'ne8', name: 'Patch Panel', category: 'Networking Equipment', description: '24-port blank patch panel for rack-mount cable management.', price: 60, currency: 'USD', availability: 'In Stock' },
  { id: 'ne9', name: 'LAN Tester', category: 'Networking Equipment', description: 'Network cable tester for RJ45/RJ11 diagnostics.', price: 35, currency: 'USD', availability: 'In Stock' },
  { id: 'ne10', name: 'Network Rack', category: 'Networking Equipment', description: 'Wall-mounted 12U equipment rack for organizing network gear.', price: 180, currency: 'USD', availability: 'In Stock' },

  // Infrastructure
  { id: 'in1', name: 'UPS Power Backup', category: 'Infrastructure', description: 'Uninterruptible power supply to protect against outages.', price: 250, currency: 'USD', availability: 'In Stock' },
  { id: 'in2', name: 'Server Rack Cabinet', category: 'Infrastructure', description: '42U standard data rack cabinet for servers and networking.', price: 800, currency: 'USD', availability: 'In Stock' },
  { id: 'in3', name: 'Power Distribution Unit (PDU)', category: 'Infrastructure', description: 'Rack-mount PDU for reliable power delivery to equipment.', price: 110, currency: 'USD', availability: 'In Stock' },
  { id: 'in4', name: 'Desktop Workstation', category: 'Infrastructure', description: 'High-performance workstation for professional infrastructure management.', price: 1200, currency: 'USD', availability: 'In Stock' },
  { id: 'in5', name: 'Basic Server System', category: 'Infrastructure', description: 'Entry-level tower server for small business file storage.', price: 950, currency: 'USD', availability: 'In Stock' },
  { id: 'in6', name: 'NAS Storage Device', category: 'Infrastructure', description: 'Network-attached storage enclosure for scalable data backup.', price: 400, currency: 'USD', availability: 'In Stock' },
  { id: 'in7', name: 'External Hard Drive', category: 'Infrastructure', description: '4TB portable external drive for quick localized backups.', price: 120, currency: 'USD', availability: 'In Stock' },
  { id: 'in8', name: 'Backup Battery Unit', category: 'Infrastructure', description: 'Extended run battery pack for critical infrastructure UPS.', price: 300, currency: 'USD', availability: 'In Stock' },
  { id: 'in9', name: 'Cooling Unit', category: 'Infrastructure', description: 'Rack-mount ventilation system for temperature regulation.', price: 150, currency: 'USD', availability: 'In Stock' },
  { id: 'in10', name: 'Cable Management Tray', category: 'Infrastructure', description: 'Horizontal rack organizer to maintain clean cabling.', price: 40, currency: 'USD', availability: 'In Stock' },

  // Security
  { id: 'se1', name: 'CCTV Camera', category: 'Security', description: '1080p IP bullet camera with night vision and weatherproofing.', price: 85, currency: 'USD', availability: 'In Stock' },
  { id: 'se2', name: 'DVR/NVR Recorder', category: 'Security', description: '8-channel network video recorder for continuous monitoring.', price: 220, currency: 'USD', availability: 'In Stock' },
  { id: 'se3', name: 'Biometric Attendance Device', category: 'Security', description: 'Fingerprint and RFID time attendance terminal.', price: 150, currency: 'USD', availability: 'In Stock' },
  { id: 'se4', name: 'Door Access Control', category: 'Security', description: 'Electronic magnetic lock system with keypad entry.', price: 180, currency: 'USD', availability: 'In Stock' },
  { id: 'se5', name: 'Motion Sensor', category: 'Security', description: 'PIR motion detector for intrusion alarm systems.', price: 30, currency: 'USD', availability: 'In Stock' },
  { id: 'se6', name: 'Video Doorbell', category: 'Security', description: 'Smart doorbell camera with two-way audio communication.', price: 110, currency: 'USD', availability: 'In Stock' },
  { id: 'se7', name: 'Smoke Detector', category: 'Security', description: 'Photoelectric smoke alarm for early fire detection.', price: 45, currency: 'USD', availability: 'In Stock' },
  { id: 'se8', name: 'Alarm System', category: 'Security', description: 'Complete wireless home and office security alarm kit.', price: 200, currency: 'USD', availability: 'In Stock' },
  { id: 'se9', name: 'Fingerprint Scanner', category: 'Security', description: 'USB biometric scanner for secure workstation login.', price: 65, currency: 'USD', availability: 'In Stock' },
  { id: 'se10', name: 'Security Monitor', category: 'Security', description: '24-inch LED monitor optimized for surveillance display.', price: 140, currency: 'USD', availability: 'In Stock' },

  // Computing Hardware
  { id: 'ch1', name: 'Desktop Computer', category: 'Computing Hardware', description: 'Reliable office desktop PC for everyday business tasks.', price: 600, currency: 'USD', availability: 'In Stock' },
  { id: 'ch2', name: 'Laptop', category: 'Computing Hardware', description: 'Lightweight business laptop with all-day battery life.', price: 850, currency: 'USD', availability: 'In Stock' },
  { id: 'ch3', name: 'Keyboard', category: 'Computing Hardware', description: 'Ergonomic wired keyboard for comfortable typing.', price: 30, currency: 'USD', availability: 'In Stock' },
  { id: 'ch4', name: 'Mouse', category: 'Computing Hardware', description: 'Optical wireless mouse with adjustable DPI settings.', price: 25, currency: 'USD', availability: 'In Stock' },
  { id: 'ch5', name: 'Monitor', category: 'Computing Hardware', description: '27-inch IPS display for crisp visuals and productivity.', price: 180, currency: 'USD', availability: 'In Stock' },
  { id: 'ch6', name: 'SSD Drive', category: 'Computing Hardware', description: '1TB NVMe solid-state drive for rapid system boot times.', price: 95, currency: 'USD', availability: 'In Stock' },
  { id: 'ch7', name: 'HDD Drive', category: 'Computing Hardware', description: '2TB internal hard drive for mass data storage.', price: 60, currency: 'USD', availability: 'In Stock' },
  { id: 'ch8', name: 'RAM Module', category: 'Computing Hardware', description: '16GB DDR4 memory stick for improved multitasking.', price: 55, currency: 'USD', availability: 'In Stock' },
  { id: 'ch9', name: 'CPU Cooler', category: 'Computing Hardware', description: 'High-efficiency air cooler for processor temperature control.', price: 40, currency: 'USD', availability: 'In Stock' },
  { id: 'ch10', name: 'Webcam', category: 'Computing Hardware', description: '1080p HD webcam with built-in noise-reducing microphone.', price: 50, currency: 'USD', availability: 'In Stock' },

  // Smart Devices
  { id: 'sd1', name: 'Smart Plug', category: 'Smart Devices', description: 'Wi-Fi enabled outlet for remote power control and scheduling.', price: 20, currency: 'USD', availability: 'In Stock' },
  { id: 'sd2', name: 'Smart Bulb', category: 'Smart Devices', description: 'Color-changing LED bulb compatible with voice assistants.', price: 25, currency: 'USD', availability: 'In Stock' },
  { id: 'sd3', name: 'Smart Watch', category: 'Smart Devices', description: 'Fitness tracker and notification watch for active lifestyles.', price: 150, currency: 'USD', availability: 'In Stock' },
  { id: 'sd4', name: 'Bluetooth Speaker', category: 'Smart Devices', description: 'Portable wireless speaker with deep bass and waterproof design.', price: 60, currency: 'USD', availability: 'In Stock' },
  { id: 'sd5', name: 'Smart Remote', category: 'Smart Devices', description: 'Universal IR remote to control appliances from your smartphone.', price: 35, currency: 'USD', availability: 'In Stock' },
  { id: 'sd6', name: 'Smart LED Strip', category: 'Smart Devices', description: '16ft RGB lighting strip for ambient room decoration.', price: 30, currency: 'USD', availability: 'In Stock' },
  { id: 'sd7', name: 'Smart Power Strip', category: 'Smart Devices', description: 'Surge protector with individually controllable smart outlets.', price: 45, currency: 'USD', availability: 'In Stock' },
  { id: 'sd8', name: 'Smart Clock', category: 'Smart Devices', description: 'Bedside clock with voice assistant and ambient display.', price: 70, currency: 'USD', availability: 'In Stock' },
  { id: 'sd9', name: 'Door Sensor', category: 'Smart Devices', description: 'Magnetic contact sensor to monitor door and window status.', price: 20, currency: 'USD', availability: 'In Stock' },
  { id: 'sd10', name: 'Temperature Sensor', category: 'Smart Devices', description: 'Wireless monitor for indoor climate tracking and automation.', price: 25, currency: 'USD', availability: 'In Stock' }
];

export const getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;
    let products = defaultProducts;
    
    if (isDatabaseConnected()) {
      const query = category ? { category } : {};
      const dbProducts = await Product.find(query);
      if (dbProducts.length > 0) {
        products = dbProducts;
      }
    }
    
    if (category) {
      products = products.filter(p => p.category === category);
    }
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: 'Database unavailable. Start MongoDB before viewing product details.' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: 'Database unavailable. Start MongoDB before creating products.' });
    }

    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: 'Database unavailable. Start MongoDB before updating products.' });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: 'Database unavailable. Start MongoDB before deleting products.' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
