// // app/api/todos/[id]/route.ts
// import { NextResponse } from "next/server";
// import connectDB from "@/lib/db";
// import Todo from "@/models/todo";

// interface Params {
//   params: { id: string };
// }

// // UPDATE todo
// export async function PUT(req: Request, { params }: Params) {
//   try {
//     await connectDB();
//     const { id } = params;
//     const { title, completed } = await req.json();
//     const updated = await Todo.findByIdAndUpdate(
//       id,
//       { title, completed },
//       { new: true }
//     );
//     return NextResponse.json({ success: true, data: updated });
//   } catch (error) {
//     return NextResponse.json({ success: false, error }, { status: 500 });
//   }
// }

// // DELETE todo
// export async function DELETE(_: Request, { params }: Params) {
//   try {
//     await connectDB();
//     const { id } = params;
//     await Todo.findByIdAndDelete(id);
//     return NextResponse.json({ success: true, message: "Todo deleted" });
//   } catch (error) {
//     return NextResponse.json({ success: false, error }, { status: 500 });
//   }
// }
// app/api/todos/[id]/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Todo from "@/models/todo";

interface Params {
  params: Promise<{ id: string }>;
}

// UPDATE todo
export async function PUT(req: Request, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params; // Await params before destructuring
    const { title, completed } = await req.json();
    const updated = await Todo.findByIdAndUpdate(
      id,
      { title, completed },
      { new: true }
    );
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

// DELETE todo
export async function DELETE(_: Request, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params; // Await params before destructuring
    await Todo.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Todo deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}