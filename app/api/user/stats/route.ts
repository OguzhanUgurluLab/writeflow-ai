import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Content from '@/models/Content'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const [user, totalGenerated, recentContents] = await Promise.all([
      User.findById(session.user.id).select('name email credits plan createdAt').lean(),
      Content.countDocuments({ userId: session.user.id }),
      Content.find({ userId: session.user.id })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ])

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalGenerated,
        creditsLeft: (user as any).credits,
        plan: (user as any).plan,
        memberSince: (user as any).createdAt,
      },
      recentContents,
    })
  } catch (error: any) {
    console.error('[USER_STATS_ERROR]', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}