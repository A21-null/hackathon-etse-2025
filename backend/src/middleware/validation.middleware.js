import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }

  next();
};

export const sanitizeNote = (req, res, next) => {
  if (req.body.tags && typeof req.body.tags === 'string') {
    // Convert comma-separated string to array
    req.body.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(Boolean);
  }
  next();
};
