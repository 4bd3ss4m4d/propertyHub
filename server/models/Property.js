/**
 * This file contains the property model.
 */

import mongoose from 'mongoose';

// Create the schema for the Property model
const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required.'],
    maxlength: [100, 'Title cannot exceed 100 characters.']
  },
  description: {
    type: String,
    required: [true, 'Description is required.'],
    maxlength: [500, 'Description cannot exceed 500 characters.']
  },
  propertyType: {
    type: String,
    enum: ['Apartment', 'House', 'Condo', 'Land', 'Villa', 'Office', 'Studio'],
    required: [true, 'Property type is required.']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required.'],
    match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number.'], // E.164 format
  },
  price: {
    type: Number,
    required: [true, 'Price is required.'],
    min: [0, 'Price must be a positive number.'],
    validate: {
      validator: function (value) {
        return Number.isInteger(value); // Ensure price is an integer
      },
      message: 'Price must be a whole number (integer).'
    }
  },
  status: {
    type: String,
    enum: ['Available', 'Sold', 'Rented', 'Pending'],
    default: 'Available'
  },
  size: {
    type: Number, // Size in square feet/meters
    required: [true, 'Property size is required.'],
    min: [0, 'Size must be a positive number.'],
  },
  bedrooms: {
    type: Number,
    required: [true, 'Number of bedrooms is required.'],
    min: [1, 'Bedrooms must be at least 1.']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Number of bathrooms is required.'],
    min: [1, 'Bathrooms must be at least 1.']
  },
  rooms: {
    type: Number,
    required: [true, 'Number of rooms is required.'],
    min: [1, 'Rooms must be at least 1.']
  },
  offerType: {
    type: String,
    enum: ['Sale', 'Rent'], // Offer type must be either for Sale or Rent
    required: [true, 'Offer type is required.']
  },
  wifi: {
    type: Boolean,
    default: false, // Boolean to indicate if Wi-Fi is available
  },
  petFriendly: {
    type: Boolean,
    default: false, // Boolean to indicate if the property is pet-friendly
  },
  parking: {
    type: Boolean,
    default: false, // Boolean to indicate if parking is available
  },
  yearBuilt: {
    type: Number,
    min: [1800, 'Year built must be after 1800.'],
    max: [new Date().getFullYear(), 'Year built cannot be in the future.'],
  },
  availableFrom: {
    type: Date,
    required: [true, 'Available date is required.'],
    default: Date.now, // Set default availability to current date
  },
  userId: {
    type: String,
    required: true
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required.'],
      maxlength: [100, 'Street address cannot exceed 100 characters.']
    },
    city: {
      type: String,
      required: [true, 'City is required.']
    },
    state: {
      type: String,
      required: [true, 'State is required.']
    },
    zipCode: {
      type: String,
      required: [true, 'Zip code is required.'],
      match: [/^\d{5}(-\d{4})?$/, 'Please provide a valid zip code.']
    },
    country: {
      type: String,
      required: [true, 'Country is required.'],
      default: 'USA'
    }
  },
  images: [
    {
      type: String,
      validate: {
        validator: function (value) {
          return 
        },
        message: 'Please provide a valid image URL (jpg, jpeg, png, or webp).'
      }
    }
  ],
  amenities: {
    type: [String],
    default: [],
    validate: {
      validator: function (amenitiesArray) {
        return amenitiesArray.every(amenity => typeof amenity === 'string');
      },
      message: 'All amenities must be valid strings.'
    }
  },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User (agent/owner) model
    required: [true, 'An agent is required to manage this property.']
  },
  isFeatured: {
    type: Boolean,
    default: false, // Boolean to mark properties as featured listings
  },
  coordinates: {
    lat: {
      type: Number,
      required: [true, 'Latitude is required.'],
      min: [-90, 'Latitude must be between -90 and 90 degrees.'],
      max: [90, 'Latitude must be between -90 and 90 degrees.']
    },
    lng: {
      type: Number,
      required: [true, 'Longitude is required.'],
      min: [-180, 'Longitude must be between -180 and 180 degrees.'],
      max: [180, 'Longitude must be between -180 and 180 degrees.']
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Pre-save middleware to update `updatedAt` before saving
propertySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual property for displaying full address
propertySchema.virtual('fullAddress').get(function () {
  return `${this.address.street}, ${this.address.city}, ${this.address.state}, ${this.address.zipCode}, ${this.address.country}`;
});

// Indexing fields for faster queries (e.g., searching properties by price, status, or agent)
propertySchema.index({ price: 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ agentId: 1 });
propertySchema.index({ offerType: 1 });

const Property = mongoose.model('Property', propertySchema);

export default Property;
