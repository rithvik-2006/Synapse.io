// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from "@/lib/db"
// import { Grade } from '@/models';

// // Helper function to validate grade data
// function validateGradeData(data: any) {
//   if (!data.subject || !data.grade || data.credits === undefined) {
//     throw new Error('Missing required fields: subject, grade, credits');
//   }
  
//   // Convert credits to number
//   data.credits = parseInt(data.credits);
//   if (isNaN(data.credits)) {
//     throw new Error('Credits must be a valid number');
//   }
  
//   return data;
// }

// // GET - Fetch all grades or a specific grade by ID
// export async function GET(request: NextRequest) {
//   try {
//     await connectDB();
    
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get('id');
    
//     if (id) {
//       // Fetch specific grade
//       const grade = await Grade.findById(id);
//       if (!grade) {
//         return NextResponse.json(
//           { error: 'Grade not found' },
//           { status: 404 }
//         );
//       }
//       return NextResponse.json({ data: grade });
//     } else {
//       // Fetch all grades
//       const grades = await Grade.find({}).sort({ createdAt: -1 });
//       return NextResponse.json({ data: grades });
//     }
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || 'Failed to fetch grades' },
//       { status: 500 }
//     );
//   }
// }

// // POST - Create a new grade
// export async function POST(request: NextRequest) {
//   try {
//     await connectDB();
    
//     const body = await request.json();
//     const validatedData = validateGradeData(body);
    
//     const newGrade = new Grade(validatedData);
//     const savedGrade = await newGrade.save();
    
//     return NextResponse.json(
//       { 
//         message: 'Grade created successfully',
//         data: savedGrade 
//       },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || 'Failed to create grade' },
//       { status: 500 }
//     );
//   }
// }

// // PUT - Update an existing grade
// export async function PUT(request: NextRequest) {
//   try {
//     await connectDB();
    
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get('id');
    
//     if (!id) {
//       return NextResponse.json(
//         { error: 'ID is required for update' },
//         { status: 400 }
//       );
//     }
    
//     const body = await request.json();
//     const validatedData = validateGradeData(body);
    
//     const updatedGrade = await Grade.findByIdAndUpdate(
//       id,
//       validatedData,
//       { new: true, runValidators: true }
//     );
    
//     if (!updatedGrade) {
//       return NextResponse.json(
//         { error: 'Grade not found' },
//         { status: 404 }
//       );
//     }
    
//     return NextResponse.json({
//       message: 'Grade updated successfully',
//       data: updatedGrade
//     });
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || 'Failed to update grade' },
//       { status: 500 }
//     );
//   }
// }

// // DELETE - Delete a grade
// export async function DELETE(request: NextRequest) {
//   try {
//     await connectDB();
    
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get('id');
    
//     if (!id) {
//       return NextResponse.json(
//         { error: 'ID is required for deletion' },
//         { status: 400 }
//       );
//     }
    
//     const deletedGrade = await Grade.findByIdAndDelete(id);
    
//     if (!deletedGrade) {
//       return NextResponse.json(
//         { error: 'Grade not found' },
//         { status: 404 }
//       );
//     }
    
//     return NextResponse.json({
//       message: 'Grade deleted successfully',
//       data: deletedGrade
//     });
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || 'Failed to delete grade' },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import connectDB from "@/lib/db"
import { Grade } from '@/models';

interface GradeData {
  subject: string;
  grade: string | number;
  credits: number;
  semester?: string;
  year?: string | number;
  gpa?: number;
  description?: string;
  [key: string]: unknown;
}

function validateGradeData(data: Record<string, unknown>): GradeData {
  if (!data.subject || !data.grade || data.credits === undefined) {
    throw new Error('Missing required fields: subject, grade, credits');
  }
  
  const credits = parseInt(data.credits as string);
  if (isNaN(credits)) {
    throw new Error('Credits must be a valid number');
  }
  
  return {
    ...data,
    credits
  } as GradeData;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      const grade = await Grade.findById(id);
      if (!grade) {
        return NextResponse.json(
          { error: 'Grade not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ data: grade });
    } else {
      const grades = await Grade.find({}).sort({ createdAt: -1 });
      return NextResponse.json({ data: grades });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch grades';
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
    const validatedData = validateGradeData(body);
    
    const newGrade = new Grade(validatedData);
    const savedGrade = await newGrade.save();
    
    return NextResponse.json(
      { 
        message: 'Grade created successfully',
        data: savedGrade 
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create grade';
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
    const validatedData = validateGradeData(body);
    
    const updatedGrade = await Grade.findByIdAndUpdate(
      id,
      validatedData,
      { new: true, runValidators: true }
    );
    
    if (!updatedGrade) {
      return NextResponse.json(
        { error: 'Grade not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Grade updated successfully',
      data: updatedGrade
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update grade';
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
    
    const deletedGrade = await Grade.findByIdAndDelete(id);
    
    if (!deletedGrade) {
      return NextResponse.json(
        { error: 'Grade not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Grade deleted successfully',
      data: deletedGrade
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete grade';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}