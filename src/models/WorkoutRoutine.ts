import mongoose from 'mongoose';

const workoutRoutineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  exercises: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

export const WorkoutRoutine = mongoose.models.WorkoutRoutine || mongoose.model('WorkoutRoutine', workoutRoutineSchema);
