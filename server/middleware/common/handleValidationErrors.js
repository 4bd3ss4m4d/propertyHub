/**
 * This file contains a middleware function to handle validation errors from express-validator.
 */

import mongoose from 'mongoose';

import { validationResult } from 'express-validator';
import { ValidationError } from '../../utils/customErrors.js';  // Use your custom ValidationError

/**
 * Middleware to handle validation errors from express-validator.
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  console.log("THIS IS THE ERROR", errors)

  if (!errors.isEmpty()) {
    // Format validation errors: Each error includes only the field and its message
    const formattedErrors = errors.array().map(err => ({
      field: err.param,  // Field name (like "email")
      message: err.msg,  // Error message (like "Please provide a valid email address")
    }));

    // Pass the formatted errors to the global error handler using custom ValidationError
    return next(new ValidationError('Validation failed due to invalid inputs.', formattedErrors));
  }

  // Proceed if no validation errors
  next();
};
