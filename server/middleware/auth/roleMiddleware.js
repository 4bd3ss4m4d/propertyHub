/**
 * This file contains middleware functions to check the role of the user.
 */

import { 
  ForbiddenError,
  NotFoundError 
} from '../../utils/customErrors.js';
import Property from '../../models/Property.js';

/**
 * @desc - Check if the user is an admin
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {void}
 * @throws {ForbiddenError} - Throws 403 Forbidden if the user is not an admin
 */
export const checkIsAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'super-admin')) {
    return next();
  }

  return next(new ForbiddenError('Access forbidden: Admins only.'));
};

/**
 * @desc - Check if the user is a super admin
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {void}
 * @throws {ForbiddenError} - Throws 403 Forbidden if the user is not a super admin
 */
export const checkIsSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'super-admin') {
    return next();
  }

  return next(new ForbiddenError('Access denied: You do not have the required permissions to perform this action.'));
};

/**
 * @desc - Check if the user is either the admin they are modifying or a super admin
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {void}
 * @throws {ForbiddenError} - Throws 403 Forbidden if the user is neither the admin themselves nor a super admin
 */
export const checkIsAdminSelfOrSuperAdmin = (req, res, next) => {
  const { id } = req.params;
  const { role, id: userId } = req.user;

  // Allow access if the user is a super-admin
  if (role === 'super-admin') {
    return next();
  }

  if (userId === id) {
    return next();
  }

  return next(new ForbiddenError('Access denied: You do not have the required permissions to perform this action.'));
};

/**
 * @desc - Middleware to check if the user is either an admin or the agent themselves
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {void}
 * @throws {ForbiddenError} - Throws 403 Forbidden if the user is neither the admin nor the agent
 */
export const checkIsAgentSelfOrAdmin = (req, res, next) => {
  const { id } = req.params;
  const { role, id: userId } = req.user;

  if (role === 'admin' || role === 'super-admin') {
    return next();
  }

  if (userId === id) {
    return next();
  }

  return next(new ForbiddenError('Access denied: You do not have the required permissions to perform this action.'));
};

/**
 * Middleware to check if the user is either an admin or the user themselves.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void} - Calls next if authorized, throws ForbiddenError otherwise.
 */
export const checkIsUserSelfOrAdmin = (req, res, next) => {
  const { id } = req.params;
  const { role, id: userId } = req.user;

  if (role === 'admin' || role === 'super-admin') {
    return next();
  }

  // Allow access if the user is updating their own account
  if (userId === id) {
    return next();
  }

  return next(new ForbiddenError('Access denied: You do not have the required permissions to perform this action.'));
};

export const checkRoleToCreateProperty = (req, res, next) => {
  const { role } = req.user;

  const allowedRoles = ['user', 'agent', 'admin', 'super-admin'];

  if (req.user && allowedRoles.includes(role)) {
    return next();
  }

  return res.status(403).json({ message: 'Access denied: You do not have permission to create a property.' });
};

/**
 * Middleware to check if the user is an admin, the property owner (user who created it), or the agent managing the property.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void} - Calls next if authorized, throws ForbiddenError otherwise.
 */
export const checkIsAdminOrOwnerOrAgent = async (req, res, next) => {
  const { id: propertyId } = req.params;
  const { role, id: userId } = req.user;

  

  try {
    // If the user is an admin or super-admin, allow the update
    if (role === 'admin' || role === 'super-admin') {
      return next();
    }

    const property = await Property.findById(propertyId);
    console.log(property);
    
    
    
    if (!property) {
      return next(new NotFoundError(`Property with ID ${propertyId} not found`));
    }
 
    console.log(property.userId, userId);
    
    // Check if `userId` is set on the property and compare with the logged-in user
    if (property.userId && property.userId.toString() === userId.toString()) {
      return next();
    }

    // Check if `agentId` is set on the property and compare with the logged-in user
    if (property.agentId && property.agentId.toString() === userId.toString()) {
      return next();
    }

    // If none of the conditions are met, deny access
    return next(new ForbiddenError('Access denied: You are not authorized to modify this property.'));
  } catch (error) {
    return next(error); // Pass error to the global error handler
  }
};
