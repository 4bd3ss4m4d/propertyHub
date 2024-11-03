/**
 * Unit Tests for CustomError and Its Subclasses
 * 
 * This test suite provides comprehensive unit tests for the CustomError base class and its specific subclasses. 
 * Each error class represents a different type of HTTP error, facilitating standardized error handling across the application.
 * 
 * The tests cover:
 * - Instantiation of each error class with both default and custom values.
 * - Verification of error properties such as `statusCode`, `message`, `errors`, and `errorCode`.
 * - Validation of the `toJSON` method to ensure proper error formatting.
 * 
 * Custom Error Classes Tested:
 * - `CustomError`: Base class for custom errors, supporting customizable status codes, messages, error arrays, and error codes.
 * - `ConfigurationError`: Represents a server configuration error (500 Internal Server Error).
 * - `ValidationError`: Represents an input validation error (400 Bad Request).
 * - `UnauthorizedError`: Represents authorization failures (401 Unauthorized).
 * - `ForbiddenError`: Represents forbidden actions (403 Forbidden).
 * - `NotFoundError`: Represents missing resources (404 Not Found).
 * - `ConflictError`: Represents conflicts in resource creation (409 Conflict).
 * - `TooManyRequestsError`: Represents rate-limiting errors (429 Too Many Requests).
 * - `UnprocessableEntityError`: Represents errors due to invalid request data (422 Unprocessable Entity).
 * - `ServerError`: General class for internal server errors (500 Internal Server Error).
 * - `MongooseValidationError`: Specialized error class for handling Mongoose validation errors.
 * 
 * Each error type test checks:
 * - **Default Values**: If the error message and status code are correctly set when no custom message is provided.
 * - **Custom Messages and Errors**: If each error class can accept and handle custom messages and detailed error arrays.
 * - **Consistency of Error Code**: Ensures each error type has a unique error code for easier identification.
 * - **Mongoose Error Formatting (MongooseValidationError)**: Verifies that Mongoose validation errors are formatted for client responses.
 * 
 * Dependencies:
 * - `jest`: Testing framework for structuring and executing tests.
 * - `ERROR_MESSAGES` and `HTTP_STATUS_CODES`: Constants for standard error messages and HTTP status codes.
 */

import {
    CustomError,
    ConfigurationError,
    ValidationError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    TooManyRequestsError,
    UnprocessableEntityError,
    ServerError,
    MongooseValidationError,
  } from '@/utils/errors/customErrors';
import ERROR_MESSAGES from '@/constants/errorMessages';
import HTTP_STATUS_CODES from '@/constants/httpStatusCodes';
  

