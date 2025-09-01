import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Assessment, AssessmentType } from '@/models';

interface AssessmentData {
  company: string;
  type: string;
  date: string | Date;
  position?: string;
  status?: string;
  description?: string;
  result?: string;
  notes?: string;
  [key: string]: unknown;
}

function validateAssessmentData(data: Record<string, unknown>): AssessmentData {
  if (!data.company || !data.type || !data.date) {
    throw new Error('Missing required fields: company, type, date');
  }
  
  if (!Object.values(AssessmentType).includes(data.type as AssessmentType)) {
    throw new Error(`Invalid type. Must be one of: ${Object.values(AssessmentType).join(', ')}`);
  }
  
  return data as AssessmentData;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      const assessment = await Assessment.findById(id);
      if (!assessment) {
        return NextResponse.json(
          { error: 'Assessment not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ data: assessment });
    } else {
      const assessments = await Assessment.find({}).sort({ date: 1, createdAt: -1 });
      return NextResponse.json({ data: assessments });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch assessments';
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
    const validatedData = validateAssessmentData(body);
    
    const newAssessment = new Assessment(validatedData);
    const savedAssessment = await newAssessment.save();
    
    return NextResponse.json(
      { 
        message: 'Assessment created successfully',
        data: savedAssessment 
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create assessment';
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
    
    const deletedAssessment = await Assessment.findByIdAndDelete(id);
    
    if (!deletedAssessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Assessment deleted successfully',
      data: deletedAssessment
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete assessment';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}