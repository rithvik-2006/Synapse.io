import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Exam } from '@/models';

interface ExamData {
  subject: string;
  date: string | Date;
  time?: string;
  duration?: number;
  location?: string;
  description?: string;
  status?: string;
  grade?: number;
  [key: string]: unknown;
}

function validateExamData(data: Record<string, unknown>): ExamData {
  if (!data.subject || !data.date) {
    throw new Error('Missing required fields: subject, date');
  }
  
  return data as ExamData;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      const exam = await Exam.findById(id);
      if (!exam) {
        return NextResponse.json(
          { error: 'Exam not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ data: exam });
    } else {
      const exams = await Exam.find({}).sort({ createdAt: -1 });
      return NextResponse.json({ data: exams });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch exams';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const validatedData = validateExamData(body);
    
    const newExam = new Exam(validatedData);
    const savedExam = await newExam.save();
    
    return NextResponse.json(
      { 
        message: 'Exam created successfully',
        data: savedExam 
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create exam';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required for update' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const validatedData = validateExamData(body);
    
    const updatedExam = await Exam.findByIdAndUpdate(
      id,
      validatedData,
      { new: true, runValidators: true }
    );
    
    if (!updatedExam) {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Exam updated successfully',
      data: updatedExam
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update exam';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required for deletion' },
        { status: 400 }
      );
    }
    
    const deletedExam = await Exam.findByIdAndDelete(id);
    
    if (!deletedExam) {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Exam deleted successfully',
      data: deletedExam
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete exam';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}