describe('CustomError and subclasses', () => {
    const testMessage = 'Test error message';
    const testErrors = [{ field: 'username', message: 'Required field' }];
  
    describe('CustomError', () => {
      it('should create a CustomError with default properties', () => {
        const error = new CustomError(testMessage, HTTP_STATUS_CODES.BAD_REQUEST, testErrors, 'CUSTOM_ERROR');
        expect(error.message).toBe(testMessage);
        expect(error.statusCode).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
        expect(error.errors).toEqual(testErrors);
        expect(error.errorCode).toBe('CUSTOM_ERROR');
        expect(error.name).toBe('CustomError');
        expect(error.timestamp).toBeDefined();
        expect(error.toJSON()).toMatchObject({
          status: 'error',
          success: false,
          statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
          message: testMessage,
          errorCode: 'CUSTOM_ERROR',
          details: testErrors,
          timestamp: error.timestamp,
        });
      });
    });
  
    describe('ConfigurationError', () => {
      it('should create a ConfigurationError with default values', () => {
        const error = new ConfigurationError();
        expect(error.message).toBe(ERROR_MESSAGES.GENERAL_MESSAGES.CONFIG_ERROR);
        expect(error.statusCode).toBe(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        expect(error.errorCode).toBe('CONFIG_ERROR');
      });
    });
  
    describe('ValidationError', () => {
      it('should create a ValidationError with custom message and errors', () => {
        const error = new ValidationError(testMessage, testErrors);
        expect(error.message).toBe(testMessage);
        expect(error.statusCode).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
        expect(error.errors).toEqual(testErrors);
        expect(error.errorCode).toBe('VALIDATION_ERROR');
      });
  
      it('should default to a standard validation error message', () => {
        const error = new ValidationError();
        expect(error.message).toBe(ERROR_MESSAGES.VALIDATION_MESSAGES.INVALID_INPUT);
      });
    });
  
    describe('UnauthorizedError', () => {
      it('should create an UnauthorizedError with default values', () => {
        const error = new UnauthorizedError();
        expect(error.message).toBe(ERROR_MESSAGES.AUTH_MESSAGES.UNAUTHORIZED_ACCESS);
        expect(error.statusCode).toBe(HTTP_STATUS_CODES.UNAUTHORIZED);
        expect(error.errorCode).toBe('UNAUTHORIZED');
      });
    });
  
    describe('ForbiddenError', () => {
      it('should create a ForbiddenError with default values', () => {
        const error = new ForbiddenError();
        expect(error.message).toBe(ERROR_MESSAGES.AUTH_MESSAGES.FORBIDDEN_ACTION);
        expect(error.statusCode).toBe(HTTP_STATUS_CODES.FORBIDDEN);
        expect(error.errorCode).toBe('FORBIDDEN');
      });
    });
  
    describe('NotFoundError', () => {
      it('should create a NotFoundError with default values', () => {
        const error = new NotFoundError();
        expect(error.message).toBe(ERROR_MESSAGES.GENERAL_MESSAGES.NOT_FOUND);
        expect(error.statusCode).toBe(HTTP_STATUS_CODES.NOT_FOUND);
        expect(error.errorCode).toBe('NOT_FOUND');
      });
    });
  
    describe('ConflictError', () => {
      it('should create a ConflictError with custom errors', () => {
        const error = new ConflictError(testMessage, testErrors);
        expect(error.message).toBe(testMessage);
        expect(error.statusCode).toBe(HTTP_STATUS_CODES.CONFLICT);
        expect(error.errors).toEqual(testErrors);
        expect(error.errorCode).toBe('CONFLICT');
      });
  
      it('should default to a standard conflict message', () => {
        const error = new ConflictError();
        expect(error.message).toBe(ERROR_MESSAGES.VALIDATION_MESSAGES.CONFLICT);
      });
    });
  
    describe('TooManyRequestsError', () => {
      it('should create a TooManyRequestsError with default values', () => {
        const error = new TooManyRequestsError();
        expect(error.message).toBe(ERROR_MESSAGES.VALIDATION_MESSAGES.TOO_MANY_REQUESTS);
        expect(error.statusCode).toBe(HTTP_STATUS_CODES.TOO_MANY_REQUESTS);
        expect(error.errorCode).toBe('RATE_LIMIT_EXCEEDED');
      });
    });
  
    describe('UnprocessableEntityError', () => {
      it('should create an UnprocessableEntityError with custom errors', () => {
        const error = new UnprocessableEntityError(testMessage, testErrors);
        expect(error.message).toBe(testMessage);
        expect(error.statusCode).toBe(HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY);
        expect(error.errors).toEqual(testErrors);
        expect(error.errorCode).toBe('UNPROCESSABLE_ENTITY');
      });
  
      it('should default to a standard unprocessable entity message', () => {
        const error = new UnprocessableEntityError();
        expect(error.message).toBe(ERROR_MESSAGES.VALIDATION_MESSAGES.UNPROCESSABLE_ENTITY);
      });
    });
  
    describe('ServerError', () => {
      it('should create a ServerError with default values', () => {
        const error = new ServerError();
        expect(error.message).toBe(ERROR_MESSAGES.GENERAL_MESSAGES.SERVER_ERROR);
        expect(error.statusCode).toBe(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        expect(error.errorCode).toBe('INTERNAL_SERVER_ERROR');
      });
    });
  
    describe('MongooseValidationError', () => {
      it('should create a MongooseValidationError with formatted Mongoose validation errors', () => {
        const mongooseError = {
          errors: {
            username: { message: 'Username is required', kind: 'required', value: '' },
            email: { message: 'Invalid email format', kind: 'format', value: 'invalid' },
          },
        };
        const error = new MongooseValidationError(mongooseError);
  
        expect(error.message).toBe(ERROR_MESSAGES.VALIDATION_MESSAGES.INVALID_INPUT);
        expect(error.statusCode).toBe(HTTP_STATUS_CODES.BAD_REQUEST);
        expect(error.errorCode).toBe('VALIDATION_ERROR');
        expect(error.errors).toEqual([
          { field: 'username', message: 'Username is required', type: 'required', value: '' },
          { field: 'email', message: 'Invalid email format', type: 'format', value: 'invalid' },
        ]);
      });
    });
});