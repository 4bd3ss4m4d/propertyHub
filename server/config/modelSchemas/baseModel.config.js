

export const baseModelConfig = {
  username: {
    type: 'String',
    required: [true, 'Username is required'],
    unique: true,
    validation: {
      minLength: [3, 'Username must be at least 3 characters long'],
      maxLength: [30, 'Username must be less than 30 characters long'],
      pattern: /^[a-zA-Z0-9_]+$/,
      message: 'Username can only contain letters, numbers, and underscores',
    },
  },

  email: {
    type: 'String',
    required: [true, 'Email is required'],
    unique: true,
    validation: {
      pattern: /\S+@\S+\.\S+/,
      message: 'Please enter a valid email address',
    },
  },

  password: {
    type: 'String',
    required: [true, 'Password is required'],
    validation: {
      minLength: [6, 'Password must be at least 6 characters long'],
      pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
      message:
        'Password must contain at least 6 characters, including one uppercase letter, one lowercase letter, and one number',
    },
  },

  isEmailVerified: {
    type: 'Boolean',
    default: false,
    description: 'Indicates if the user has verified their email address',
  },

  profile: {
    firstName: {
      type: 'String',
      required: [true, 'First name is required'],
      validation: {
        minLength: [2, 'First name must be at least 2 characters long'],
        maxLength: [50, 'First name must be less than 50 characters long'],
      },
    },
    lastName: {
      type: 'String',
      required: [true, 'Last name is required'],
      validation: {
        minLength: [2, 'Last name must be at least 2 characters long'],
        maxLength: [50, 'Last name must be less than 50 characters long'],
      },
    },
    phoneNumber: {
      type: 'String',
      required: false,
      validation: {
        pattern: /^\+?[\d\s-]+$/,
        message: 'Please enter a valid phone number (e.g., +123456789)',
      },
    },
    avatar: {
      type: 'String',
      required: false,
      default: 'https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651_640.png',
      description: 'URL for the user\'s profile picture',
    },
  },

  role: {
    type: 'String',
    enum: ['user', 'agent', 'admin'],
    default: 'user',
    description: 'Defines the role of the user (user, agent, or admin)',
  },

  accountStatus: {
    type: 'String',
    enum: ['active', 'pending', 'suspended', 'deactivated'],
    default: 'active',
    description: 'Current account status',
  },

  lastLogin: {
    type: 'Date',
    default: null,
    description: 'Timestamp of the user\'s last login',
  },

  failedLoginAttempts: {
    type: 'Number',
    default: 0,
    description: 'Number of failed login attempts before account lockout',
  },

  lockUntil: {
    type: 'Date',
    default: null,
    description: 'Account lock expiration time after multiple failed logins',
  },

  address: {
    street: {
      type: 'String',
      required: false,
      description: 'Street address of the user',
    },
    city: {
      type: 'String',
      required: false,
      description: 'City of residence',
    },
    state: {
      type: 'String',
      required: false,
      description: 'State or province of residence',
    },
    zipCode: {
      type: 'String',
      required: false,
      validation: {
        pattern: /^\d{5}(-\d{4})?$/,
        message: 'Please enter a valid ZIP code',
      },
    },
    country: {
      type: 'String',
      required: false,
      description: 'Country of residence',
    },
  },
};
