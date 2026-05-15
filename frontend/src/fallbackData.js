export const defaultProducts = [
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
  { id: 'p1', name: 'HP LaserJet Pro MFP', brand: 'HP', category: 'Printers', image: '/images/HP_LaserJet_Pro_MFP.png', description: 'Wireless monochrome laser printer for busy offices.', price: 450, currency: 'USD', availability: 'In Stock' },
  { id: 'p2', name: 'Canon imageCLASS', brand: 'Canon', category: 'Printers', image: '/images/Canon_imageCLASS.png', description: 'Color laser printer with mobile connectivity.', price: 520, currency: 'USD', availability: 'In Stock' },
  { id: 'p3', name: 'Epson EcoTank Pro', brand: 'Epson', category: 'Printers', image: '/images/Epson_EcoTank_Pro.png', description: 'Cartridge-free supertank printer for high-volume printing.', price: 850, currency: 'USD', availability: 'Low Stock' },
  { id: 'p4', name: 'Brother HL-L8360CDW', brand: 'Brother', category: 'Printers', image: '/images/Brother_HL-L8360CDW.png', description: 'Business color laser printer with advanced security.', price: 350, currency: 'USD', availability: 'In Stock' },
  { id: 'p5', name: 'Xerox VersaLink C400', brand: 'Xerox', category: 'Printers', image: '/images/Xerox_VersaLink_C400.png', description: 'Reliable and fast color printer for enterprise use.', price: 400, currency: 'USD', availability: 'In Stock' },

  // Desktop Accessories
  { id: 'a1', name: 'Logitech MX Master 3S', brand: 'Logitech', category: 'Desktop Accessories', image: '/images/Logitech_MX_Master_3S.png', description: 'Advanced wireless mouse with ultra-fast scrolling.', price: 99, currency: 'USD', availability: 'In Stock' },
  { id: 'a2', name: 'Dell UltraSharp 27" Monitor', brand: 'Dell', category: 'Desktop Accessories', image: '/images/Dell_UltraSharp_27_Monitor.png', description: 'Color-accurate 4K USB-C monitor.', price: 550, currency: 'USD', availability: 'In Stock' },
  { id: 'a3', name: 'Keychron Q1 Pro Keyboard', brand: 'Keychron', category: 'Desktop Accessories', image: '/images/Keychron_Q1_Pro_Keyboard.png', description: 'Premium custom wireless mechanical keyboard.', price: 199, currency: 'USD', availability: 'In Stock' },
  { id: 'a4', name: 'APC Back-UPS Pro 1500VA', brand: 'APC', category: 'Desktop Accessories', image: '/images/APC_Back-UPS_Pro_1500VA.png', description: 'Uninterruptible power supply to protect equipment.', price: 230, currency: 'USD', availability: 'In Stock' },
  { id: 'a5', name: 'Sony WH-1000XM5 Headphones', brand: 'Sony', category: 'Desktop Accessories', image: '/images/Sony_WH-1000XM5_Headphones.png', description: 'Noise-canceling wireless headphones for focused work.', price: 398, currency: 'USD', availability: 'In Stock' },
];

export const defaultServices = [
  { id: 's1', name: 'Internet Setup', category: 'Connectivity', image: '/images/internet_setup.png', description: 'Professional installation and configuration of high-speed internet connections for homes and offices.', pricing: { startingPrice: 49, currency: 'USD' } },
  { id: 's2', name: 'Wi-Fi Setup', category: 'WiFi & Smart Solutions', image: '/images/wifi_setup.png', description: 'Complete wireless network setup ensuring optimal coverage and secure connectivity.', pricing: { startingPrice: 39, currency: 'USD' } },
  { id: 's3', name: 'Router Installation', category: 'Enterprise Networking', image: '/images/router_installlation.png', description: 'Installation and secure configuration of home and enterprise-grade routers.', pricing: { startingPrice: 59, currency: 'USD' } },
  { id: 's4', name: 'Network Troubleshooting', category: 'Support & Maintenance', image: '/images/network_troubleshoot.png', description: 'Diagnostics and repair of network issues, connectivity drops, and speed problems.', pricing: { startingPrice: 65, currency: 'USD' } },
  { id: 's5', name: 'CCTV Installation', category: 'Security', image: '/images/cctv_installation.png', description: 'Mounting, wiring, and software setup for indoor and outdoor security cameras.', pricing: { startingPrice: 120, currency: 'USD' } },
  { id: 's6', name: 'Desktop Setup', category: 'IT Infrastructure', image: '/images/Desktop_setup.png', description: 'Unboxing, assembly, OS configuration, and peripheral connection for new workstations.', pricing: { startingPrice: 45, currency: 'USD' } },
  { id: 's7', name: 'Software Installation', category: 'IT Infrastructure', image: '/images/software_installation.png', description: 'Installation of operating systems, office suites, antivirus, and specialized business applications.', pricing: { startingPrice: 30, currency: 'USD' } },
  { id: 's8', name: 'Laptop Repair', category: 'Support & Maintenance', image: '/images/laptop_repair.png', description: 'Hardware diagnostics, screen replacements, keyboard repairs, and battery changes.', pricing: { startingPrice: 80, currency: 'USD' } },
  { id: 's9', name: 'Device Maintenance', category: 'Support & Maintenance', image: '/images/Device_maintance.png', description: 'Routine cleaning, hardware checks, and optimization for computers and networking gear.', pricing: { startingPrice: 50, currency: 'USD' } },
  { id: 's10', name: 'Access Point Setup', category: 'WiFi & Smart Solutions', image: '/images/access_point.png', description: 'Strategic placement and configuration of wireless access points to eliminate dead zones.', pricing: { startingPrice: 75, currency: 'USD' } },
  { id: 's11', name: 'Data Backup', category: 'IT Infrastructure', image: '/images/data_backup.png', description: 'Setup of automated local and cloud backup solutions to protect critical information.', pricing: { startingPrice: 90, currency: 'USD' } },
  { id: 's12', name: 'Technical Support', category: 'Support & Maintenance', image: '/images/technical_support.png', description: 'On-demand IT assistance for software glitches, hardware issues, and user queries.', pricing: { startingPrice: 40, currency: 'USD' } },
  { id: 's13', name: 'Website Development', category: 'IT Infrastructure', image: '/images/web_development.png', description: 'Stunning, conversion-focused websites that establish your digital presence and drive results.', pricing: { startingPrice: 499, currency: 'USD' } },
  { id: 's14', name: 'Social Media Management', category: 'IT Infrastructure', image: '/images/social_media.png', description: 'Strategic content creation and community management across all major platforms.', pricing: { startingPrice: 199, currency: 'USD' } }
];
