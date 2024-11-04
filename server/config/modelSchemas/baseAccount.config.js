/**
 * BaseAccountModelConfig Schema Configuration
 * 
 * This configuration file defines the schema structure, validation rules, 
 * and data handling methods for the base account model in a Mongoose-based 
 * application. It includes validation constraints, data transformation hooks, 
 * instance and static methods, and soft deletion functionality to prevent 
 * permanent deletions.
 * 
 * Schema Fields:
 * - **username**: A required, unique, lowercase string with constraints on length 
 *   and format.
 * - **email**: A required, unique, lowercase string, validated against a pattern.
 * - **password**: A required, secure string that is hashed before saving.
 * - **phoneNumber**: An optional string validated against a phone number pattern.
 * - **profile**: Contains `firstName`, `lastName`, and `avatar`, with each having 
 *   length and format constraints.
 * - **address**: Stores address information with fields for street, city, state, 
 *   zipCode, and country.
 * - **accountStatus**: Enum representing account status (`active`, `pending`, 
 *   `suspended`, `deactivated`), with a default of `pending`.
 * - **role**: Enum representing the user’s role (`user`, `agent`, `admin`), with 
 *   `user` as default.
 * - **socialMediaLinks**: Object containing optional social media URLs (e.g., 
 *   Facebook, LinkedIn) validated by regex patterns.
 * - **security**: Contains fields for login attempts tracking, email verification, 
 *   and authentication tokens.
 * - **loginHistory**: An array of login records, each containing IP address, login 
 *   timestamp, success status, and user agent.
 * 
 * Options:
 * - Timestamps: Automatically adds `createdAt` and `updatedAt` fields.
 * - `toJSON` and `toObject` transformations: Removes sensitive data (`password`, 
 *   `__v`) before serialization.
 * - Indexes: Unique indexes for username and email, and additional indexes for 
 *   optimization.
 * 
 * Schema Hooks:
 * - **Pre-save**: Hashes passwords if modified, and normalizes fields like email 
 *   and names.
 * - **Pre-find**: Restricts queries to return only active accounts by default.
 * - **Pre-validate**: Normalizes input data for consistent format.
 * - **Pre-findOneAndDelete**: Converts deletions to soft deletions by updating 
 *   `accountStatus` to `deactivated` and adding a `deletedAt` timestamp.
 * - **Post-save**: Removes password from returned documents and logs account 
 *   status changes.
 * 
 * Instance Methods:
 * - **comparePassword**: Compares a given password to the stored hashed password.
 * - **updateLastLogin**: Updates the `lastLogin` timestamp.
 * - **incrementFailedLogins**: Increases `failedLoginAttempts` and locks account 
 *   after repeated failed logins.
 * - **resetFailedLogins**: Resets failed login attempts and unlocks the account.
 * - **isLocked**: Checks if the account is currently locked.
 * - **generateEmailVerificationToken**: Creates and stores a token for email 
 *   verification.
 * - **verifyEmail**: Validates an email verification token and marks the email 
 *   as verified.
 * 
 * Static Methods:
 * - **findByEmail**: Finds an active user by email.
 * - **findByUsername**: Finds an active user by username.
 * - **findByIdActiveOnly**: Finds an active user by ID.
 * - **findByEmailOrUsername**: Finds an active user by email or username.
 * - **searchUsers**: Searches for active users by name or email.
 * - **lockUserById**: Updates a user's `accountStatus` to `suspended`.
 * - **softDelete**: Performs a soft delete by deactivating an account and setting 
 *   `deletedAt` timestamp.
 * 
 * Virtuals:
 * - **fullName**: Concatenates `firstName` and `lastName` from the profile.
 * - **lockedStatus**: Checks if the account is currently locked based on the 
 *   `lockUntil` timestamp.
 */

