import mongoose from 'mongoose';

/**
 * Maps field types to corresponding Mongoose types.
 * Supports subdocuments and arrays.
 * @param {Object} field - Field definition from config.
 * @param {Function} schemaConverter - Function to handle subdocument conversion.
 * @returns {Object} Mongoose schema type or subdocument schema.
 */
export const mapToMongooseType = (field, schemaConverter) => {
  const typeMap = {
    String: String,
    Number: Number,
    Boolean: Boolean,
    Date: Date,
    ObjectId: mongoose.Schema.Types.ObjectId,
    Array: Array,
    Mixed: mongoose.Schema.Types.Mixed,
    Buffer: mongoose.Schema.Types.Buffer,
    Decimal128: mongoose.Schema.Types.Decimal128,
    Map: Map,
  };

  // Support for subdocuments (nested objects)
  if (typeof field.type === 'object' && !Array.isArray(field.type)) {
    return new mongoose.Schema(schemaConverter(field.type)); // Recursively handle subdocuments
  }

  // Handle arrays: Arrays of subdocuments or primitive types
  if (Array.isArray(field.type)) {
    return [{ type: mapToMongooseType({ type: field.type[0] }, schemaConverter) }];
  }

  // Handle primitive and mapped types
  return typeMap[field.type] || field.type;
};
