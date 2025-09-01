// import { NextRequest, NextResponse } from 'next/server';
// import connectToDB from '@/lib/db';
// import { WeightLog, UserProfile } from '@/models';
// import connectDB from '@/lib/db';

// // Helper function to calculate BMI
// function calculateBMI(weight: number, height: number): number {
//   // BMI = weight (kg) / (height (m))^2
//   // height is in cm, so convert to meters
//   const heightInMeters = height / 100;
//   return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));
// }

// // Helper function to validate weight data
// async function validateWeightData(data: any) {
//   if (!data.date || data.weight === undefined) {
//     throw new Error('Missing required fields: date, weight');
//   }
  
//   // Convert weight to number
//   data.weight = parseFloat(data.weight);
//   if (isNaN(data.weight) || data.weight <= 0) {
//     throw new Error('Weight must be a valid positive number');
//   }
  
//   // Get user's height to calculate BMI
//   const userProfile = await UserProfile.findOne({ userId: 'default' });
//   if (userProfile && userProfile.height) {
//     data.bmi = calculateBMI(data.weight, userProfile.height);
//   }
  
//   return data;
// }

// // GET - Fetch all weight logs or a specific log by ID
// export async function GET(request: NextRequest) {
//   try {
//     await connectDB();
    
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get('id');
//     const limit = searchParams.get('limit');
//     const fromDate = searchParams.get('fromDate');
//     const toDate = searchParams.get('toDate');
    
//     if (id) {
//       // Fetch specific weight log
//       const weightLog = await WeightLog.findById(id);
//       if (!weightLog) {
//         return NextResponse.json(
//           { error: 'Weight log not found' },
//           { status: 404 }
//         );
//       }
//       return NextResponse.json({ data: weightLog });
//     } else {
//       // Build query filters
//       let query: any = {};
//       if (fromDate || toDate) {
//         query.date = {};
//         if (fromDate) query.date.$gte = fromDate;
//         if (toDate) query.date.$lte = toDate;
//       }
      
//       // Fetch weight logs with optional filters
//       let queryBuilder = WeightLog.find(query).sort({ date: -1, createdAt: -1 });
      
//       if (limit) {
//         queryBuilder = queryBuilder.limit(parseInt(limit));
//       }
      
//       const weightLogs = await queryBuilder;
      
//       // Calculate BMI trends and statistics
//       const stats = {
//         totalEntries: weightLogs.length,
//         latestWeight: weightLogs.length > 0 ? weightLogs[0].weight : null,
//         latestBMI: weightLogs.length > 0 ? weightLogs[0].bmi : null,
//         averageWeight: weightLogs.length > 0 ? 
//           parseFloat((weightLogs.reduce((sum, log) => sum + log.weight, 0) / weightLogs.length).toFixed(2)) : null
//       };
      
//       return NextResponse.json({ 
//         data: weightLogs,
//         stats: stats
//       });
//     }
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || 'Failed to fetch weight logs' },
//       { status: 500 }
//     );
//   }
// }

// // POST - Create a new weight log
// export async function POST(request: NextRequest) {
//   try {
//     await connectDB();
    
//     const body = await request.json();
//     const validatedData = await validateWeightData(body);
    
//     const newWeightLog = new WeightLog(validatedData);
//     const savedWeightLog = await newWeightLog.save();
    
//     return NextResponse.json(
//       { 
//         message: 'Weight log created successfully',
//         data: savedWeightLog 
//       },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || 'Failed to create weight log' },
//       { status: 500 }
//     );
//   }
// }

// // PUT - Update an existing weight log
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
//     const validatedData = await validateWeightData(body);
    
//     const updatedWeightLog = await WeightLog.findByIdAndUpdate(
//       id,
//       validatedData,
//       { new: true, runValidators: true }
//     );
    
//     if (!updatedWeightLog) {
//       return NextResponse.json(
//         { error: 'Weight log not found' },
//         { status: 404 }
//       );
//     }
    
