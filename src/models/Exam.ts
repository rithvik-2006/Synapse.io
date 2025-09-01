import mongoose from 'mongoose';
// models/Exam.ts
const examSchema = new mongoose.Schema({
    subject: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: String,
      required: true
    }
  }, {
    timestamps: true
  });
  
  export const Exam = mongoose.models.Exam || mongoose.model('Exam', examSchema);