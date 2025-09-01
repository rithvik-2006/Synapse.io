import mongoose from 'mongoose';

const weightLogSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    required: true,
    min: 0
  },
  // BMI will be calculated on the fly using height from user profile
  bmi: {
    type: Number,
    min: 0
  }
}, {
  timestamps: true
});

export const WeightLog = mongoose.models.WeightLog || mongoose.model('WeightLog', weightLogSchema);
