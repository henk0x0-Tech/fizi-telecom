import Product from '../models/Product.js';
import { isDatabaseConnected } from '../utils/database.js';

const defaultProducts = [
  // Laptops
  { id: 'l1', name: 'HP Spectre x360', brand: 'HP', category: 'Laptops', image: '/images/8.jpeg', description: 'Versatile 2-in-1 premium laptop with long battery life.', price: 1399, currency: 'USD', availability: 'In Stock' },
  { id: 'l2', name: 'Dell XPS 15', brand: 'Dell', category: 'Laptops', image: '/images/9.jpeg', description: 'Powerful creator laptop with stunning 4K OLED display.', price: 1899, currency: 'USD', availability: 'In Stock' },
  { id: 'l3', name: 'Lenovo ThinkPad X1 Carbon', brand: 'Lenovo', category: 'Laptops', image: '/images/10.jpeg', description: 'Ultralight business laptop with legendary keyboard.', price: 1599, currency: 'USD', availability: 'In Stock' },
  { id: 'l4', name: 'MacBook Pro 16" M3', brand: 'Apple', category: 'Laptops', image: '/images/11.jpeg', description: 'Ultimate performance for professionals and creatives.', price: 2499, currency: 'USD', availability: 'Low Stock' },
  { id: 'l5', name: 'Asus ROG Zephyrus G14', brand: 'Asus', category: 'Laptops', image: '/images/7.jpeg', description: 'Compact gaming and high-performance computing laptop.', price: 1499, currency: 'USD', availability: 'In Stock' },

  // Desktops
  { id: 'd1', name: 'HP EliteDesk 800', brand: 'HP', category: 'Desktops', image: '/images/2.jpeg', description: 'Secure and manageable enterprise tower PC.', price: 850, currency: 'USD', availability: 'In Stock' },
  { id: 'd2', name: 'Dell OptiPlex 7000 Micro', brand: 'Dell', category: 'Desktops', image: '/images/3.jpeg', description: 'Ultra-compact desktop engineered for secure performance.', price: 799, currency: 'USD', availability: 'In Stock' },
  { id: 'd3', name: 'Apple iMac 24"', brand: 'Apple', category: 'Desktops', image: '/images/4.jpeg', description: 'All-in-one desktop with striking design and M3 chip.', price: 1299, currency: 'USD', availability: 'In Stock' },
  { id: 'd4', name: 'Lenovo ThinkCentre M90a', brand: 'Lenovo', category: 'Desktops', image: '/images/5.jpeg', description: 'Premium all-in-one desktop for the modern workspace.', price: 1100, currency: 'USD', availability: 'In Stock' },
  { id: 'd5', name: 'CyberPowerPC Gamer Xtreme', brand: 'CyberPowerPC', category: 'Desktops', image: '/images/6.jpeg', description: 'High-end workstation and gaming desktop.', price: 1250, currency: 'USD', availability: 'In Stock' },

  // Printers
  { id: 'p1', name: 'HP LaserJet Pro MFP', brand: 'HP', category: 'Printers', image: '/images/HP LaserJet Pro MFP.png', description: 'Wireless monochrome laser printer for busy offices.', price: 450, currency: 'USD', availability: 'In Stock' },
  { id: 'p2', name: 'Canon imageCLASS', brand: 'Canon', category: 'Printers', image: '/images/Canon imageCLASS.png', description: 'Color laser printer with mobile connectivity.', price: 520, currency: 'USD', availability: 'In Stock' },
  { id: 'p3', name: 'Epson EcoTank Pro', brand: 'Epson', category: 'Printers', image: '/images/Epson EcoTank Pro.png', description: 'Cartridge-free supertank printer for high-volume printing.', price: 850, currency: 'USD', availability: 'Low Stock' },
  { id: 'p4', name: 'Brother HL-L8360CDW', brand: 'Brother', category: 'Printers', image: '/images/Brother HL-L8360CDW.png', description: 'Business color laser printer with advanced security.', price: 350, currency: 'USD', availability: 'In Stock' },
  { id: 'p5', name: 'Xerox VersaLink C400', brand: 'Xerox', category: 'Printers', image: '/images/Xerox VersaLink C400.png', description: 'Reliable and fast color printer for enterprise use.', price: 400, currency: 'USD', availability: 'In Stock' },

  // Desktop Accessories
  { id: 'a1', name: 'Logitech MX Master 3S', brand: 'Logitech', category: 'Desktop Accessories', image: '/images/Logitech MX Master 3S.png', description: 'Advanced wireless mouse with ultra-fast scrolling.', price: 99, currency: 'USD', availability: 'In Stock' },
  { id: 'a2', name: 'Dell UltraSharp 27" Monitor', brand: 'Dell', category: 'Desktop Accessories', image: '/images/Dell UltraSharp 27 Monitor.png', description: 'Color-accurate 4K USB-C monitor.', price: 550, currency: 'USD', availability: 'In Stock' },
  { id: 'a3', name: 'Keychron Q1 Pro Keyboard', brand: 'Keychron', category: 'Desktop Accessories', image: '/images/Keychron Q1 Pro Keyboard.png', description: 'Premium custom wireless mechanical keyboard.', price: 199, currency: 'USD', availability: 'In Stock' },
  { id: 'a4', name: 'APC Back-UPS Pro 1500VA', brand: 'APC', category: 'Desktop Accessories', image: '/images/APC Back-UPS Pro 1500VA.png', description: 'Uninterruptible power supply to protect equipment.', price: 230, currency: 'USD', availability: 'In Stock' },
  { id: 'a5', name: 'Sony WH-1000XM5 Headphones', brand: 'Sony', category: 'Desktop Accessories', image: '/images/Sony WH-1000XM5 Headphones.png', description: 'Noise-canceling wireless headphones for focused work.', price: 398, currency: 'USD', availability: 'In Stock' },
];

export const getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;
    let products = [...defaultProducts];
    
    if (isDatabaseConnected()) {
      // Fetch ALL products from DB to properly merge
      const dbProducts = await Product.find({});
      if (dbProducts.length > 0) {
        const dbProductNames = new Set(dbProducts.map(p => p.name));
        const missingDefaultProducts = defaultProducts.filter(p => !dbProductNames.has(p.name));
        products = [...dbProducts, ...missingDefaultProducts];
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
