import dotenv from 'dotenv';

dotenv.config();

export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
};

export const validateJwtConfig = () => {
  if (process.env.NODE_ENV === 'production' && JWT_CONFIG.secret === 'default-secret-change-in-production') {
    throw new Error('JWT_SECRET must be set in production environment');
  }
};
