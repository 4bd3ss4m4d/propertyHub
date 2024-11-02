const VALIDATION_MESSAGES = {
    REQUIRED: {
        USERNAME: 'Username is required',
        EMAIL: 'Email is required',
        PASSWORD: 'Password is required',
        FIRST_NAME: 'First name is required',
        LAST_NAME: 'Last name is required',
        ROLE: 'Role is required',
    },
    LENGTH: {
        USERNAME_MIN: 'Username must be at least 3 characters long',
        USERNAME_MAX: 'Username must be less than 30 characters long',
        FIRST_NAME_MIN: 'First name must be at least 2 characters long',
        FIRST_NAME_MAX: 'First name must be less than 50 characters long',
        LAST_NAME_MIN: 'Last name must be at least 2 characters long',
        LAST_NAME_MAX: 'Last name must be less than 50 characters long',
        PASSWORD_MIN: 'Password must be at least 6 characters long',
    },
    FORMAT: {
        USERNAME_PATTERN: 'Username can only contain letters, numbers, and underscores',
        EMAIL_PATTERN: 'Please enter a valid email address',
        PHONE_PATTERN: 'Please enter a valid phone number',
        AVATAR_URL: 'Please enter a valid URL for avatar',
        PASSWORD_PATTERN: 'Password must contain at least one number, uppercase letter, lowercase letter, and special character',
        FACEBOOK_URL: 'Please enter a valid Facebook URL',
        TWITTER_URL: 'Please enter a valid Twitter URL',
        LINKEDIN_URL: 'Please enter a valid LinkedIn URL',
        IP_ADDRESS: 'Please enter a valid IP address',
    },
};

export default VALIDATION_MESSAGES;
