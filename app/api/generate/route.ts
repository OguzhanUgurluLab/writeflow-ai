import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { groq, GROQ_MODEL } from '@/lib/groq'
import { buildPrompt, TemplateType, TEMPLATES } from '@/lib/templates'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Content from '@/models/Content'

export async function POST(req: Request) {
  try {
    // 1. Auth check
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Body parse
    const body = await req.json()
    const { templateId, inputs } = body as {
      templateId: TemplateType
      inputs: Record<string, string>
    }

    // 3. Validation
    if (!templateId || !inputs) {
      return NextResponse.json(
        { error: 'Missing templateId or inputs' },
        { status: 400 }
      )
    }

    if (!TEMPLATES[templateId]) {
      return NextResponse.json(
        { error: 'Invalid template type' },
        { status: 400 }
      )
    }

    const template = TEMPLATES[templateId]
    for (const field of template.fields) {
      if (field.required && !inputs[field.name]?.trim()) {
        return NextResponse.json(
          { error: `${field.label} is required` },
          { status: 400 }
        )
      }
    }

    // 4. Credit check
    await connectDB()
    const user = await User.findById(session.user.id)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.credits <= 0) {
      return NextResponse.json(
        { error: 'No credits left. Please upgrade your plan or wait until tomorrow.' },
        { status: 403 }
      )
    }

    // 5. Build prompt & call Groq
    const prompt = buildPrompt(templateId, inputs)

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a professional content writer. Generate high-quality, engaging content based on user requirements. Always format your output cleanly using markdown when appropriate.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    })

    const content = completion.choices[0]?.message?.content || ''

    if (!content) {
      return NextResponse.json(
        { error: 'AI failed to generate content. Please try again.' },
        { status: 500 }
      )
    }

    // 6. Generate title (first heading or first 60 chars)
    let title = ''
    const headingMatch = content.match(/^#+\s+(.+)$/m)
    if (headingMatch) {
      title = headingMatch[1].trim()
    } else {
      // Use first input value or first line
      const firstInputValue = Object.values(inputs)[0] || ''
      title = firstInputValue.substring(0, 60) || content.substring(0, 60).replace(/\n/g, ' ')
    }

    // 7. Save to DB
    const savedContent = await Content.create({
      userId: user._id,
      templateId,
      templateName: template.name,
      title,
      content,
      inputs,
    })

    // 8. Decrement credit
    user.credits = Math.max(0, user.credits - 1)
    await user.save()

    // 9. Return response
    return NextResponse.json({
      success: true,
      content,
      contentId: savedContent._id,
      creditsLeft: user.credits,
    })
  } catch (error: any) {
    console.error('[GENERATE_ERROR]', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate content' },
      { status: 500 }
    )
  }
}