import mongoose from 'mongoose';
// models/Assignment.ts
const assignmentSchema = new mongoose.Schema({
    subject: {
      type: String,
      required: true,
      trim: true
    },
    desc: {
      type: String,
      required: true,
      trim: true
    },
    due: {
      type: String,
      required: true
    }
  }, {
    timestamps: true
  });
  
  export const Assignment = mongoose.models.Assignment || mongoose.model('Assignment', assignmentSchema);