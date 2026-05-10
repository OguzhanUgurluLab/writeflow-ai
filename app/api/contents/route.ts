import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Content from '@/models/Content'

// GET - List user's contents
export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const templateId = searchParams.get('templateId')

    const query: any = { userId: session.user.id }
    if (templateId && templateId !== 'all') {
      query.templateId = templateId
    }

    const contents = await Content.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    return NextResponse.json({
      success: true,
      contents,
      count: contents.length,
    })
  } catch (error: any) {
    console.error('[CONTENTS_GET_ERROR]', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch contents' },
      { status: 500 }
    )
  }
}