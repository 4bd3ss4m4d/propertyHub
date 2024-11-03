/**
 * MongooseSchemaBuilder.js
 *
 * This module defines the MongooseSchemaBuilder class, which provides an interface
 * for dynamically creating and configuring Mongoose schemas and models. The class 
 * encapsulates schema-related functionality such as defining fields, methods, statics, 
 * virtuals, and indexes, with built-in validation for required configurations.
 *
 * Usage:
 * - This class is intended for use in applications that need to programmatically
 *   define and register Mongoose models with dynamic configurations.
 * - Dependencies: Requires Mongoose and the custom error handling module.
 */

import mongoose from 'mongoose';
import { ConfigurationError } from '../errors/customErrors.js';
import ERROR_MESSAGES from '../../constants/errorMessages.js';


/**
 * MongooseSchemaBuilder
 *
 * A utility class for creating and configuring Mongoose models with dynamic schemas,
 * fields, hooks, methods, virtuals, and indexes. This class provides schema validation
 * and standardized configuration handling for constructing robust, reusable models.
 *
 * Example:
 *   const schemaBuilder = new MongooseSchemaBuilder();
 *   const UserModel = schemaBuilder.createModel('User', userSchemaConfig);
 *
 * Methods:
 * - `createModel`: Main method for generating a Mongoose model from the provided configuration.
 * - `validateModelName`: Ensures model name is a non-empty string.
 * - `validateConfigStructure`: Validates the structure of the schema configuration.
 * - `applyHooks`, `applyMethods`, `applyStatics`, `applyVirtuals`, `applyIndexes`:
 *   Helper methods for applying schema customizations.
 */
export class MongooseSchemaBuilder {
  /**
   * Creates a Mongoose model from the provided configuration
   * @param {string} modelName - The name of the model
   * @param {Object} config - Schema configuration object
   * @returns {mongoose.Model} - The created Mongoose model
   */
  createModel(modelName, config) {
    this.validateModelName(modelName);
    this.validateConfigStructure(config);

    // Extract main components from config
    const { fields, options, hooks, methods, statics, virtuals } = config;

    // Create schema with fields and schema options
    const schema = new mongoose.Schema(
      fields,
      options?.schemaOptions || { timestamps: true }
    );

    // Apply all schema configurations
    this.applyHooks(schema, hooks);
    this.applyMethods(schema, methods);
    this.applyStatics(schema, statics);
    this.applyVirtuals(schema, virtuals);
    this.applyIndexes(schema, options?.indexes);

    return mongoose.model(modelName, schema);
  }

  /**
   * Validates the provided model name to ensure it is a non-empty string.
   * Throws a ConfigurationError if validation fails.
   * @param {string} modelName - The name of the model.
   * @throws {ConfigurationError} If modelName is invalid.
   */
  validateModelName(modelName) {
    if (typeof modelName !== 'string' || !modelName.trim()) {
      throw new ConfigurationError(ERROR_MESSAGES.MONGOOSE_BUILDER_MESSAGES.INVALID_MODEL_NAME);
    }
  }
  /**
   * Validates the structure of the configuration object, ensuring required
   * properties are present and of the correct type.
   * @param {Object} config - Configuration object containing schema fields and options.
   * @throws {ConfigurationError} If config is missing required properties.
   */
  validateConfigStructure(config) {
    if (!config || typeof config !== 'object' || Array.isArray(config)) {
      throw new ConfigurationError(ERROR_MESSAGES.MONGOOSE_BUILDER_MESSAGES.INVALID_CONFIG_STRUCTURE);
    }

    if (!config.fields) {
      throw new ConfigurationError(ERROR_MESSAGES.MONGOOSE_BUILDER_MESSAGES.MISSING_FIELDS_OBJECT);
    }
  }

  /**
   * Applies pre and post middleware hooks to the schema.
   * @param {mongoose.Schema} schema - Mongoose schema instance to apply hooks on.
   * @param {Object} hooks - Object containing pre and post hooks by hook name.
   */
  applyHooks(schema, hooks) {
    if (!hooks) return;

    // Apply pre hooks
    if (hooks.pre) {
      Object.entries(hooks.pre).forEach(([method, handler]) => {
        schema.pre(method, handler);
      });
    }

    // Apply post hooks
    if (hooks.post) {
      Object.entries(hooks.post).forEach(([method, handler]) => {
        schema.post(method, handler);
      });
    }
  }

  /**
   * Adds instance methods to the schema, enabling each document to have
   * custom behaviors.
   * @param {mongoose.Schema} schema - Mongoose schema instance to attach methods.
   * @param {Object} methods - Object with method names as keys and function implementations as values.
   */
  applyMethods(schema, methods) {
    if (methods) {
      Object.entries(methods).forEach(([methodName, handler]) => {
        schema.methods[methodName] = handler;
      });
    }
  }

  /**
   * Adds static methods to the schema, providing model-level functions
   * that can be called directly on the Mongoose model.
   * @param {mongoose.Schema} schema - Mongoose schema instance to attach static methods.
   * @param {Object} statics - Object with static method names as keys and function implementations as values.
   */
  applyStatics(schema, statics) {
    if (statics) {
      Object.entries(statics).forEach(([staticName, handler]) => {
        schema.statics[staticName] = handler;
      });
    }
  }

  /**
   * Defines virtual properties on the schema, allowing computed properties
   * that do not get persisted to the database.
   * @param {mongoose.Schema} schema - Mongoose schema instance to attach virtuals.
   * @param {Object} virtuals - Object containing virtual names and their configurations, with get and/or set handlers.
   */
  applyVirtuals(schema, virtuals) {
    if (virtuals) {
      Object.entries(virtuals).forEach(([virtualName, config]) => {
        const virtual = schema.virtual(virtualName);
        if (config.get) virtual.get(config.get);
        if (config.set) virtual.set(config.set);
      });
    }
  }

  /**
   * Adds custom indexes to the schema for optimizing query performance
   * on specified fields.
   * @param {mongoose.Schema} schema - Mongoose schema instance to apply indexes to.
   * @param {Array<Object>} indexes - Array of index objects, each containing `fields` and `options`.
   */
  applyIndexes(schema, indexes) {
    if (indexes) {
      indexes.forEach(index => {
        schema.index(index.fields, index.options);
      });
    }
  }
}

// Export singleton instance
export const schemaBuilder = new MongooseSchemaBuilder();