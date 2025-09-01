import mongoose from 'mongoose';

// Define JobStatus enum
export enum JobStatus {
  APPLIED = "Applied",
  OA = "OA",
  INTERVIEW = "Interview",
  OFFER = "Offer",
  REJECTED = "Rejected"
}

const jobApplicationSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(JobStatus),
    default: JobStatus.APPLIED
  }
}, {
  timestamps: true
});

export const JobApplication = mongoose.models.JobApplication || mongoose.model('JobApplication', jobApplicationSchema);
