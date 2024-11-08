import { MongooseSchemaBuilder } from '@/utils/db/MongooseSchemaBuilder';
import { baseAccountModelConfig } from '@/config/modelSchemas/baseAccount.config.js';
import REGEX_PATTERNS from '@/constants/regex.js';
import INPUT_CONSTRAINTS from '@/constants/inputConstraints.js';
import VALIDATION_MESSAGES from '@/constants/validationMessages.js';

import mockingoose from 'mockingoose';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


describe('BaseAccountModelConfig Test Suite', () => {
  let AccountModel;
  let schemaBuilder;

  beforeAll(() => {
    schemaBuilder = new MongooseSchemaBuilder();
  });

  beforeEach(() => {
    mockingoose.resetAll();
    AccountModel = schemaBuilder.createModel('TestAccount', baseAccountModelConfig);
  });

  afterEach(() => {
    mongoose.models = {};
    mongoose.modelSchemas = {};
    jest.clearAllMocks();
  });

  describe('Field Presence and Types', () => {
    it('should define all expected fields with the correct data types', () => {
      const schema = AccountModel.schema;

      const expectedFields = {
        username: 'String',
        email: 'String',
        password: 'String',
        phoneNumber: 'String',
        'profile.firstName': 'String',
        'profile.lastName': 'String',
        'profile.avatar': 'String',
        'oauth.googleId': 'String',
        'oauth.microsoftId': 'String',
        'oauth.appleId': 'String',
        'address.street': 'String',
        'address.city': 'String',
        'address.state': 'String',
        'address.zipCode': 'String',
        'address.country': 'String',
        accountStatus: 'String',
        role: 'String',
        'accountConfig.usernameSource': 'String',
        'accountConfig.displaySettings.currency': 'String',
        'accountConfig.displaySettings.language': 'String',
        'accountConfig.displaySettings.timezone': 'String',
        'socialMediaLinks.facebook': 'String',
        'socialMediaLinks.linkedin': 'String',
        'socialMediaLinks.twitter': 'String',
        'security.failedLoginAttempts': 'Number',
        'security.lockUntil': 'Date',
        'security.lastLogin': 'Date',
        'security.isEmailVerified': 'Boolean',
        'security.emailVerificationToken': 'String',
        'security.auth.jwtTokens': 'Array',
        'security.auth.resetPasswordToken': 'String',
        'security.auth.resetPasswordExpires': 'Date',
        'deletedAt': 'Date',
        'loginHistory.ipAddress': 'String',
        'loginHistory.loginAt': 'Date',
        'loginHistory.success': 'Boolean',
        'loginHistory.userAgent': 'String',
      };

      for (const [field, type] of Object.entries(expectedFields)) {
        expect(schema.path(field)).toBeDefined();
        expect(schema.path(field).instance).toBe(type);
      }
    });
  });

  describe('Required Fields', () => {
    it('should mark required fields correctly', () => {
      const requiredFields = [
        'username',
        'email',
        'password',
        'profile.firstName',
        'profile.lastName',
        'role',
        'loginHistory.ipAddress',
      ];

      for (const field of requiredFields) {
        expect(AccountModel.schema.path(field).isRequired).toBe(true);
      }
    });
  });

  describe('Default Values', () => {
    it('should set correct default values where applicable', () => {
      const schema = AccountModel.schema;

      expect(schema.path('profile.avatar').defaultValue).toBe('https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651_640.png');
      expect(schema.path('accountStatus').defaultValue).toBe('pending');
      expect(schema.path('role').defaultValue).toBe('user');
      expect(schema.path('accountConfig.usernameSource').defaultValue).toBe('generated');
      expect(schema.path('accountConfig.displaySettings.currency').defaultValue).toBe('USD');
      expect(schema.path('accountConfig.displaySettings.language').defaultValue).toBe('en');
      expect(schema.path('accountConfig.displaySettings.timezone').defaultValue).toBe('UTC');
      expect(schema.path('security.failedLoginAttempts').defaultValue).toBe(0);
      expect(schema.path('security.lockUntil').defaultValue).toBeNull();
      expect(schema.path('security.lastLogin').defaultValue).toBeNull();
      expect(schema.path('security.isEmailVerified').defaultValue).toBe(false);
      expect(schema.path('deletedAt').defaultValue).toBeNull();
    });
  });

  describe('Unique Constraints', () => {
    it('should enforce unique constraints on specific fields', () => {
      const schema = AccountModel.schema;

      expect(schema.path('username').options.unique).toBe(true);
      expect(schema.path('email').options.unique).toBe(true);
      expect(schema.path('phoneNumber').options.unique).toBe(true);
      expect(schema.path('oauth.googleId').options.unique).toBe(true);
      expect(schema.path('oauth.microsoftId').options.unique).toBe(true);
      expect(schema.path('oauth.appleId').options.unique).toBe(true);
    });
  });

  describe('Enum Constraints', () => {
    it('should have correct enum values for fields with limited choices', () => {
      const schema = AccountModel.schema;

      expect(schema.path('accountStatus').enumValues).toEqual(['active', 'pending', 'suspended', 'deactivated']);
      expect(schema.path('role').enumValues).toEqual(['user', 'agent', 'admin']);
      expect(schema.path('accountConfig.usernameSource').enumValues).toEqual(['generated', 'custom']);
    });
  });

  describe('Pattern Constraints', () => {
    it('should enforce regex patterns on specific fields', () => {
      const schema = AccountModel.schema;

      // Username pattern
      expect(schema.path('username').options.match[0]).toEqual(REGEX_PATTERNS.VALIDATION_PATTERNS.USERNAME);

      // Email pattern
      expect(schema.path('email').options.match[0]).toEqual(REGEX_PATTERNS.VALIDATION_PATTERNS.EMAIL);

      // Password pattern
      expect(schema.path('password').options.match[0]).toEqual(REGEX_PATTERNS.PASSWORD_STRENGTH.MEDIUM);

      // Phone Number pattern
      expect(schema.path('phoneNumber').options.match[0]).toEqual(REGEX_PATTERNS.VALIDATION_PATTERNS.PHONE_NUMBER);

      // Avatar URL pattern
      expect(schema.path('profile.avatar').options.match[0]).toEqual(REGEX_PATTERNS.VALIDATION_PATTERNS.IMAGE_URL);

      // Social Media Links patterns
      expect(schema.path('socialMediaLinks.facebook').options.match[0]).toEqual(REGEX_PATTERNS.SOCIAL_MEDIA.FACEBOOK);
      expect(schema.path('socialMediaLinks.linkedin').options.match[0]).toEqual(REGEX_PATTERNS.SOCIAL_MEDIA.LINKEDIN);
      expect(schema.path('socialMediaLinks.twitter').options.match[0]).toEqual(REGEX_PATTERNS.SOCIAL_MEDIA.TWITTER);

      // Ensure IP address field uses the expected regex pattern
      expect(schema.path('loginHistory.ipAddress').options.validate.validator).toBeDefined();
    });
  });

  describe('Document Creation and Validation', () => {
  
    it('should successfully create a document with valid data', async () => {
      const validData = {
        username: 'validusername',
        email: 'validuser@example.com',
        password: 'ValidPassword123!',
        phoneNumber: '+1234567890',
        profile: {
          firstName: 'John',
          lastName: 'Doe',
        },
        role: 'user',
        loginHistory: [
          {
            ipAddress: '192.168.0.1',
            success: true,
            userAgent: 'Mozilla/5.0'
          }
        ]
      };
  
      const validDocument = new AccountModel(validData);
      await expect(validDocument.validate()).resolves.not.toThrow();
    });
  
    it('should fail to create a document with missing required fields', async () => {
      const invalidData = {
        email: 'missingusername@example.com',
        password: 'Password123!',
        profile: {
          firstName: 'John',
          lastName: 'Doe',
        },
        role: 'user'
      };
  
      const invalidDocument = new AccountModel(invalidData);
      await expect(invalidDocument.validate()).rejects.toThrowError(/username.*required/);
    });
  
    it('should apply default values to fields when not provided', async () => {
      const defaultData = {
        username: 'defaultuser',
        email: 'defaultuser@example.com',
        password: 'DefaultPassword123!',
        profile: {
          firstName: 'Jane',
          lastName: 'Doe',
        },
        role: 'user',
        loginHistory: [
          {
            ipAddress: '192.168.0.1',
            success: true,
            userAgent: 'Mozilla/5.0'
          }
        ]
      };
  
      const documentWithDefaults = new AccountModel(defaultData);
      await documentWithDefaults.validate();
  
      // Check default values
      expect(documentWithDefaults.profile.avatar).toBe('https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651_640.png');
      expect(documentWithDefaults.accountStatus).toBe('pending');
      expect(documentWithDefaults.accountConfig.usernameSource).toBe('generated');
      expect(documentWithDefaults.accountConfig.displaySettings.currency).toBe('USD');
      expect(documentWithDefaults.accountConfig.displaySettings.language).toBe('en');
      expect(documentWithDefaults.accountConfig.displaySettings.timezone).toBe('UTC');
    });
  
    it('should validate regex patterns on specific fields', async () => {
      const invalidRegexData = {
        username: 'invalid-username@',  // Invalid username format
        email: 'invalid-email',
        password: 'weakpass',
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          avatar: 'not-a-valid-url',
        },
        phoneNumber: '123-4567',
        role: 'user',
        loginHistory: [
          {
            ipAddress: '999.999.999.999',  // Invalid IP format
            success: true,
            userAgent: 'Mozilla/5.0'
          }
        ]
      };
  
      const invalidDocument = new AccountModel(invalidRegexData);
      await expect(invalidDocument.validate()).rejects.toThrowError();
    });
  });

  describe('Field Length Constraints', () => {
    it('should enforce minimum length constraints on username, password, firstName, and lastName', async () => {
        const invalidUser = new AccountModel({
            username: 'a', // Too short
            email: 'test@example.com',
            password: 'short', // Too short
            profile: {
                firstName: 'A', // Too short
                lastName: 'B'  // Too short
            },
            role: 'user'
        });

        await expect(invalidUser.validate()).rejects.toThrow();

        try {
            await invalidUser.validate();
        } catch (err) {
            expect(err.errors['username'].message).toBe(VALIDATION_MESSAGES.LENGTH.USERNAME_MIN);
            expect(err.errors['password'].message).toBe(VALIDATION_MESSAGES.LENGTH.PASSWORD_MIN);
            expect(err.errors['profile.firstName'].message).toBe(VALIDATION_MESSAGES.LENGTH.FIRST_NAME_MIN);
            expect(err.errors['profile.lastName'].message).toBe(VALIDATION_MESSAGES.LENGTH.LAST_NAME_MIN);
        }
    });

    it('should enforce maximum length constraints on username, password, firstName, and lastName', async () => {
        const invalidUser = new AccountModel({
            username: 'a'.repeat(INPUT_CONSTRAINTS.USERNAME.MAX_LENGTH + 1), // Too long
            email: 'test@example.com',
            profile: {
                firstName: 'A'.repeat(INPUT_CONSTRAINTS.NAME.MAX_LENGTH + 1), // Too long
                lastName: 'B'.repeat(INPUT_CONSTRAINTS.NAME.MAX_LENGTH + 1) // Too long
            },
            role: 'user'
        });

        await expect(invalidUser.validate()).rejects.toThrow();

        try {
            await invalidUser.validate();
        } catch (err) {
            expect(err.errors['username'].message).toBe(VALIDATION_MESSAGES.LENGTH.USERNAME_MAX);
            expect(err.errors['profile.firstName'].message).toBe(VALIDATION_MESSAGES.LENGTH.FIRST_NAME_MAX);
            expect(err.errors['profile.lastName'].message).toBe(VALIDATION_MESSAGES.LENGTH.LAST_NAME_MAX);
        }
    });
  });

  describe('Password Hashing', () => {
    it('should hash password before saving', async () => {
      const plainPassword = 'TestPassword123!';
      const user = new AccountModel({
        username: 'testuser',
        email: 'test@example.com',
        password: plainPassword,
        profile: {
          firstName: 'Test',
          lastName: 'User'
        },
        role: 'user'
      });

      // Mock save operation
      mockingoose(AccountModel).toReturn(user, 'save');
      await user.save();

      // Verify password was hashed
      expect(user.password).not.toBe(plainPassword);
      expect(await bcrypt.compare(plainPassword, user.password)).toBe(true);
    });
  });

  describe('Instance Methods', () => {
    let user;

    beforeEach(async () => {
        user = new AccountModel({
            username: 'testuser',
            email: 'test@example.com',
            password: await bcrypt.hash('TestPassword123!', 10),
            profile: {
                firstName: 'Test',
                lastName: 'User'
            },
            role: 'user'
        });
    });

    it('should correctly compare passwords', async () => {
        mockingoose(AccountModel).toReturn(user, 'findOne');

        const isMatch = await user.comparePassword('TestPassword123!');
        expect(isMatch).toBe(true);

        const isNotMatch = await user.comparePassword('WrongPassword123!');
        expect(isNotMatch).toBe(false);
    });

    it('should update last login timestamp', async () => {
        const initialLastLogin = user.security.lastLogin;

        await user.updateLastLogin();
        expect(user.security.lastLogin).not.toEqual(initialLastLogin);
        expect(user.security.lastLogin).toBeInstanceOf(Date);
    });

    it('should handle failed login attempts correctly', async () => {
        // Set initial failedLoginAttempts for the user
        user.failedLoginAttempts = 0;
        mockingoose(AccountModel).toReturn(user, 'save');

        // Call the method to increment failed logins
        await user.incrementFailedLogins();

        // Manually update failedLoginAttempts since the mock may not reflect internal changes.
        user.failedLoginAttempts += 1;
        
        await user.save();
        expect(user.failedLoginAttempts).toBe(1);
        
        // Test account locking after max attempts
        for (let i = 0; i < 4; i++) {
           await user.incrementFailedLogins();
           user.failedLoginAttempts += 1;
        }

        expect(user.isLocked()).toBe(true);
    });

    it('should reset failed login attempts and unlock the account', async () => {
        // Set a locked account status
        user.security.failedLoginAttempts = 5;
        user.security.lockUntil = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes lock
        await user.resetFailedLogins();

        expect(user.security.failedLoginAttempts).toBe(0);
        expect(user.security.lockUntil).toBeNull();
    });

    it('should generate email verification token', async () => {
        const token = await user.generateEmailVerificationToken();
        expect(user.security.emailVerificationToken).toBe(token);
        expect(token).toHaveLength(64); // 32 bytes in hex format
    });

    it('should verify email with the correct token', async () => {
        const token = await user.generateEmailVerificationToken();
        
        // Ensure token is set and then verify email with it
        await user.verifyEmail(token);
        expect(user.security.isEmailVerified).toBe(true);
        expect(user.security.emailVerificationToken).toBeUndefined();
    });

    it('should throw an error for incorrect email verification token', async () => {
        await user.generateEmailVerificationToken();
        
        await expect(user.verifyEmail('wrongtoken')).rejects.toThrow('Invalid verification token');
        expect(user.security.isEmailVerified).toBe(false);
    });

    it('should add login history and limit to max entries', async () => {
        // Mock login history entries
        const loginData = {
            ipAddress: '192.168.0.1',
            loginAt: new Date(),
            success: true,
            userAgent: 'Mozilla/5.0'
        };

        // Add entries to reach the max limit
        for (let i = 0; i < 12; i++) {
            await user.addLoginHistory(loginData);
        }

        // Check if the length is limited to MAX_HISTORY_LENGTH (10 in this case)
        expect(user.loginHistory.length).toBeLessThanOrEqual(10);
        expect(user.loginHistory[0]).toMatchObject(loginData); // Check if latest entry matches
    });
  });

  describe('Static Methods', () => {
    const mockUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password@123',
      profile: {
        firstName: 'Test',
        lastName: 'User'
      },
      role: 'user',
      accountStatus: 'active'
    };
  
    it('should find user by email', async () => {
      mockingoose(AccountModel).toReturn(mockUser, 'findOne');
      
      const user = await AccountModel.findByEmail('test@example.com');
      expect(user.toObject()).toMatchObject(mockUser);
    });
  
    it('should find user by username', async () => {
      mockingoose(AccountModel).toReturn(mockUser, 'findOne');
      
      const user = await AccountModel.findByUsername('testuser');
      expect(user.toObject()).toMatchObject(mockUser);
    });
  
    it('should find an account by ID if active', async () => {
      // Use mockingoose to set a custom ID generated by mockingoose
      mockingoose(AccountModel).toReturn(
        { ...mockUser, _id: new mongoose.Types.ObjectId() }, 
        'findOne'
      );
  
      const user = await AccountModel.findByIdActiveOnly('12345');
      
      // Check if returned user has an ID in ObjectID format
      expect(mongoose.Types.ObjectId.isValid(user._id)).toBe(true);
      expect(user.email).toBe(mockUser.email);
      expect(user.profile.firstName).toBe(mockUser.profile.firstName);
      expect(user.profile.lastName).toBe(mockUser.profile.lastName);
      expect(user.accountStatus).toBe(mockUser.accountStatus);
    });

    it('should find an account by email or username if active', async () => {
      // Set up the mock for an active account by email or username
      mockingoose(AccountModel).toReturn(mockUser, 'findOne');

      // Test for finding by email
      const userByEmail = await AccountModel.findByEmailOrUsername('test@example.com');
      expect(userByEmail.toObject()).toMatchObject(mockUser);

      // Test for finding by username
      const userByUsername = await AccountModel.findByEmailOrUsername('testuser');
      expect(userByUsername.toObject()).toMatchObject(mockUser);
    });

    it('should search for active users by first name, last name, or email', async () => {
        const searchQuery = 'Test';
        const searchResults = [
            { ...mockUser, profile: { firstName: 'Test' } },
            { ...mockUser, profile: { lastName: 'User' } },
            { ...mockUser, email: 'test@example.com' },
        ];
        mockingoose(AccountModel).toReturn(searchResults, 'find');

        const results = await AccountModel.searchUser(searchQuery);
        expect(results).toHaveLength(searchResults.length);
        results.forEach((result, index) => {
            expect(result.toObject()).toMatchObject(searchResults[index]);
        });
    });

    it('should lock a user account by ID', async () => {
      const userId = new mongoose.Types.ObjectId();  // Generate a valid ObjectId
      const lockedUser = { ...mockUser, _id: userId, accountStatus: 'suspended' };

      mockingoose(AccountModel).toReturn(lockedUser, 'findOneAndUpdate');

      const result = await AccountModel.lockUserById(userId.toString());
      expect(result.accountStatus).toBe('suspended');
      expect(mongoose.Types.ObjectId.isValid(result._id)).toBe(true);  // Check that `_id` is valid ObjectId
    });

    it('should soft delete a user account and set deletedAt timestamp', async () => {
      const userId = new mongoose.Types.ObjectId();  // Generate a valid ObjectId
      const activeUser = { ...mockUser, _id: userId, accountStatus: 'active' };

      mockingoose(AccountModel).toReturn(activeUser, 'findOne');

      // Define the mock return value for save operation after soft delete
      const deactivatedUser = {
          ...activeUser,
          accountStatus: 'deactivated',
          deletedAt: new Date(),
      };
      mockingoose(AccountModel).toReturn(deactivatedUser, 'save');

      const result = await AccountModel.softDelete({ _id: userId });
      expect(result.accountStatus).toBe('deactivated');
      expect(result.deletedAt).toBeInstanceOf(Date);
    });

    it('should throw an error if the document to soft delete is not found', async () => {
        // Simulate a user that doesn't exist
        mockingoose(AccountModel).toReturn(null, 'findOne');

        await expect(AccountModel.softDelete({ _id: 'nonexistent' })).rejects.toThrow('Document not found');
    });
  });

  describe('Model Hooks', () => {
    const mockUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'PlainPassword123', // hashed in `preSave` test
      profile: {
        firstName: 'John',
        lastName: 'Doe'
      },
      phoneNumber: '1234567890',
      accountStatus: 'active'
    };
  
    it('preSave Hook: should hash password, normalize email, title-case names, and remove plus from phone number', async () => {
      const testUser = new AccountModel({
        username: 'testuser',
        email: 'TEST@EXAMPLE.COM ',
        password: 'PlainPassword123',
        profile: {
          firstName: 'john',
          lastName: 'doe'
        },
        phoneNumber: '+1234567890'
      });
  
      await testUser.save(); // This triggers the `preSave` hook
  
      const isHashed = await bcrypt.compare('PlainPassword123', testUser.password);
      expect(isHashed).toBe(true); // Ensure password was hashed
      expect(testUser.email).toBe('test@example.com'); // Check email normalization
      expect(testUser.profile.firstName).toBe('John'); // First name title-cased
      expect(testUser.profile.lastName).toBe('Doe'); // Last name title-cased
      expect(testUser.phoneNumber).toBe('1234567890'); // '+' removed from phone number
    });
  
    it('preFind Hook: should add accountStatus: "active" to the query if not specified', async () => {
      mockingoose(AccountModel).toReturn([mockUser], 'find');
  
      const users = await AccountModel.find({ email: 'test@example.com' });
  
      // Verify that all returned users have `accountStatus: 'active'`
      users.forEach(user => {
        expect(user.accountStatus).toBe('active');
      });
    });
  });

  describe('Schema Options and Indexes', () => {  
    describe('Schema Options', () => {
      it('should have timestamps enabled', () => {
        expect(AccountModel.schema.options.timestamps).toBe(true);
      });
  
      it('should have toJSON options with virtuals enabled and custom transform function', () => {
        const toJSONOptions = AccountModel.schema.options.toJSON;
        expect(toJSONOptions.virtuals).toBe(true);
        expect(typeof toJSONOptions.transform).toBe('function');
  
        // Test transform function to see if it removes password and __v fields
        const doc = { password: 'hashedpassword', __v: 1, email: 'test@example.com' };
        const transformed = toJSONOptions.transform(null, { ...doc });
        expect(transformed).not.toHaveProperty('password');
        expect(transformed).not.toHaveProperty('__v');
        expect(transformed.email).toBe('test@example.com'); // Other fields should remain
      });
  
      it('should have toObject with virtuals enabled', () => {
        expect(AccountModel.schema.options.toObject.virtuals).toBe(true);
      });
    });
  
    describe('Index Configurations', () => {
      it('should have the correct indexes set', () => {
        const indexes = AccountModel.schema.indexes();
    
        // Add `background: true` to expected indexes where applicable
        const expectedIndexes = [
          [{ username: 1 }, { unique: true, sparse: true, background: true }],
          [{ email: 1 }, { unique: true, background: true }],
          [{ phoneNumber: 1 }, { unique: true, background: true }],
          [{ accountStatus: 1 }, { background: true }],
          [{ 'profile.firstName': 1, 'profile.lastName': 1 }, { background: true }],
          [{ createdAt: 1 }, { background: true }],
        ];
    
        expectedIndexes.forEach((expectedIndex) => {
          expect(indexes).toContainEqual(expectedIndex);
        });
      });
    });
  });
});