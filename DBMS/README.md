# Fizi Telecom — DBMS & Database Management

This directory (`DBMS/`) contains the database migration/seeding tools, schemas, and default JSON dumps for the **Fizi Telecom** platform.

## Folder Structure

```
DBMS/
 ├── seeder.js          # Node.js script to automatically seed MongoDB collections
 ├── siteContent.json   # Full sample JSON data export containing premium default contents
 └── README.md          # Database overview and setup instructions
```

---

## 🚀 How to Initialize / Seed Your Database

If you are setting up the project locally or deploying to production for the first time, you can automatically seed all required collections (Products, Services, Pricing Plans, Company profile, Hero section, Contact settings) instantly.

### Prerequisites
Make sure your MongoDB server is running locally or you have an active **MongoDB Atlas** database URL.

### Running the Seeder Script
1. Open your terminal in the **project root directory**.
2. Run the seeder script using Node:
   ```bash
   node DBMS/seeder.js
   ```
3. You will see output confirming collections have been successfully cleared and re-populated with pristine default records:
   ```
   🔗 Connecting to MongoDB...
   ✅ Connected to MongoDB
   📦 Seeding Products...
   ✅ Seeded 30 products
   🛠️ Seeding Services...
   ✅ Seeded 6 services
   ...
   🎉 Database Seeding Completed Successfully!
   ```

---

## 🗄️ Database Schemas Overview

The platform uses a dynamic semi-structured schema mapping with Mongoose. The core collections populated in MongoDB are:

### 1. `products`
Stores physical and hardware catalog items.
*   `id` / `_id`: Unique identifier
*   `name`: String (Required)
*   `brand`: String (e.g., HP, Dell, Lenovo)
*   `category`: String (Laptops, Desktops, Printers, Accessories)
*   `price`: Number
*   `availability`: String (In Stock, Low Stock, Out of Stock)
*   `description`: String
*   `image`: String URL path

### 2. `services`
Stores high-speed telecom connectivity and network offerings.
*   `name` / `title`: String (Required)
*   `category`: String
*   `description` / `desc`: String
*   `pricing`: Nested Object `{ startingPrice: Number }`
*   `icon`: String identifier mapping to Lucide React icons
*   `color`: Hex color branding string

### 3. `plans`
Stores internet packages and IT subscription tiers.
*   `name`: String
*   `price`: Number
*   `desc`: String
*   `features`: Array of Strings
*   `popular`: Boolean flag to highlight best-value choices

### 4. `companies`
Stores master configuration for site layout, hours of operation, contact numbers, and corporate branding.