//     return NextResponse.json({
//       message: 'Weight log updated successfully',
//       data: updatedWeightLog
//     });
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || 'Failed to update weight log' },
//       { status: 500 }
//     );
//   }
// }

// // DELETE - Delete a weight log
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
    
//     const deletedWeightLog = await WeightLog.findByIdAndDelete(id);
    
//     if (!deletedWeightLog) {
//       return NextResponse.json(
//         { error: 'Weight log not found' },
//         { status: 404 }
//       );
//     }
    
//     return NextResponse.json({
//       message: 'Weight log deleted successfully',
//       data: deletedWeightLog
//     });
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || 'Failed to delete weight log' },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { WeightLog, UserProfile } from '@/models';

interface WeightLogData {
  date: string | Date;
  weight: number;
  bmi?: number;
  notes?: string;
  [key: string]: unknown;
}

interface WeightLogStats {
  totalEntries: number;
  latestWeight: number | null;
  latestBMI: number | null;
  averageWeight: number | null;
}

function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100;
  return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));
}

async function validateWeightData(data: Record<string, unknown>): Promise<WeightLogData> {
  if (!data.date || data.weight === undefined) {
    throw new Error('Missing required fields: date, weight');
  }
  
  const weight = parseFloat(data.weight as string);
  if (isNaN(weight) || weight <= 0) {
    throw new Error('Weight must be a valid positive number');
  }
  
  const validatedData: WeightLogData = {
    ...data,
    weight
  } as WeightLogData;
  
  const userProfile = await UserProfile.findOne({ userId: 'default' });
  if (userProfile && userProfile.height) {
    validatedData.bmi = calculateBMI(weight, userProfile.height);
  }
  
  return validatedData;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const limit = searchParams.get('limit');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    
    if (id) {
      const weightLog = await WeightLog.findById(id);
      if (!weightLog) {
        return NextResponse.json(
          { error: 'Weight log not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ data: weightLog });
    } else {
      const query: Record<string, unknown> = {};
      if (fromDate || toDate) {
        query.date = {};
        if (fromDate) (query.date as Record<string, unknown>).$gte = fromDate;
        if (toDate) (query.date as Record<string, unknown>).$lte = toDate;
      }
      
      let queryBuilder = WeightLog.find(query).sort({ date: -1, createdAt: -1 });
      
      if (limit) {
        queryBuilder = queryBuilder.limit(parseInt(limit));
      }
      
      const weightLogs = await queryBuilder;
      
      const stats: WeightLogStats = {
        totalEntries: weightLogs.length,
        latestWeight: weightLogs.length > 0 ? weightLogs[0].weight : null,
        latestBMI: weightLogs.length > 0 ? weightLogs[0].bmi : null,
        averageWeight: weightLogs.length > 0 ? 
          parseFloat((weightLogs.reduce((sum, log) => sum + log.weight, 0) / weightLogs.length).toFixed(2)) : null
      };
      
      return NextResponse.json({ 
        data: weightLogs,
        stats: stats
      });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch weight logs';
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
    const validatedData = await validateWeightData(body);
    
    const newWeightLog = new WeightLog(validatedData);
    const savedWeightLog = await newWeightLog.save();
    
    return NextResponse.json(
      { 
        message: 'Weight log created successfully',
        data: savedWeightLog 
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create weight log';
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
    const validatedData = await validateWeightData(body);
    
    const updatedWeightLog = await WeightLog.findByIdAndUpdate(
      id,
      validatedData,
      { new: true, runValidators: true }
    );
    
    if (!updatedWeightLog) {
      return NextResponse.json(
        { error: 'Weight log not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Weight log updated successfully',
      data: updatedWeightLog
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update weight log';
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
    
    const deletedWeightLog = await WeightLog.findByIdAndDelete(id);
    
    if (!deletedWeightLog) {
      return NextResponse.json(
        { error: 'Weight log not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Weight log deleted successfully',
      data: deletedWeightLog
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete weight log';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}