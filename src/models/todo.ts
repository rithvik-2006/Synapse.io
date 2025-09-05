// models/todo.ts
import mongoose, { Schema, Document, models } from "mongoose";

export interface ITodo extends Document {
  title: string;
  completed: boolean;
  createdAt: Date;
}

const TodoSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.Todo || mongoose.model<ITodo>("Todo", TodoSchema);
