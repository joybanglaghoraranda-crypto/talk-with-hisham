import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function GET() {
  try {
    // Increment the test counter in Redis
    const views = await redis.incr('test_views');
    
    return NextResponse.json({
      success: true,
      message: "Upstash Redis connection is working perfectly!",
      total_test_views: views,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
