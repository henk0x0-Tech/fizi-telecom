import Plan from '../models/Plan.js';
import mongoose from 'mongoose';

const isDatabaseConnected = () => mongoose.connection.readyState === 1;

export const getAllPlans = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: 'Database unavailable.' });
    }
    const plans = await Plan.find().sort({ price: 1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createPlan = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: 'Database unavailable.' });
    }
    const plan = new Plan(req.body);
    await plan.save();
    res.status(201).json(plan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updatePlan = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: 'Database unavailable.' });
    }
    const plan = await Plan.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    res.json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePlan = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: 'Database unavailable.' });
    }
    await Plan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Plan deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
