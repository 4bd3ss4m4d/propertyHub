import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import { mapToMongooseType } from '../../../utils/db/typeMapper.js';

// Mock schema converter for subdocuments
const mockSchemaConverter = jest.fn((subDoc) => subDoc);

describe('mapToMongooseType function', () => {

  // Primitive type tests
  test('should map String type correctly', () => {
    const field = { type: 'String' };
    const result = mapToMongooseType(field, mockSchemaConverter);
    expect(result).toBe(String);
  });

  test('should map Number type correctly', () => {
    const field = { type: 'Number' };
    const result = mapToMongooseType(field, mockSchemaConverter);
    expect(result).toBe(Number);
  });

  test('should map Boolean type correctly', () => {
    const field = { type: 'Boolean' };
    const result = mapToMongooseType(field, mockSchemaConverter);
    expect(result).toBe(Boolean);
  });

  test('should map Date type correctly', () => {
    const field = { type: 'Date' };
    const result = mapToMongooseType(field, mockSchemaConverter);
    expect(result).toBe(Date);
  });

  test('should map ObjectId type correctly', () => {
    const field = { type: 'ObjectId' };
    const result = mapToMongooseType(field, mockSchemaConverter);
    expect(result).toBe(mongoose.Schema.Types.ObjectId);
  });

  test('should map Mixed type correctly', () => {
    const field = { type: 'Mixed' };
    const result = mapToMongooseType(field, mockSchemaConverter);
    expect(result).toBe(mongoose.Schema.Types.Mixed);
  });

  test('should map Buffer type correctly', () => {
    const field = { type: 'Buffer' };
    const result = mapToMongooseType(field, mockSchemaConverter);
    expect(result).toBe(mongoose.Schema.Types.Buffer);
  });

  test('should map Decimal128 type correctly', () => {
    const field = { type: 'Decimal128' };
    const result = mapToMongooseType(field, mockSchemaConverter);
    expect(result).toBe(mongoose.Schema.Types.Decimal128);
  });

  test('should map Map type correctly', () => {
    const field = { type: 'Map' };
    const result = mapToMongooseType(field, mockSchemaConverter);
    expect(result).toBe(Map);
  });

  // Arrays of primitive types
  test('should map an array of String type correctly', () => {
    const field = { type: ['String'] };
    const result = mapToMongooseType(field, mockSchemaConverter);
    expect(result).toEqual([{ type: String }]);
  });

  test('should map an array of ObjectId type correctly', () => {
    const field = { type: ['ObjectId'] };
    const result = mapToMongooseType(field, mockSchemaConverter);
    expect(result).toEqual([{ type: mongoose.Schema.Types.ObjectId }]);
  });

  // Subdocuments (nested objects)
  test('should map subdocument type correctly', () => {
    const field = {
      type: {
        firstName: { type: 'String' },
        lastName: { type: 'String' },
      },
    };

    const result = mapToMongooseType(field, mockSchemaConverter);

    // Use toMatchObject to ignore dynamic internal properties like $id
    expect(result).toBeInstanceOf(mongoose.Schema);
    expect(result.obj).toMatchObject({
      firstName: { type: 'String' },
      lastName: { type: 'String' },
    });
  });

// Arrays of subdocuments
test('should map an array of subdocuments correctly', () => {
  const field = {
    type: [
      {
        firstName: { type: 'String' },
        lastName: { type: 'String' },
      },
    ],
  };

  const result = mapToMongooseType(field, mockSchemaConverter);

  // Instead of matching the whole schema object, we focus on the relevant structure
  expect(result[0].type.obj).toEqual({
    firstName: { type: 'String' },
    lastName: { type: 'String' },
  });
});


  // Edge cases
  test('should return unrecognized types as-is', () => {
    const field = { type: 'CustomType' };
    const result = mapToMongooseType(field, mockSchemaConverter);
    expect(result).toBe('CustomType');
  });

  test('should handle empty field type', () => {
    const field = { type: undefined };
    const result = mapToMongooseType(field, mockSchemaConverter);
    expect(result).toBeUndefined();
  });
});
