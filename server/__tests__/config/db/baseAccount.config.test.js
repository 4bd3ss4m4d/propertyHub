/**
 * Unit Tests for BaseAccountModelConfig Schema Configuration
 * 
 * This file contains unit tests for the BaseAccountModelConfig, which defines the 
 * Mongoose schema for account-related data models and handles validation, hooks, 
 * instance methods, and static methods.
 * 
 * The tests cover:
 * - Schema Structure and Validation: Verifies the schema fields, types, unique constraints, 
 *   and validation constraints (e.g., length, enums).
 * - Password Hashing: Ensures passwords are hashed before saving to the database.
 * - Instance Methods: Tests instance methods like `comparePassword` and `incrementFailedLogins`.
 * - Static Methods: Checks static methods for retrieving accounts by username or email 
 *   and searching accounts based on a query.
 * - Virtuals: Tests virtual properties like `fullName`.
 * - Schema Hooks: Validates pre- and post-save hooks, such as data normalization and 
 *   soft delete functionality to prevent permanent deletion.
 * - Security Features: Verifies security features like email verification, login history 
 *   tracking, and account locking on excessive failed login attempts.
 * 
 * Dependencies:
 * - jest: The testing framework used for assertions and test organization.
 * - mockingoose: Used to mock Mongoose models, enabling isolated unit tests 
 *   without a live MongoDB instance.
 * - bcrypt: Ensures password hashing and comparison in tests.
 */

import { MongooseSchemaBuilder } from '@/utils/db/MongooseSchemaBuilder';
import { baseAccountModelConfig } from '@/config/modelSchemas/baseAccount.config.js';
import mockingoose from 'mockingoose';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


describe('BaseAccountModelConfig', () => {
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

  describe('Schema Structure and Validation', () => {
    it('should have all required fields with correct types', () => {
      const schema = AccountModel.schema;
      
      // Test required fields
      expect(schema.path('username')).toBeDefined();
      expect(schema.path('email')).toBeDefined();
      expect(schema.path('password')).toBeDefined();
      expect(schema.path('profile.firstName')).toBeDefined();
      expect(schema.path('profile.lastName')).toBeDefined();
      
      // Test field types
      expect(schema.path('username').instance).toBe('String');
      expect(schema.path('email').instance).toBe('String');
      expect(schema.path('password').instance).toBe('String');
      expect(schema.path('accountStatus').instance).toBe('String');
      expect(schema.path('role').instance).toBe('String');
    });

    it('should enforce unique constraints', () => {
      const schema = AccountModel.schema;
      
      expect(schema.path('username').options.unique).toBe(true);
      expect(schema.path('email').options.unique).toBe(true);
    });

    it('should have correct enum values', () => {
      const schema = AccountModel.schema;
      
      expect(schema.path('accountStatus').enumValues).toEqual(['active', 'pending', 'suspended', 'deactivated']);
      expect(schema.path('role').enumValues).toEqual(['user', 'agent', 'admin']);
    });

    it('should enforce length constraints', async () => {
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

    it('should handle failed login attempts correctly', async () => {
      mockingoose(AccountModel).toReturn(user, 'save');
      
      await user.incrementFailedLogins();
      await user.save();
      expect(user.failedLoginAttempts).toBe(1);
      
      // Test account locking after max attempts
      for (let i = 0; i < 4; i++) {
        await user.incrementFailedLogins();
      }
      expect(user.isLocked()).toBe(true);
    });
  });

  describe('Static Methods', () => {
    const mockUser = {
      username: 'testuser',
      email: 'test@example.com',
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

    it('should search users by query', async () => {
      mockingoose(AccountModel).toReturn([mockUser], 'find');
      
      const users = await AccountModel.searchUsers('test');
      expect(users[0].toObject()).toMatchObject(mockUser);
    });
  });

  describe('Virtuals', () => {
    it('should generate correct full name', () => {
      const user = new AccountModel({
        username: 'testuser',
        email: 'test@example.com',
        profile: {
          firstName: 'Test',
          lastName: 'User'
        },
        role: 'user'
      });

      expect(user.fullName).toBe('Test User');
    });
  });

  describe('Schema Hooks', () => {
    it('should normalize email and names before validation', async () => {
      const user = new AccountModel({
        username: 'testuser',
        email: ' TEST@EXAMPLE.COM ',
        profile: {
          firstName: ' john ',
          lastName: ' doe '
        },
        password: 'TestPassword123!',
        role: 'user'
      });

      mockingoose(AccountModel).toReturn(user, 'save');
      await user.validate();

      expect(user.email).toBe('test@example.com');
      expect(user.profile.firstName).toBe('John');
      expect(user.profile.lastName).toBe('Doe');
    });

    it('should prevent permanent deletion and handle soft delete correctly', async () => {
        // Create a user with all required fields
        const user = new AccountModel({
          username: 'testuser',
          email: 'test@example.com',
          password: 'TestPassword123!',
          profile: {
            firstName: 'Test',
            lastName: 'User'
          },
          role: 'user',
          accountStatus: 'deactivated' // Set as deactivated to test permanent deletion prevention
        });
    
        // Mock the save operation
        mockingoose(AccountModel).toReturn(user, 'save');
        await user.save();
    
        // Mock findOne to return a deactivated user
        mockingoose(AccountModel).toReturn({
          ...user.toObject(),
          accountStatus: 'deactivated'
        }, 'findOne');
    
        // Attempt to permanently delete a deactivated account
        await expect(AccountModel.softDelete({ _id: user._id }))
          .rejects.toThrow('Permanent deletion is not allowed. Use soft delete.');
    
        // Create another user with active status
        const activeUser = new AccountModel({
          username: 'activeuser',
          email: 'active@example.com',
          password: 'TestPassword123!',
          profile: {
            firstName: 'Active',
            lastName: 'User'
          },
          role: 'user',
          accountStatus: 'active'
        });
    
        // Mock findOne to return an active user
        mockingoose(AccountModel).toReturn({
          ...activeUser.toObject(),
          accountStatus: 'active'
        }, 'findOne');
    
        // Attempt to soft delete an active account
        const softDeletedUser = await AccountModel.softDelete({ _id: activeUser._id });
        
        // Verify soft deletion occurred correctly
        expect(softDeletedUser.accountStatus).toBe('deactivated');
        expect(softDeletedUser.deletedAt).toBeDefined();
      });
    });

  describe('Security Features', () => {
    it('should handle email verification correctly', async () => {
      const user = new AccountModel({
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPassword123!',
        profile: {
          firstName: 'Test',
          lastName: 'User'
        },
        role: 'user'
      });

      mockingoose(AccountModel).toReturn(user, 'save');
      
      const token = await user.generateEmailVerificationToken();
      expect(user.security.emailVerificationToken).toBe(token);
      
      await user.verifyEmail(token);
      expect(user.security.isEmailVerified).toBe(true);
      expect(user.security.emailVerificationToken).toBeUndefined();
    });

    it('should track login history', async () => {
      const user = new AccountModel({
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPassword123!',
        profile: {
          firstName: 'Test',
          lastName: 'User'
        },
        role: 'user',
        loginHistory: [{
          ipAddress: '192.168.1.1',
          success: true,
          userAgent: 'Mozilla/5.0'
        }]
      });

      expect(user.loginHistory[0].ipAddress).toBe('192.168.1.1');
      expect(user.loginHistory[0].success).toBe(true);
    });
  });
});