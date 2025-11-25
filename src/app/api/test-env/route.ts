import { NextResponse } from 'next/server';

/**
 * GET /api/test-env - Test endpoint to check environment variables
 * This is for debugging only - remove in production
 */
export async function GET() {
  const envVars = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ? '✅ SET (length: ' + process.env.GEMINI_API_KEY.length + ')' : '❌ NOT SET',
    NEXT_PUBLIC_GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY ? '✅ SET' : '❌ NOT SET',
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV || 'not on vercel',
    VERCEL: process.env.VERCEL || 'not on vercel',
    allKeys: Object.keys(process.env).filter(k => 
      k.includes('GEMINI') || 
      k.includes('VERCEL') || 
      k.includes('NODE') ||
      k.includes('API')
    ).sort()
  };

  return NextResponse.json({
    success: true,
    message: 'Environment Variables Check',
    environment: envVars,
    timestamp: new Date().toISOString()
  });
}
