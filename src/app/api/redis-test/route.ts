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
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
