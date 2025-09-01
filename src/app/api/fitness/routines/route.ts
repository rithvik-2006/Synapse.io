// import { NextRequest, NextResponse } from 'next/server';
// import connectDB  from '@/lib/db';
// import { WorkoutRoutine } from '@/models';

// // Helper function to validate workout routine data
// function validateRoutineData(data: any) {
//   if (!data.name || !data.exercises) {
//     throw new Error('Missing required fields: name, exercises');
//   }
  
//   return data;
// }

// // GET - Fetch all workout routines or a specific routine by ID
// export async function GET(request: NextRequest) {
//   try {
//     await connectDB();
    
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get('id');
//     const search = searchParams.get('search');
    
//     if (id) {
//       // Fetch specific routine
//       const routine = await WorkoutRoutine.findById(id);
//       if (!routine) {
//         return NextResponse.json(
//           { error: 'Workout routine not found' },
//           { status: 404 }
//         );
//       }
//       return NextResponse.json({ data: routine });
//     } else {
//       // Build query filters
//       let query: any = {};
//       if (search) {
//         query.$or = [
//           { name: { $regex: search, $options: 'i' } },
//           { exercises: { $regex: search, $options: 'i' } }
//         ];
//       }
      
//       // Fetch all routines with optional search
//       const routines = await WorkoutRoutine.find(query).sort({ createdAt: -1 });
//       return NextResponse.json({ data: routines });
//     }
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || 'Failed to fetch workout routines' },
//       { status: 500 }
//     );
//   }
// }

// // POST - Create a new workout routine
// export async function POST(request: NextRequest) {
//   try {
//     await connectDB();
    
//     const body = await request.json();
//     const validatedData = validateRoutineData(body);
    
//     const newRoutine = new WorkoutRoutine(validatedData);
//     const savedRoutine = await newRoutine.save();
    
//     return NextResponse.json(
//       { 
//         message: 'Workout routine created successfully',
//         data: savedRoutine 
//       },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || 'Failed to create workout routine' },
//       { status: 500 }
//     );
//   }
// }

// // PUT - Update an existing workout routine
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
//     const validatedData = validateRoutineData(body);
    
//     const updatedRoutine = await WorkoutRoutine.findByIdAndUpdate(
//       id,
//       validatedData,
//       { new: true, runValidators: true }
//     );
    
//     if (!updatedRoutine) {
//       return NextResponse.json(
//         { error: 'Workout routine not found' },
//         { status: 404 }
//       );
//     }
    
//     return NextResponse.json({
//       message: 'Workout routine updated successfully',
//       data: updatedRoutine
//     });
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || 'Failed to update workout routine' },
//       { status: 500 }
//     );
//   }
// }

// // DELETE - Delete a workout routine
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
    
//     const deletedRoutine = await WorkoutRoutine.findByIdAndDelete(id);
    
//     if (!deletedRoutine) {
//       return NextResponse.json(
//         { error: 'Workout routine not found' },
//         { status: 404 }
//       );
//     }
    
//     return NextResponse.json({
//       message: 'Workout routine deleted successfully',
//       data: deletedRoutine
//     });
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || 'Failed to delete workout routine' },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import connectDB  from '@/lib/db';
import { WorkoutRoutine } from '@/models';

// Define interface for workout routine data
interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  duration?: number;
  weight?: number;
  [key: string]: unknown;
}

interface WorkoutRoutineData {
  name: string;
  exercises: Exercise[] | string;
  description?: string;
  duration?: number;
  difficulty?: string;
  category?: string;
  [key: string]: unknown;
}

// Helper function to validate workout routine data
function validateRoutineData(data: Record<string, unknown>): WorkoutRoutineData {
  if (!data.name || !data.exercises) {
    throw new Error('Missing required fields: name, exercises');
  }
  
  return data as WorkoutRoutineData;
}

// GET - Fetch all workout routines or a specific routine by ID
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const search = searchParams.get('search');
    
    if (id) {
      // Fetch specific routine
      const routine = await WorkoutRoutine.findById(id);
      if (!routine) {
        return NextResponse.json(
          { error: 'Workout routine not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ data: routine });
    } else {
      // Build query filters
      const query: Record<string, unknown> = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { exercises: { $regex: search, $options: 'i' } }
        ];
      }
      
      // Fetch all routines with optional search
      const routines = await WorkoutRoutine.find(query).sort({ createdAt: -1 });
      return NextResponse.json({ data: routines });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch workout routines';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// POST - Create a new workout routine
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const validatedData = validateRoutineData(body);
    
    const newRoutine = new WorkoutRoutine(validatedData);
    const savedRoutine = await newRoutine.save();
    
    return NextResponse.json(
      { 
        message: 'Workout routine created successfully',
        data: savedRoutine 
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create workout routine';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT - Update an existing workout routine
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
    const validatedData = validateRoutineData(body);
    
    const updatedRoutine = await WorkoutRoutine.findByIdAndUpdate(
      id,
      validatedData,
      { new: true, runValidators: true }
    );
    
    if (!updatedRoutine) {
      return NextResponse.json(
        { error: 'Workout routine not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Workout routine updated successfully',
      data: updatedRoutine
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update workout routine';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE - Delete a workout routine
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
    
    const deletedRoutine = await WorkoutRoutine.findByIdAndDelete(id);
    
    if (!deletedRoutine) {
      return NextResponse.json(
        { error: 'Workout routine not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Workout routine deleted successfully',
      data: deletedRoutine
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete workout routine';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}