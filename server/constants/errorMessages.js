const ERROR_MESSAGES = {
    MONGOOSE_BUILDER_MESSAGES: {
        INVALID_MODEL_NAME: 'Model name must be a non-empty string.',
        INVALID_CONFIG_STRUCTURE: 'Invalid schema configuration structure.',
        MISSING_FIELDS_OBJECT: 'Configuration must include a "fields" object.',
    },

    AUTH_MESSAGES: {
        UNAUTHORIZED_ACCESS: 'Authentication required to access this resource.',
        FORBIDDEN_ACTION: 'You do not have permission to perform this action.',
        INVALID_CREDENTIALS: 'The provided credentials are invalid.',
        TOKEN_EXPIRED: 'Authentication token has expired.',
        INVALID_TOKEN: 'Invalid authentication token.',
    },

    VALIDATION_MESSAGES: {
        REQUIRED_FIELD: (field) => `${field} is required.`,
        INVALID_INPUT: 'The request contains invalid or malformed data.',
        CONFLICT: 'The request conflicts with the current state of the resource.',
        BAD_REQUEST: 'The request could not be processed due to invalid syntax.',
        TOO_MANY_REQUESTS: 'Rate limit exceeded. Please try again later.',
        UNPROCESSABLE_ENTITY: 'The request was well-formed but contains invalid parameters.',
    },

    GENERAL_MESSAGES: {
        NOT_FOUND: 'The requested resource could not be found.',
        SERVER_ERROR: 'An unexpected error occurred while processing the request.',
        CONFIG_ERROR: 'Server configuration error.',
        SERVICE_UNAVAILABLE: 'Service temporarily unavailable.',
    }
};

export default ERROR_MESSAGES;
