import mongoose from 'mongoose';

export const isDatabaseConnected = () => mongoose.connection.readyState === 1;

export const defaultCompanyProfile = {
  name: 'Fizi Telecom',
  tagline: 'Connecting Communities. Empowering Businesses. Building Tomorrow.',
  description: 'Advanced Technology & Infrastructure Solutions'
};