import bcrypt from 'bcrypt';
import crypto from 'crypto';
import REQUIRED_FIELDS from '../../constants/requiredFields.js';
import VALIDATION_MESSAGES from '../../constants/validationMessages.js';
import INPUT_CONSTRAINTS from '../../constants/inputConstraints.js';
import REGEX_PATTERNS from '../../constants/regex.js';


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
          required: true,
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
      { fields: { phoneNumber: 1 }, options: { sparse: true } },
      { fields: { accountStatus: 1 }, options: { background: true } },
      { fields: { 'profile.firstName': 1, 'profile.lastName': 1 }, options: { background: true } },
      { fields: { createdAt: 1 }, options: { background: true } }
    ],
  },

  hooks: {
    pre: {
      // Hash password before saving
      save: async function(next) {
        if (!this.isModified('password')) return next();
        try {
          const salt = await bcrypt.genSalt(10);
          this.password = await bcrypt.hash(this.password, salt);
          next();
        } catch (error) {
          next(error);
        }
      },
      // Find user by email or username and return only active accounts
      find: function(next) {
        // Don't return suspended/deactivated accounts by default
        if (!this.getQuery().accountStatus) {
          this.where({ accountStatus: 'active' });
        }
        next();
      },
      // Add  email, firstName, and lastName normalization
      validate: function(next) {
        if (this.email) {
          this.email = this.email.trim().toLowerCase();
        }
        if (this.profile.firstName) {
          this.profile.firstName = this.profile.firstName.trim().replace(
            /\b\w/g, char => char.toUpperCase() // Capitalize the first letter
          );
        }
        if (this.profile.lastName) {
          this.profile.lastName = this.profile.lastName.trim().replace(
            /\b\w/g, char => char.toUpperCase() // Capitalize the first letter
          );
        }
        next();
      },
      // Soft delete prevention
      findOneAndDelete: function(next) {
        this.options.runValidators = true;
        this.setUpdate({ 
          accountStatus: 'deactivated',
          deletedAt: new Date() 
        });
        next();
      }
    },
    post: {
      // Remove sensitive data from the returned document after save()
      save: function(doc) {
        doc.password = undefined;
      },
      // Log account status changes
      save: function(doc) {
        if (doc.isModified('accountStatus')) {
          console.log(`Account status changed for user ${doc._id}: ${doc.accountStatus}`);
        }
      },
    },
  },

  methods: {
    // Compare password for login
    async comparePassword(candidatePassword) {
      try {
        // Need to select password since it's not included by default
        const user = await this.constructor.findById(this._id).select('+password');
        return await bcrypt.compare(candidatePassword, user.password);
      } catch (error) {
        throw new Error('Password comparison failed');
      }
    },
    // Update last login timestamp
    async updateLastLogin() {
      this.lastLogin = new Date();
      await this.save();
    },
    // Increment failed login attempts and lock account if necessary
    async incrementFailedLogins() {
      const MAX_ATTEMPTS = 5;
      const LOCK_TIME = 15 * 60 * 1000; // 15 minutes
      
      this.failedLoginAttempts = (this.failedLoginAttempts || 0) + 1;
      if (this.failedLoginAttempts >= MAX_ATTEMPTS) {
        this.lockUntil = new Date(Date.now() + LOCK_TIME);
      }
      await this.save();
    },
    // Reset failed login attempts and lock status
    async resetFailedLogins() {
      this.failedLoginAttempts = 0;
      this.lockUntil = null;
      await this.save();
    },
    // Check if account is locked
    isLocked() {
      return this.lockUntil && this.lockUntil > Date.now();
    },
    // Generate email verification token
    async generateEmailVerificationToken() {
      const token = crypto.randomBytes(32).toString('hex');
      this.security.emailVerificationToken = token;
      await this.save();
      return token;
    },
    // Verify email 
    async verifyEmail(token) {
      if (this.security.emailVerificationToken !== token) {
        throw new Error('Invalid verification token');
      }
      
      this.security.isEmailVerified = true;
      this.security.emailVerificationToken = undefined;
      await this.save();
      return this;
    },
  },

  statics: {
    async findByEmail(email) {
      return this.findOne({ email, accountStatus: 'active' });
    },
  
    async findByUsername(username) {
      return this.findOne({ username, accountStatus: 'active' });
    },
  
    async findByIdActiveOnly(id) {
      return this.findOne({ _id: id, accountStatus: 'active' });
    },
  
    async findByEmailOrUsername(identifier) {
      return this.findOne({
        $or: [{ email: identifier }, { username: identifier }],
        accountStatus: 'active'
      });
    },
  
    async searchUsers(query) {
      return this.find({
        accountStatus: 'active',
        $or: [
          { 'profile.firstName': new RegExp(query, 'i') },
          { 'profile.lastName': new RegExp(query, 'i') },
          { email: new RegExp(query, 'i') }
        ]
      });
    },
  
    async lockUserById(id) {
      return this.findByIdAndUpdate(id, { accountStatus: 'suspended' }, { new: true });
    },

    async softDelete(query) {
      const doc = await this.findOne(query);
      if (!doc) {
        throw new Error('Document not found');
      }
  
      // Prevent permanent deletion
      if (doc.accountStatus === 'deactivated') {
        throw new Error('Permanent deletion is not allowed. Use soft delete.');
      }
  
      // Perform a soft delete by setting accountStatus to 'deactivated'
      doc.accountStatus = 'deactivated';
      doc.deletedAt = new Date();
      await doc.save();
      return doc;
    },
  },

  virtuals: {
    fullName: {
      get() {
        return `${this.profile.firstName} ${this.profile.lastName}`;
      },
    },
    lockedStatus: { 
      get() {
        return this.lockUntil && this.lockUntil > Date.now();
      },
    },
  },
};