import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  height: {
    type: Number,
    required: true,
    min: 0 // Height in centimeters
  },
  // You can add more profile fields here in the future
  userId: {
    type: String,
    default: 'default', // For single user, but can be extended for multi-user
    unique: true
  }
}, {
  timestamps: true
});

export const UserProfile = mongoose.models.UserProfile || mongoose.model('UserProfile', userProfileSchema);
