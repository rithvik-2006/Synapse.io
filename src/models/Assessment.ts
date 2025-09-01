import mongoose from 'mongoose';

// Define AssessmentType enum
export enum AssessmentType {
  OA = "OA",
  INTERVIEW = "Interview"
}

const assessmentSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: Object.values(AssessmentType)
  },
  date: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export const Assessment = mongoose.models.Assessment || mongoose.model('Assessment', assessmentSchema);
