/**
 * Unit Tests for MongooseSchemaBuilder Class
 * 
 * This file contains unit tests for the MongooseSchemaBuilder class, which facilitates
 * dynamic schema creation and model configuration in Mongoose.
 * 
 * The tests cover:
 * - Validation of model names and schema configuration structure
 * - Application of hooks, instance methods, static methods, virtual properties, and indexes
 * - CRUD operations using Mockingoose to simulate Mongoose database interactions
 * 
 * Dependencies:
 * - mockingoose: Used to mock Mongoose models for isolated unit tests without requiring a live MongoDB instance.
 * - jest: The testing framework used for assertions and test organization.
 */

import { MongooseSchemaBuilder } from '@/utils/db/MongooseSchemaBuilder';
import mockingoose from 'mockingoose';
import mongoose from 'mongoose';
import ERROR_MESSAGES from '@/constants/errorMessages';


// Suite: MongooseSchemaBuilder
/**
 * Tests for the MongooseSchemaBuilder class
 * 
 * This test suite verifies the functionality of MongooseSchemaBuilder, focusing on:
 * 
 * - **Model Name Validation**: Ensures model names are properly validated to prevent invalid or empty names.
 * - **Configuration Structure Validation**: Checks that the schema configuration structure is validated,
 *   requiring specific properties and structure.
 * - **Schema Components Application**:
 *   - *Hooks*: Validates the correct application of pre- and post-hooks to schema instances.
 *   - *Methods and Statics*: Ensures that instance and static methods are correctly attached to models.
 *   - *Virtual Properties*: Confirms getter and setter virtuals are applied to schema instances.
 *   - *Indexes*: Validates that custom indexes are added to schema configurations.
 * - **CRUD Operations with Mockingoose**: Tests simulated create, read, update, and delete operations
 *   to verify MongooseSchemaBuilder’s schema compatibility with standard Mongoose operations.
 * 
 * Each suite within this block isolates specific aspects of schema building, enabling targeted testing
 * and easier debugging for any part of the schema configuration process.
 */
