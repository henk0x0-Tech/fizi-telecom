import Company from '../models/Company.js';
import { defaultCompanyProfile, isDatabaseConnected } from '../utils/database.js';

export const getCompanyProfile = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.json(defaultCompanyProfile);
    }

    let company = await Company.findOne();
    
    if (!company) {
      // Create default company profile
      company = new Company(defaultCompanyProfile);
      await company.save();
    }
    
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCompanyProfile = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: 'Database unavailable. Start MongoDB before updating company profile.' });
    }

    const company = await Company.findOneAndUpdate(
      {},
      { ...req.body, updatedAt: Date.now() },
      { new: true, upsert: true }
    );
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
