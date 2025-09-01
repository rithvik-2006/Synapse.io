import { NextRequest, NextResponse } from 'next/server';
import connectDB  from '@/lib/db';
import { Assignment } from '@/models';

interface AssignmentData {
  subject: string;
  desc: string;
  due: string | Date;
  status?: string;
  priority?: string;
  estimatedHours?: number;
  notes?: string;
  [key: string]: unknown;
}

function validateAssignmentData(data: Record<string, unknown>): AssignmentData {
  if (!data.subject || !data.desc || !data.due) {
    throw new Error('Missing required fields: subject, desc, due');
  }
  
  return data as AssignmentData;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      const assignment = await Assignment.findById(id);
      if (!assignment) {
        return NextResponse.json(
          { error: 'Assignment not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ data: assignment });
    } else {
      const assignments = await Assignment.find({}).sort({ createdAt: -1 });
      return NextResponse.json({ data: assignments });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch assignments';
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
    const validatedData = validateAssignmentData(body);
    
    const newAssignment = new Assignment(validatedData);
    const savedAssignment = await newAssignment.save();
    
    return NextResponse.json(
      { 
        message: 'Assignment created successfully',
        data: savedAssignment 
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create assignment';
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
    const validatedData = validateAssignmentData(body);
    
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      id,
      validatedData,
      { new: true, runValidators: true }
    );
    
    if (!updatedAssignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Assignment updated successfully',
      data: updatedAssignment
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update assignment';
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
    
    const deletedAssignment = await Assignment.findByIdAndDelete(id);
    
    if (!deletedAssignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Assignment deleted successfully',
      data: deletedAssignment
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete assignment';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}