describe('MongooseSchemaBuilder', () => {
  let schemaBuilder;
  
  const mockBaseConfig = {
    fields: {
      username: { type: String, required: true, unique: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      age: { type: Number, min: 0, max: 120 },
      isActive: { type: Boolean, default: true },
      tags: [{ type: String }],
      metadata: {
        lastLogin: Date,
        preferences: { type: Map, of: String }
      }
    },
    options: {
      schemaOptions: { timestamps: true, validateBeforeSave: true, strict: true },
      indexes: [
        { fields: { username: 1 }, options: { unique: true } },
        { fields: { email: 1, isActive: 1 }, options: { sparse: true } }
      ],
    },
    hooks: {
      pre: { save: jest.fn(), validate: jest.fn(), remove: jest.fn() },
      post: { save: jest.fn(), find: jest.fn(), update: jest.fn() },
    },
    methods: {
      comparePassword: jest.fn(),
      getFullProfile: jest.fn(),
      updateLastLogin: jest.fn()
    },
    statics: {
      findByEmail: jest.fn(),
      findActiveUsers: jest.fn(),
      countByTag: jest.fn()
    },
    virtuals: {
      displayAge: { get: jest.fn().mockReturnValue(25) },
      fullName: { get: jest.fn().mockReturnValue('John Doe'), set: jest.fn() },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockingoose.resetAll();
    schemaBuilder = new MongooseSchemaBuilder();
  });

  afterEach(() => {
    mongoose.deleteModel(/.+/);  // Delete all registered models in mongoose
  });

  describe('Model Name Validation', () => {
    it('should throw specific errors for different invalid model names', () => {
      const invalidNames = ['', ' ', null, undefined, 123, {}, []];
      const expectedMessage = ERROR_MESSAGES.MONGOOSE_BUILDER_MESSAGES.INVALID_MODEL_NAME;
  
      invalidNames.forEach(name => {
        expect(() => schemaBuilder.validateModelName(name))
          .toThrow(expect.objectContaining({
            name: 'ConfigurationError',
            message: expect.stringMatching(expectedMessage),
          }));
      });
    });
  
    it('should accept valid model names', () => {
      const validNames = ['User', 'UserModel', 'user_model', 'ComplexModel123'];
      validNames.forEach(name => {
        expect(() => schemaBuilder.validateModelName(name)).not.toThrow();
      });
    });
  });

  describe('Configuration Structure Validation', () => {
    it('should throw specific errors for invalid config properties', () => {
      const invalidConfigs = [null, undefined, [], {}, { options: {} }, { fields: null }];
  
      invalidConfigs.forEach(config => {
        let expectedMessage;
  
        if (config === null || config === undefined || Array.isArray(config) || typeof config !== 'object') {
          expectedMessage = ERROR_MESSAGES.MONGOOSE_BUILDER_MESSAGES.INVALID_CONFIG_STRUCTURE;
        } else if (!config.fields) {
          expectedMessage = ERROR_MESSAGES.MONGOOSE_BUILDER_MESSAGES.MISSING_FIELDS_OBJECT;
        }
  
        expect(() => schemaBuilder.validateConfigStructure(config))
          .toThrow(expect.objectContaining({
            name: 'ConfigurationError',
            message: expect.stringMatching(expectedMessage),
          }));
      });
    });
  
    it('should accept minimal valid configuration', () => {
      const minimalConfig = { fields: { name: String } };
      expect(() => schemaBuilder.validateConfigStructure(minimalConfig)).not.toThrow();
    });
  });

  describe('Hooks Application', () => {
    let TestModel;
    let schema;

    beforeEach(() => {
      TestModel = schemaBuilder.createModel('TestModelHooks', mockBaseConfig);
      schema = TestModel.schema;
    });

    it('should apply all pre-hooks correctly', () => {
      ['save', 'validate', 'remove'].forEach(method => {
        expect(schema.s.hooks._pres.get(method)).toContainEqual(expect.objectContaining({ fn: mockBaseConfig.hooks.pre[method] }));
      });
    });

    it('should apply all post-hooks correctly', () => {
      ['save', 'find', 'update'].forEach(method => {
        expect(schema.s.hooks._posts.get(method)).toContainEqual(expect.objectContaining({ fn: mockBaseConfig.hooks.post[method] }));
      });
    });
  });

  describe('Methods and Statics Application', () => {
    let TestModel;

    beforeEach(() => {
      TestModel = schemaBuilder.createModel('TestModelMethods', mockBaseConfig);
    });

    it('should apply all instance methods', () => {
      Object.keys(mockBaseConfig.methods).forEach(methodName => {
        expect(TestModel.prototype[methodName]).toBe(mockBaseConfig.methods[methodName]);
      });
    });

    it('should apply all static methods', () => {
      Object.keys(mockBaseConfig.statics).forEach(staticName => {
        expect(TestModel[staticName]).toBe(mockBaseConfig.statics[staticName]);
      });
    });
  });

  describe('Virtuals Application', () => {
    let TestModel;

    beforeEach(() => {
      TestModel = schemaBuilder.createModel('TestModelVirtuals', mockBaseConfig);
    });

    it('should apply getter and setter virtuals correctly', () => {
      const fullNameVirtual = TestModel.schema.virtuals.fullName;
      expect(fullNameVirtual.getters[0]).toBe(mockBaseConfig.virtuals.fullName.get);
      expect(fullNameVirtual.setters[0]).toBe(mockBaseConfig.virtuals.fullName.set);
    });

    it('should apply getter-only virtuals correctly', () => {
      const ageVirtual = TestModel.schema.virtuals.displayAge;
      expect(ageVirtual.getters[0]).toBe(mockBaseConfig.virtuals.displayAge.get);
      expect(ageVirtual.setters.length).toBe(0);
    });
  });

  describe('Indexes Application', () => {
    let TestModel;

    beforeEach(() => {
      TestModel = schemaBuilder.createModel('TestModelIndexes', mockBaseConfig);
    });

    it('should apply all configured indexes', () => {
      const indexes = TestModel.schema.indexes();
      
      expect(indexes).toContainEqual([{ username: 1 }, expect.objectContaining({ unique: true })]);
      expect(indexes).toContainEqual([{ email: 1, isActive: 1 }, expect.objectContaining({ sparse: true })]);
    });
  });

  describe('CRUD Operations with Mockingoose', () => {
    let UserModel;
    const mockDate = new Date('2024-01-01');
    
    // Helper function to convert Mongoose document to plain object
    const toComparableObject = (doc) => {
      const obj = doc.toObject ? doc.toObject() : doc;
      // Convert Mongoose Map to plain object
      if (obj.metadata?.preferences instanceof Map || obj.metadata?.preferences instanceof mongoose.Types.Map) {
        obj.metadata.preferences = Object.fromEntries(
          obj.metadata.preferences instanceof Map ? 
          obj.metadata.preferences.entries() : 
          obj.metadata.preferences.toObject()
        );
      }
      return obj;
    };
  
    const mockUser = {
      _id: '507f191e810c19729de860ea',
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword',
      isActive: true,
      tags: ['tag1', 'tag2'],
      metadata: {
        lastLogin: mockDate,
        preferences: { theme: 'dark' } // Plain object instead of Map
      }
    };
  
    beforeEach(() => {
      UserModel = schemaBuilder.createModel('TestUserCRUD', mockBaseConfig);
    });
  
    it('should handle create operations', async () => {
      // Setup mock
      mockingoose(UserModel).toReturn(mockUser, 'save');
  
      // Create new user
      const user = new UserModel(mockUser);
      const savedUser = await user.save();
  
      // Compare using helper function
      expect(toComparableObject(savedUser)).toMatchObject(
        expect.objectContaining({
          username: mockUser.username,
          email: mockUser.email,
          isActive: mockUser.isActive,
          tags: mockUser.tags,
          metadata: expect.objectContaining({
            lastLogin: mockUser.metadata.lastLogin,
            preferences: mockUser.metadata.preferences
          })
        })
      );
    });
  
    it('should handle read operations', async () => {
      // Setup mock
      mockingoose(UserModel).toReturn(mockUser, 'findOne');
  
      // Perform find operation
      const foundUser = await UserModel.findOne({ email: mockUser.email });
  
      // Compare using helper function
      expect(toComparableObject(foundUser)).toMatchObject(
        expect.objectContaining({
          username: mockUser.username,
          email: mockUser.email,
          metadata: expect.objectContaining({
            preferences: mockUser.metadata.preferences
          })
        })
      );
    });
  
    it('should handle update operations', async () => {
      // Setup updated user data
      const updatedUser = {
        ...mockUser,
        username: 'updateduser',
        metadata: {
          ...mockUser.metadata,
          preferences: { theme: 'light' }
        }
      };
  
      // Setup mock
      mockingoose(UserModel).toReturn(updatedUser, 'findOneAndUpdate');
  
      // Perform update
      const result = await UserModel.findOneAndUpdate(
        { email: mockUser.email },
        { 
          username: 'updateduser',
          'metadata.preferences': { theme: 'light' }
        },
        { new: true }
      );
  
      // Compare using helper function
      expect(toComparableObject(result)).toMatchObject(
        expect.objectContaining({
          username: 'updateduser',
          metadata: expect.objectContaining({
            preferences: { theme: 'light' }
          })
        })
      );
    });
  
    it('should handle delete operations', async () => {
      // Setup mock
      mockingoose(UserModel).toReturn(mockUser, 'findOneAndDelete');
  
      // Perform delete
      const deletedUser = await UserModel.findOneAndDelete({ email: mockUser.email });
  
      // Compare using helper function
      expect(toComparableObject(deletedUser)).toMatchObject(
        expect.objectContaining({
          username: mockUser.username,
          email: mockUser.email,
          metadata: expect.objectContaining({
            preferences: mockUser.metadata.preferences
          })
        })
      );
    });
  
    it('should handle validation errors', async () => {
      const invalidUser = new UserModel({
        // Missing required fields
        username: '',
        age: 150 // Exceeds max value
      });
  
      await expect(invalidUser.validate()).rejects.toThrow();
    });
  
    // Test error cases
    it('should handle find operation errors', async () => {
      // Setup mock to return error
      mockingoose(UserModel).toReturn(new Error('Database error'), 'findOne');
  
      await expect(UserModel.findOne({ email: 'nonexistent@email.com' }))
        .rejects.toThrow('Database error');
    });
  });
});
