import REQUIRED_FIELDS from '../../constants/requiredFields.js';
import VALIDATION_MESSAGES from '../../constants/validationMessages.js';
import INPUT_CONSTRAINTS from '../../constants/inputConstraints.js';
import REGEX_PATTERNS from '../../constants/regex.js';
import { 
  validateCurrency, 
  validateLanguage, 
  validateTimezone 
} from '../../utils/validators/validationFunctions.js';
import {
  preSave,
  preFind,
} from '../../utils/models/baseAccountModel/baseAccountHooks.js';
import {
  comparePassword,
  updateLastLogin,
  incrementFailedLogins,
  resetFailedLogins,
  isLocked,
  generateEmailVerificationToken,
  verifyEmail,
  addLoginHistory,
} from '../../utils/models/baseAccountModel/baseAccountMethods.js';
import { 
  findByEmail,
  findByUsername,
  findByIdActiveOnly,
  findByEmailOrUsername,
  searchUser,
  lockUserById,
  softDelete,
} from '../../utils/models/baseAccountModel/baseAccountStatics.js';
import { 
  fullName,
  lockedStatus,
 } from '../../utils/models/baseAccountModel/baseAccountVirtuals.js';


export const baseAccountModelConfig = {
  fields: {
    username: {
      type: String,
      required: [
        REQUIRED_FIELDS.BASE_ACCOUNT_MODEL.username, 
        VALIDATION_MESSAGES.REQUIRED.USERNAME
      ],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [
        INPUT_CONSTRAINTS.USERNAME.MIN_LENGTH, 
        VALIDATION_MESSAGES.LENGTH.USERNAME_MIN
      ],
      maxlength: [
        INPUT_CONSTRAINTS.USERNAME.MAX_LENGTH, 
        VALIDATION_MESSAGES.LENGTH.USERNAME_MAX
      ],
      match: [
        REGEX_PATTERNS.VALIDATION_PATTERNS.USERNAME, 
        VALIDATION_MESSAGES.FORMAT.USERNAME_PATTERN
      ],
    },
    email: {
      type: String,
      required: [
        REQUIRED_FIELDS.BASE_ACCOUNT_MODEL.email, 
        VALIDATION_MESSAGES.REQUIRED.EMAIL
      ],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        REGEX_PATTERNS.VALIDATION_PATTERNS.EMAIL, 
        VALIDATION_MESSAGES.FORMAT.EMAIL_PATTERN
      ],
    },
    password: {
      type: String,
      required: [
        REQUIRED_FIELDS.BASE_ACCOUNT_MODEL.password, 
        VALIDATION_MESSAGES.REQUIRED.PASSWORD
      ],
      select: false,
      minlength: [
        INPUT_CONSTRAINTS.PASSWORD.MIN_LENGTH, 
        VALIDATION_MESSAGES.LENGTH.PASSWORD_MIN
      ],
      match: [
        REGEX_PATTERNS.PASSWORD_STRENGTH.MEDIUM, 
        VALIDATION_MESSAGES.FORMAT.PASSWORD_PATTERN
      ],
    },
    phoneNumber: {
      type: String,
      trim: true,
      unique: true,
      match: [
        REGEX_PATTERNS.VALIDATION_PATTERNS.PHONE_NUMBER, 
        VALIDATION_MESSAGES.FORMAT.PHONE_PATTERN
      ],
    },
    profile: {
      firstName: {
        type: String,
        required: [
          REQUIRED_FIELDS.BASE_ACCOUNT_MODEL.firstName, 
          VALIDATION_MESSAGES.REQUIRED.FIRST_NAME
        ],
        trim: true,
        minlength: [
          INPUT_CONSTRAINTS.NAME.MIN_LENGTH, 
          VALIDATION_MESSAGES.LENGTH.FIRST_NAME_MIN
        ],
        maxlength: [
          INPUT_CONSTRAINTS.NAME.MAX_LENGTH, 
          VALIDATION_MESSAGES.LENGTH.FIRST_NAME_MAX
        ],
      },
      lastName: {
        type: String,
        required: [
          REQUIRED_FIELDS.BASE_ACCOUNT_MODEL.lastName, 
          VALIDATION_MESSAGES.REQUIRED.LAST_NAME
        ],
        trim: true,
        minlength: [
          INPUT_CONSTRAINTS.NAME.MIN_LENGTH, 
          VALIDATION_MESSAGES.LENGTH.LAST_NAME_MIN
        ],
        maxlength: [
          INPUT_CONSTRAINTS.NAME.MAX_LENGTH, 
          VALIDATION_MESSAGES.LENGTH.LAST_NAME_MAX
        ],
      },
      avatar: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651_640.png',
        match: [
          REGEX_PATTERNS.VALIDATION_PATTERNS.IMAGE_URL, 
          VALIDATION_MESSAGES.FORMAT.AVATAR_URL
        ],
      },
    },
    oauth: {
      googleId: { 
        type: String, 
        unique: true, 
        sparse: true 
      },
      microsoftId: { 
        type: String, 
        unique: true, 
        sparse: true 
      },
      appleId: { 
        type: String, 
        unique: true, 
        sparse: true 
      }
    },
    address: {
      street: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      zipCode: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
    },
    accountStatus: {
      type: String,
      enum: ['active', 'pending', 'suspended', 'deactivated'],
      default: 'pending',
      index: true,
    },
    role: {
      type: String,
      required: [
        REQUIRED_FIELDS.BASE_ACCOUNT_MODEL.role, 
        VALIDATION_MESSAGES.REQUIRED.ROLE
      ],
      enum: ['user', 'agent', 'admin'],
      default: 'user',
    },
    // Account Configuration
    accountConfig: {
      usernameSource: {
        type: String,
        enum: ['generated', 'custom'],
        default: 'generated'
      },
      displaySettings: {
          currency: {
            type: String,
            default: 'USD',
            validate: {
              validator: validateCurrency,
              message: VALIDATION_MESSAGES.FORMAT.CURRENCY_CODE
            }
          },
          language: {
            type: String,
            default: 'en',
            validate: {
              validator: validateLanguage,
              message: VALIDATION_MESSAGES.FORMAT.LANGUAGE_CODE
            }
          },
          timezone: {
            type: String,
            default: 'UTC',
            validate: {
              validator: validateTimezone,
              message: VALIDATION_MESSAGES.FORMAT.TIMEZONE
            }
          }
      }
    },
    socialMediaLinks: {
      facebook: {
        type: String,
        match: [
          REGEX_PATTERNS.SOCIAL_MEDIA.FACEBOOK, 
          VALIDATION_MESSAGES.FORMAT.FACEBOOK_URL
        ],
      },
      linkedin: {
        type: String,
        match: [
          REGEX_PATTERNS.SOCIAL_MEDIA.LINKEDIN, 
          VALIDATION_MESSAGES.FORMAT.LINKEDIN_URL
        ],
      },
      twitter: {
        type: String,
        match: [
          REGEX_PATTERNS.SOCIAL_MEDIA.TWITTER, 
          VALIDATION_MESSAGES.FORMAT.TWITTER_URL
        ],
      },
      default: {},
    },
    security: {
      failedLoginAttempts: {
        type: Number,
        default: 0,
        min: 0,
      },
      lockUntil: {
        type: Date,
        default: null,
      },
      lastLogin: {
        type: Date,
        default: null,
      },
      isEmailVerified: {
        type: Boolean,
        default: false,
      },
      emailVerificationToken: {
        type: String,
        select: false,
      },
      auth: {
        jwtTokens: {
          type: [String], // Array of tokens for tracking multiple sessions/devices
          select: false,
        },
        resetPasswordToken: {
          type: String,
          select: false,
        },
        resetPasswordExpires: {
          type: Date,
          select: false,
        },
      },
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    loginHistory: [
      {
        ipAddress: {
          type: String,
          required: REQUIRED_FIELDS.BASE_ACCOUNT_MODEL.ipAddress,
          trim: true,
          validate: {
            validator: function(v) {
              // Validates both IPv4 and IPv6 formats
              return REGEX_PATTERNS.VALIDATION_PATTERNS.IPV6.test(v) || 
                     REGEX_PATTERNS.VALIDATION_PATTERNS.IPV4.test(v);
            },
            message: VALIDATION_MESSAGES.FORMAT.IP_ADDRESS,
          },
        },
        loginAt: {
          type: Date,
          default: Date.now,
        },
        success: {
          type: Boolean,
          default: false,
        },
        userAgent: {
          type: String,
          trim: true,
          default: 'unknown',
        },
      },
    ],  
  },

  options: {
    // Schema-level options
    schemaOptions: {
      timestamps: true, // Adds createdAt and updatedAt
      toJSON: { 
        virtuals: true,
        transform: function(doc, ret) {
          delete ret.password;
          delete ret.__v;
          return ret;
        }
      },
      toObject: { virtuals: true },
    },
    // Index configurations
    indexes: [
      { fields: { username: 1 }, options: { unique: true, sparse: true } },
      { fields: { email: 1 }, options: { unique: true } },
      { fields: { phoneNumber: 1 }, options: { unique: true } },
      { fields: { accountStatus: 1 }, options: { background: true } },
      { fields: { 'profile.firstName': 1, 'profile.lastName': 1 }, options: { background: true } },
      { fields: { createdAt: 1 }, options: { background: true } }
    ],
  },

  hooks: {
    pre: {
      // Hash password before saving and normalize fields
      save: preSave,
      // Find user by email or username and return only active accounts
      find: preFind,
    },
    post: {
     
    },
  },

  methods: {
    // Compare password for login
    comparePassword,
    // Update last login timestamp
    updateLastLogin,
    // Increment failed login attempts and lock account if necessary
    incrementFailedLogins,
    // Reset failed login attempts and lock status
    resetFailedLogins,
    // Check if account is locked
    isLocked,
    // Generate email verification token
    generateEmailVerificationToken,
    // Verify email 
    verifyEmail,
    // Add login History
    addLoginHistory,
  },

  statics: {
    findByEmail,
    findByUsername,
    findByIdActiveOnly,
    findByEmailOrUsername,
    searchUser,
    lockUserById,
    softDelete,
  },

  virtuals: {
    fullName: fullName,
    lockedStatus: lockedStatus,
  },
};