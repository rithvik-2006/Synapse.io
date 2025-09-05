// app/api/todos/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db"; // your MongoDB connection helper
import Todo from "@/models/todo";

// GET all todos
export async function GET() {
  try {
    await connectDB();
    const todos = await Todo.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: todos });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

// POST new todo
export async function POST(req: Request) {
  try {
    await connectDB();
    const { title } = await req.json();
    const todo = await Todo.create({ title });
    return NextResponse.json({ success: true, data: todo });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
