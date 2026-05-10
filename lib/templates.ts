export type TemplateType = 
  | 'blog-post'
  | 'email'
  | 'ad-copy'
  | 'social-media'
  | 'product-description'
  | 'seo-meta'

export interface TemplateField {
  name: string
  label: string
  type: 'text' | 'textarea' | 'select'
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
}

export interface Template {
  id: TemplateType
  name: string
  description: string
  icon: string
  color: string
  fields: TemplateField[]
}

export const TEMPLATES: Record<TemplateType, Template> = {
  'blog-post': {
    id: 'blog-post',
    name: 'Blog Post',
    description: 'Generate engaging blog articles',
    icon: '📝',
    color: 'from-purple-500 to-pink-500',
    fields: [
      {
        name: 'topic',
        label: 'Blog Topic',
        type: 'text',
        placeholder: 'e.g., The Future of AI in Healthcare',
        required: true,
      },
      {
        name: 'tone',
        label: 'Tone',
        type: 'select',
        options: [
          { value: 'professional', label: 'Professional' },
          { value: 'casual', label: 'Casual' },
          { value: 'friendly', label: 'Friendly' },
          { value: 'authoritative', label: 'Authoritative' },
        ],
      },
      {
        name: 'length',
        label: 'Length',
        type: 'select',
        options: [
          { value: 'short', label: 'Short (~300 words)' },
          { value: 'medium', label: 'Medium (~600 words)' },
          { value: 'long', label: 'Long (~1000 words)' },
        ],
      },
    ],
  },
  'email': {
    id: 'email',
    name: 'Email Copy',
    description: 'Professional email templates',
    icon: '📧',
    color: 'from-blue-500 to-cyan-500',
    fields: [
      {
        name: 'purpose',
        label: 'Email Purpose',
        type: 'text',
        placeholder: 'e.g., Follow-up after meeting',
        required: true,
      },
      {
        name: 'recipient',
        label: 'Recipient',
        type: 'text',
        placeholder: 'e.g., Potential client, Manager',
      },
      {
        name: 'tone',
        label: 'Tone',
        type: 'select',
        options: [
          { value: 'formal', label: 'Formal' },
          { value: 'professional', label: 'Professional' },
          { value: 'friendly', label: 'Friendly' },
          { value: 'persuasive', label: 'Persuasive' },
        ],
      },
    ],
  },
  'ad-copy': {
    id: 'ad-copy',
    name: 'Ad Copy',
    description: 'High-converting advertising copy',
    icon: '📢',
    color: 'from-pink-500 to-red-500',
    fields: [
      {
        name: 'product',
        label: 'Product/Service',
        type: 'text',
        placeholder: 'e.g., AI Writing Tool',
        required: true,
      },
      {
        name: 'audience',
        label: 'Target Audience',
        type: 'text',
        placeholder: 'e.g., Small business owners',
      },
      {
        name: 'platform',
        label: 'Platform',
        type: 'select',
        options: [
          { value: 'facebook', label: 'Facebook' },
          { value: 'google', label: 'Google Ads' },
          { value: 'instagram', label: 'Instagram' },
          { value: 'linkedin', label: 'LinkedIn' },
        ],
      },
    ],
  },
  'social-media': {
    id: 'social-media',
    name: 'Social Media',
    description: 'Engaging social media posts',
    icon: '📱',
    color: 'from-green-500 to-emerald-500',
    fields: [
      {
        name: 'topic',
        label: 'Post Topic',
        type: 'text',
        placeholder: 'e.g., Product launch announcement',
        required: true,
      },
      {
        name: 'platform',
        label: 'Platform',
        type: 'select',
        options: [
          { value: 'twitter', label: 'Twitter/X' },
          { value: 'linkedin', label: 'LinkedIn' },
          { value: 'instagram', label: 'Instagram' },
          { value: 'facebook', label: 'Facebook' },
        ],
      },
      {
        name: 'tone',
        label: 'Tone',
        type: 'select',
        options: [
          { value: 'casual', label: 'Casual' },
          { value: 'professional', label: 'Professional' },
          { value: 'humorous', label: 'Humorous' },
          { value: 'inspiring', label: 'Inspiring' },
        ],
      },
    ],
  },
  'product-description': {
    id: 'product-description',
    name: 'Product Description',
    description: 'Compelling product descriptions',
    icon: '🛍️',
    color: 'from-orange-500 to-amber-500',
    fields: [
      {
        name: 'product',
        label: 'Product Name',
        type: 'text',
        placeholder: 'e.g., Wireless Bluetooth Headphones',
        required: true,
      },
      {
        name: 'features',
        label: 'Key Features',
        type: 'textarea',
        placeholder: 'List main features (one per line)',
        required: true,
      },
      {
        name: 'audience',
        label: 'Target Audience',
        type: 'text',
        placeholder: 'e.g., Music lovers, Gamers',
      },
    ],
  },
  'seo-meta': {
    id: 'seo-meta',
    name: 'SEO Meta',
    description: 'SEO titles and descriptions',
    icon: '🔍',
    color: 'from-cyan-500 to-blue-500',
    fields: [
      {
        name: 'topic',
        label: 'Page Topic',
        type: 'text',
        placeholder: 'e.g., Best Running Shoes 2025',
        required: true,
      },
      {
        name: 'keywords',
        label: 'Target Keywords',
        type: 'text',
        placeholder: 'e.g., running shoes, athletic footwear',
      },
    ],
  },
}

