// models/Grade.ts
import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    trim: true
  },
  grade: {
    type: String,
    required: true,
    trim: true
  },
  credits: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

export const Grade = mongoose.models.Grade || mongoose.model('Grade', gradeSchema);




