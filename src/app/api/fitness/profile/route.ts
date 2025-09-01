// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '@/lib/db';
// import { UserProfile } from '@/models';

// // Helper function to validate profile data
// function validateProfileData(data: any) {
//   if (data.height === undefined) {
//     throw new Error('Missing required field: height');
//   }
  
//   // Convert height to number
//   data.height = parseFloat(data.height);
//   if (isNaN(data.height) || data.height <= 0) {
//     throw new Error('Height must be a valid positive number');
//   }
  
//   return data;
// }

// // GET - Fetch user profile
// export async function GET(request: NextRequest) {
//   try {
//     await connectDB();
    
//     const userProfile = await UserProfile.findOne({ userId: 'default' });
    
//     if (!userProfile) {
//       return NextResponse.json(
//         { error: 'User profile not found' },
//         { status: 404 }
//       );
//     }
    
//     return NextResponse.json({ data: userProfile });
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || 'Failed to fetch user profile' },
//       { status: 500 }
//     );
//   }
// }

// // POST - Create or update user profile
// export async function POST(request: NextRequest) {
//   try {
//     await connectDB();
    
//     const body = await request.json();
//     const validatedData = validateProfileData(body);
    
//     // Use upsert to create or update
//     const userProfile = await UserProfile.findOneAndUpdate(
//       { userId: 'default' },
//       { ...validatedData, userId: 'default' },
//       { new: true, upsert: true, runValidators: true }
//     );
    
//     return NextResponse.json(
//       { 
//         message: 'User profile saved successfully',
//         data: userProfile 
//       },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || 'Failed to save user profile' },
//       { status: 500 }
//     );
//   }
// }

// // PUT - Update user profile (alias for POST for consistency)
// export async function PUT(request: NextRequest) {
//   return POST(request);
// }

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { UserProfile } from '@/models';

// Define interface for profile data
interface ProfileData {
  height: number;
  weight?: number;
  age?: number;
  gender?: string;
  activityLevel?: string;
  fitnessGoal?: string;
  userId?: string;
  [key: string]: unknown; // For any additional fields
}

// Helper function to validate profile data
function validateProfileData(data: Record<string, unknown>): ProfileData {
  if (data.height === undefined) {
    throw new Error('Missing required field: height');
  }
  
  // Convert height to number
  const height = parseFloat(data.height as string);
  if (isNaN(height) || height <= 0) {
    throw new Error('Height must be a valid positive number');
  }
  
  return {
    ...data,
    height
  } as ProfileData;
}

// GET - Fetch user profile
export async function GET() {
  try {
    await connectDB();
    
    const userProfile = await UserProfile.findOne({ userId: 'default' });
    
    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ data: userProfile });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user profile';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// POST - Create or update user profile
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const validatedData = validateProfileData(body);
    
    // Use upsert to create or update
    const userProfile = await UserProfile.findOneAndUpdate(
      { userId: 'default' },
      { ...validatedData, userId: 'default' },
      { new: true, upsert: true, runValidators: true }
    );
    
    return NextResponse.json(
      { 
        message: 'User profile saved successfully',
        data: userProfile 
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to save user profile';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT - Update user profile (alias for POST for consistency)
export async function PUT(request: NextRequest) {
  return POST(request);
}