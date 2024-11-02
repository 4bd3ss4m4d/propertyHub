/**
 * Custom error classes for handling and standardizing API error responses.
 * 
 * This module provides a hierarchy of custom error classes, each extending from the `CustomError` base class.
 * These classes are used to represent various HTTP error statuses, making it easier to handle errors consistently
 * throughout the application. Each error includes a status code, error message, and optional error details.
 * 
 * Available Classes:
 * - `CustomError`: Base error class with a customizable status code, message, errors array, and timestamp.
 * - `ConfigurationError`: Represents a server configuration error (500 Internal Server Error).
 * - `ValidationError`: Represents a validation error, typically due to invalid input (400 Bad Request).
 * - `UnauthorizedError`: Represents an authorization failure (401 Unauthorized).
 * - `ForbiddenError`: Represents a forbidden action attempt (403 Forbidden).
 * - `NotFoundError`: Represents a resource not found error (404 Not Found).
 * - `ConflictError`: Represents a conflict in request processing, such as duplicate resources (409 Conflict).
 * - `TooManyRequestsError`: Represents a rate-limiting error when too many requests are made (429 Too Many Requests).
 * - `UnprocessableEntityError`: Represents an error due to unprocessable entity in request data (422 Unprocessable Entity).
 * - `ServerError`: Generic server error class for internal server errors (500 Internal Server Error).
 * - `MongooseValidationError`: Specialized validation error for handling Mongoose schema validation errors.
 * 
 * Each error class also has a `toJSON` method that standardizes the JSON response format for errors,
 * including the status code, message, optional error code, detailed error information, and timestamp.
 * 
 * Usage Example:
 * ```javascript
 * throw new ValidationError('Invalid input data', [{ field: 'username', message: 'Username is required' }]);
 * ```
 * 
 * Dependencies:
 * - ERROR_MESSAGES: Contains standard error messages for different error types.
 * - HTTP_STATUS_CODES: Contains standard HTTP status codes used across the application.
 */

import ERROR_MESSAGES from '../../constants/errorMessages.js';
import HTTP_STATUS_CODES from '../../constants/httpStatusCodes.js';

