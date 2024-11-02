const REGEX_PATTERNS = {
    VALIDATION_PATTERNS: {
        USERNAME: /^[a-zA-Z0-9_]+$/, // Allows letters, numbers, and underscores
        EMAIL: /^\S+@\S+\.\S+$/, // Basic email validation
        PHONE_NUMBER: /^\+?[1-9]\d{1,14}$/, // International phone format

        // Image URL pattern
        IMAGE_URL: /^https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp)(\?.*)?$/i,

        // IP address patterns
        IPV4: /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]?[0-9]?)$/,
        IPV6: /([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}/,
    },

    // Social Media URL Patterns
    SOCIAL_MEDIA: {
        FACEBOOK: /^https?:\/\/(www\.)?facebook\.com\/[A-Za-z0-9_.-]+\/?$/i,
        LINKEDIN: /^https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+\/?$/i,
        TWITTER: /^https?:\/\/(www\.)?twitter\.com\/[A-Za-z0-9_]+\/?$/i,
    },

    // Password Strength Patterns
    PASSWORD_STRENGTH: {
        STRONG: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/,
        MEDIUM: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    },
};

export default REGEX_PATTERNS;
