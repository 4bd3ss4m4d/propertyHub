/**
 * This file contains the middleware function to authenticate users using a JWT token.
 */

import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from '../../utils/customErrors.js';  // Import your custom error classes

/**
 * @desc Authenticates the user using a JWT token.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void} - Calls the next middleware if authentication is successful.
 * @throws {UnauthorizedError} - Throws a 401 error if the token is missing.
 * @throws {ForbiddenError} - Throws a 403 error if the token is invalid or expired.
 */
const authenticateJWT = (req, res, next) => {
  // Check if the token is sent in the Authorization header
  let token = req.header('authorization')?.replace('Bearer ', '');

  // If not, check if the token is stored in a cookie
  if (!token) {
    token = req.cookies?.token;
  }

  // If no token is found, throw an UnauthorizedError
  if (!token) {
    return next(new UnauthorizedError('Unauthorized access. Token is missing, please log in.'));
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach the decoded user info to `req.user`
    next();
  } catch (error) {
    return next(new ForbiddenError('Invalid token or session expired. Please log in again.'));
  }
};

export default authenticateJWT;
