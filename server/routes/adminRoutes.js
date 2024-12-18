/**
 * This file contains the routes for admin management in the system.
 */

import express from 'express';
import {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} from '../controllers/admin/adminController.js';
import authenticateJWT from '../middleware/auth/authMiddleware.js';  // JWT auth middleware for protected routes
import { checkIsAdmin,checkIsAdminSelfOrSuperAdmin} from '../middleware/auth/roleMiddleware.js';
import { validateAdminUpdateFields } from '../middleware/validation/adminUpdateValidation.js';
import { handleValidationErrors } from '../middleware/common/handleValidationErrors.js';
import {validateObjectId} from '../middleware/validation/validateObjectId.js';


const router = express.Router();

/**
 * ============================
 * Admin Routes
 * ============================
 */

// Admin Management

// Get all admins (admin-only route)
router.get('/', 
  authenticateJWT,
  checkIsAdmin, 
  getAllAdmins);

// Get a specific admin by ID (admin-only route)
router.get('/:id', 
  authenticateJWT,
  validateObjectId,
  checkIsAdmin, 
  getAdminById);

// Update admin information (admin-only route)
router.put('/:id',
  authenticateJWT,
  validateObjectId,  // Add this new middleware
  checkIsAdminSelfOrSuperAdmin,
  validateAdminUpdateFields,
  handleValidationErrors,
  updateAdmin
);

// Delete an admin (super admin only)
router.delete('/:id',
  authenticateJWT,
  validateObjectId,
  checkIsAdminSelfOrSuperAdmin,
  deleteAdmin);

export default router;
