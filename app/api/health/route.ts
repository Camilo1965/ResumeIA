import { NextResponse } from 'next/server'
import databaseClient from '@/lib/prisma'

export async function GET() {
  try {
    // Verificar conexión a base de datos
    if (!databaseClient) {
      return NextResponse.json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'not configured',
        error: 'DATABASE_URL not set'
      }, { status: 503 })
    }

    await databaseClient.$queryRaw`SELECT 1`
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      version: process.env.npm_package_version || '1.0.0'
    })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 503 })
  }
}