export function buildPrompt(
  templateId: TemplateType,
  inputs: Record<string, string>
): string {
  switch (templateId) {
    case 'blog-post':
      return `Write a ${inputs.length || 'medium'} length blog post about "${inputs.topic}". 
Use a ${inputs.tone || 'professional'} tone. 
Include an engaging introduction, well-structured body with subheadings (use ## for headings), and a strong conclusion. 
Make it informative, engaging, and ready to publish. Use markdown formatting.`

    case 'email':
      return `Write a ${inputs.tone || 'professional'} email for the following purpose: "${inputs.purpose}".
${inputs.recipient ? `The recipient is: ${inputs.recipient}.` : ''}
Include a clear subject line (start with "Subject: "), proper greeting, well-structured body, and professional closing.
Make it concise, clear, and effective.`

    case 'ad-copy':
      return `Write compelling ad copy for "${inputs.product}" targeting ${inputs.audience || 'general audience'}.
Platform: ${inputs.platform || 'Facebook'}.
Provide 3 variations of ad copy with:
- Attention-grabbing headline
- Persuasive body text
- Strong call-to-action
Make it conversion-focused and platform-appropriate.`

    case 'social-media':
      return `Create an engaging ${inputs.platform || 'Twitter'} post about "${inputs.topic}".
Tone: ${inputs.tone || 'casual'}.
Include relevant hashtags and emojis where appropriate.
Make it shareable and platform-optimized. ${inputs.platform === 'twitter' ? 'Keep it under 280 characters.' : ''}`

    case 'product-description':
      return `Write a compelling product description for "${inputs.product}".
Key features:
${inputs.features}
${inputs.audience ? `Target audience: ${inputs.audience}.` : ''}
Include:
- Attention-grabbing opening
- Highlighted benefits (not just features)
- Emotional appeal
- Clear value proposition
Make it persuasive and conversion-focused.`

    case 'seo-meta':
      return `Generate SEO-optimized meta content for a page about "${inputs.topic}".
${inputs.keywords ? `Target keywords: ${inputs.keywords}.` : ''}
Provide:
1. **Meta Title** (50-60 characters, includes primary keyword)
2. **Meta Description** (150-160 characters, compelling and includes keywords)
3. **5 SEO-friendly URL slug suggestions**
4. **10 related long-tail keywords**
Format with clear headings.`

    default:
      return `Generate content based on: ${JSON.stringify(inputs)}`
  }
}