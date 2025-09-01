// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '@/lib/db';
// import { JobApplication, JobStatus } from '@/models';

// // Helper function to validate job application data
// function validateJobData(data: any) {
//   if (!data.company || !data.role || !data.status) {
//     throw new Error('Missing required fields: company, role, status');
//   }
  
//   // Validate status enum
//   if (!Object.values(JobStatus).includes(data.status)) {
//     throw new Error(`Invalid status. Must be one of: ${Object.values(JobStatus).join(', ')}`);
//   }
  
//   return data;
// }

// // GET - Fetch all job applications
// export async function GET(request: NextRequest) {
//   try {
//     await connectDB();
    
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get('id');
    
//     if (id) {
//       const jobApplication = await JobApplication.findById(id);
//       if (!jobApplication) {
//         return NextResponse.json(
//           { error: 'Job application not found' },
//           { status: 404 }
//         );
//       }
//       return NextResponse.json({ data: jobApplication });
//     } else {
//       const jobApplications = await JobApplication.find({}).sort({ createdAt: -1 });
//       return NextResponse.json({ data: jobApplications });
//     }
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || 'Failed to fetch job applications' },
//       { status: 500 }
//     );
//   }
// }

// // POST - Create a new job application
// export async function POST(request: NextRequest) {
//   try {
//     await connectDB();
    
//     const body = await request.json();
//     const validatedData = validateJobData(body);
    
//     const newJobApplication = new JobApplication(validatedData);
//     const savedJobApplication = await newJobApplication.save();
    
//     return NextResponse.json(
//       { 
//         message: 'Job application created successfully',
//         data: savedJobApplication 
//       },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || 'Failed to create job application' },
//       { status: 500 }
//     );
//   }
// }

// // DELETE - Delete a job application
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
    
//     const deletedJobApplication = await JobApplication.findByIdAndDelete(id);
    
//     if (!deletedJobApplication) {
//       return NextResponse.json(
//         { error: 'Job application not found' },
//         { status: 404 }
//       );
//     }
    
//     return NextResponse.json({
//       message: 'Job application deleted successfully',
//       data: deletedJobApplication
//     });
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || 'Failed to delete job application' },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { JobApplication, JobStatus } from '@/models';

interface JobApplicationData {
  company: string;
  role: string;
  status: string;
  location?: string;
  salary?: number;
  description?: string;
  appliedDate?: string | Date;
  notes?: string;
  [key: string]: unknown;
}

function validateJobData(data: Record<string, unknown>): JobApplicationData {
  if (!data.company || !data.role || !data.status) {
    throw new Error('Missing required fields: company, role, status');
  }
  
  if (!Object.values(JobStatus).includes(data.status as JobStatus)) {
    throw new Error(`Invalid status. Must be one of: ${Object.values(JobStatus).join(', ')}`);
  }
  
  return data as JobApplicationData;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      const jobApplication = await JobApplication.findById(id);
      if (!jobApplication) {
        return NextResponse.json(
          { error: 'Job application not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ data: jobApplication });
    } else {
      const jobApplications = await JobApplication.find({}).sort({ createdAt: -1 });
      return NextResponse.json({ data: jobApplications });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch job applications';
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
    const validatedData = validateJobData(body);
    
    const newJobApplication = new JobApplication(validatedData);
    const savedJobApplication = await newJobApplication.save();
    
    return NextResponse.json(
      { 
        message: 'Job application created successfully',
        data: savedJobApplication 
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create job application';
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
    
    const deletedJobApplication = await JobApplication.findByIdAndDelete(id);
    
    if (!deletedJobApplication) {
      return NextResponse.json(
        { error: 'Job application not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Job application deleted successfully',
      data: deletedJobApplication
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete job application';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}