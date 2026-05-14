import Service from '../models/Service.js';
import { isDatabaseConnected } from '../utils/database.js';

const defaultServices = [
  { id: 's1', name: 'Internet Setup', category: 'Connectivity', description: 'Professional installation and configuration of high-speed internet connections for homes and offices.', pricing: { startingPrice: 49, currency: 'USD' } },
  { id: 's2', name: 'Wi-Fi Setup', category: 'WiFi & Smart Solutions', description: 'Complete wireless network setup ensuring optimal coverage and secure connectivity.', pricing: { startingPrice: 39, currency: 'USD' } },
  { id: 's3', name: 'Router Installation', category: 'Enterprise Networking', description: 'Installation and secure configuration of home and enterprise-grade routers.', pricing: { startingPrice: 59, currency: 'USD' } },
  { id: 's4', name: 'Network Troubleshooting', category: 'Support & Maintenance', description: 'Diagnostics and repair of network issues, connectivity drops, and speed problems.', pricing: { startingPrice: 65, currency: 'USD' } },
  { id: 's5', name: 'CCTV Installation', category: 'Security', description: 'Mounting, wiring, and software setup for indoor and outdoor security cameras.', pricing: { startingPrice: 120, currency: 'USD' } },
  { id: 's6', name: 'Desktop Setup', category: 'IT Infrastructure', description: 'Unboxing, assembly, OS configuration, and peripheral connection for new workstations.', pricing: { startingPrice: 45, currency: 'USD' } },
  { id: 's7', name: 'Software Installation', category: 'IT Infrastructure', description: 'Installation of operating systems, office suites, antivirus, and specialized business applications.', pricing: { startingPrice: 30, currency: 'USD' } },
  { id: 's8', name: 'Laptop Repair', category: 'Support & Maintenance', description: 'Hardware diagnostics, screen replacements, keyboard repairs, and battery changes.', pricing: { startingPrice: 80, currency: 'USD' } },
  { id: 's9', name: 'Device Maintenance', category: 'Support & Maintenance', description: 'Routine cleaning, hardware checks, and optimization for computers and networking gear.', pricing: { startingPrice: 50, currency: 'USD' } },
  { id: 's10', name: 'Access Point Setup', category: 'WiFi & Smart Solutions', description: 'Strategic placement and configuration of wireless access points to eliminate dead zones.', pricing: { startingPrice: 75, currency: 'USD' } },
  { id: 's11', name: 'Data Backup', category: 'IT Infrastructure', description: 'Setup of automated local and cloud backup solutions to protect critical information.', pricing: { startingPrice: 90, currency: 'USD' } },
  { id: 's12', name: 'Technical Support', category: 'Support & Maintenance', description: 'On-demand IT assistance for software glitches, hardware issues, and user queries.', pricing: { startingPrice: 40, currency: 'USD' } }
];

export const getAllServices = async (req, res) => {
  try {
    const { category } = req.query;
    let services = defaultServices;
    
    if (isDatabaseConnected()) {
      const query = category ? { category } : {};
      const dbServices = await Service.find(query);
      if (dbServices.length > 0) {
        services = dbServices;
      }
    }
    
    if (category) {
      services = services.filter(s => s.category === category);
    }
    
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: 'Database unavailable. Start MongoDB before viewing service details.' });
    }

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: 'Database unavailable. Start MongoDB before creating services.' });
    }

    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: 'Database unavailable. Start MongoDB before updating services.' });
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: 'Database unavailable. Start MongoDB before deleting services.' });
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