class CustomError extends Error {
    /**
     * Base error class for all custom errors.
     * @param {string} message - The error message.
     * @param {number} statusCode - The HTTP status code associated with the error.
     * @param {Array} errors - An optional array of detailed error information.
     * @param {string|null} errorCode - An optional custom error code for identifying the error type.
     */
    constructor(message, statusCode, errors = [], errorCode = null) {
        super(message);
        this.statusCode = statusCode;
        this.errors = Array.isArray(errors) && errors.length > 0 ? errors : null;
        this.errorCode = errorCode;
        this.timestamp = new Date().toISOString();
        this.name = this.constructor.name;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    toJSON() {
        return {
            status: 'error',
            success: false,
            statusCode: this.statusCode,
            message: this.message,
            ...(this.errorCode && { errorCode: this.errorCode }),
            ...(this.errors && { details: this.errors }),
            timestamp: this.timestamp,
        };
    }
}

export class ConfigurationError extends CustomError {
    /**
     * Error class representing a configuration error, typically used for server misconfigurations.
     * Sets HTTP status code to 500 (Internal Server Error) and error code to "CONFIG_ERROR".
     * @param {string} [message=ERROR_MESSAGES.GENERAL_MESSAGES.CONFIG_ERROR] - Optional custom error message.
     * @param {Array} errors - An optional array of detailed error information.
     */
    constructor(message = ERROR_MESSAGES.GENERAL_MESSAGES.CONFIG_ERROR, errors = []) {
        super(message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, errors, 'CONFIG_ERROR');
    }
}

// Updated error classes with HTTP_STATUS_CODES
export class ValidationError extends CustomError {
    /**
     * Error class for validation-related errors, commonly used for input validation.
     * Sets HTTP status code to 400 (Bad Request) and error code to "VALIDATION_ERROR".
     * @param {string} [message=ERROR_MESSAGES.VALIDATION_MESSAGES.INVALID_INPUT] - Optional custom error message.
     * @param {Array} errors - An optional array of detailed validation errors.
     */
    constructor(message = ERROR_MESSAGES.VALIDATION_MESSAGES.INVALID_INPUT, errors = []) {
        super(message, HTTP_STATUS_CODES.BAD_REQUEST, errors, 'VALIDATION_ERROR');
    }
}

export class UnauthorizedError extends CustomError {
    /**
     * Error class for authorization failures.
     * Sets HTTP status code to 401 (Unauthorized) and error code to "UNAUTHORIZED".
     * @param {string} [message=ERROR_MESSAGES.AUTH_MESSAGES.UNAUTHORIZED_ACCESS] - Optional custom error message.
     * @param {Array} errors - An optional array of detailed error information.
     */
    constructor(message = ERROR_MESSAGES.AUTH_MESSAGES.UNAUTHORIZED_ACCESS, errors = []) {
        super(message, HTTP_STATUS_CODES.UNAUTHORIZED, errors, 'UNAUTHORIZED');
    }
}

export class ForbiddenError extends CustomError {
    /**
     * Error class for forbidden actions.
     * Sets HTTP status code to 403 (Forbidden) and error code to "FORBIDDEN".
     * @param {string} [message=ERROR_MESSAGES.AUTH_MESSAGES.FORBIDDEN_ACTION] - Optional custom error message.
     * @param {Array} errors - An optional array of detailed error information.
     */
    constructor(message = ERROR_MESSAGES.AUTH_MESSAGES.FORBIDDEN_ACTION, errors = []) {
        super(message, HTTP_STATUS_CODES.FORBIDDEN, errors, 'FORBIDDEN');
    }
}

export class NotFoundError extends CustomError {
    /**
     * Error class for resource not found errors.
     * Sets HTTP status code to 404 (Not Found) and error code to "NOT_FOUND".
     * @param {string} [message=ERROR_MESSAGES.GENERAL_MESSAGES.NOT_FOUND] - Optional custom error message.
     */
    constructor(message = ERROR_MESSAGES.GENERAL_MESSAGES.NOT_FOUND) {
        super(message, HTTP_STATUS_CODES.NOT_FOUND, [], 'NOT_FOUND');
    }
}

export class ConflictError extends CustomError {
    /**
     * Error class for request conflicts, such as duplicate resource creation attempts.
     * Sets HTTP status code to 409 (Conflict) and error code to "CONFLICT".
     * @param {string} [message=ERROR_MESSAGES.VALIDATION_MESSAGES.CONFLICT] - Optional custom error message.
     * @param {Array} errors - An optional array of detailed error information.
     */
    constructor(message = ERROR_MESSAGES.VALIDATION_MESSAGES.CONFLICT, errors = []) {
        super(message, HTTP_STATUS_CODES.CONFLICT, errors, 'CONFLICT');
    }
}

export class TooManyRequestsError extends CustomError {
    /**
     * Error class for rate-limiting errors due to too many requests.
     * Sets HTTP status code to 429 (Too Many Requests) and error code to "RATE_LIMIT_EXCEEDED".
     * @param {string} [message=ERROR_MESSAGES.VALIDATION_MESSAGES.TOO_MANY_REQUESTS] - Optional custom error message.
     */
    constructor(message = ERROR_MESSAGES.VALIDATION_MESSAGES.TOO_MANY_REQUESTS) {
        super(message, HTTP_STATUS_CODES.TOO_MANY_REQUESTS, [], 'RATE_LIMIT_EXCEEDED');
    }
}

export class UnprocessableEntityError extends CustomError {
    /**
     * Error class for unprocessable entity errors, indicating invalid data.
     * Sets HTTP status code to 422 (Unprocessable Entity) and error code to "UNPROCESSABLE_ENTITY".
     * @param {string} [message=ERROR_MESSAGES.VALIDATION_MESSAGES.UNPROCESSABLE_ENTITY] - Optional custom error message.
     * @param {Array} errors - An optional array of detailed error information.
     */
    constructor(message = ERROR_MESSAGES.VALIDATION_MESSAGES.UNPROCESSABLE_ENTITY, errors = []) {
        super(message, HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY, errors, 'UNPROCESSABLE_ENTITY');
    }
}

export class ServerError extends CustomError {
    /**
     * Generic error class for internal server errors.
     * Sets HTTP status code to 500 (Internal Server Error) and error code to "INTERNAL_SERVER_ERROR".
     * @param {string} [message=ERROR_MESSAGES.GENERAL_MESSAGES.SERVER_ERROR] - Optional custom error message.
     */
    constructor(message = ERROR_MESSAGES.GENERAL_MESSAGES.SERVER_ERROR) {
        super(message, HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, [], 'INTERNAL_SERVER_ERROR');
    }
}

export class MongooseValidationError extends ValidationError {
    /**
     * Specialized validation error class for handling Mongoose schema validation errors.
     * Converts Mongoose validation error format into a standardized response.
     * Sets HTTP status code to 400 (Bad Request) and error code to "VALIDATION_ERROR".
     * @param {Error} mongooseError - The Mongoose validation error object.
     */
    constructor(mongooseError) {
        const formattedErrors = Object.entries(mongooseError.errors).map(([field, error]) => ({
            field,
            message: error.message,
            type: error.kind || 'validation_error',
            value: error.value,
        }));
        super(ERROR_MESSAGES.VALIDATION_MESSAGES.INVALID_INPUT, formattedErrors);
    }
}
