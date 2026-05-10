'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { TEMPLATES, TemplateType } from '@/lib/templates'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function GeneratePage() {
  const { data: session } = useSession()
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('blog-post')
  const [inputs, setInputs] = useState<Record<string, string>>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [creditsLeft, setCreditsLeft] = useState<number | null>(null)

  const template = TEMPLATES[selectedTemplate]

  // Fetch real credits on mount
  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const res = await fetch('/api/user/stats')
        const data = await res.json()
        if (data.success) {
          setCreditsLeft(data.stats.creditsLeft)
        }
      } catch (err) {
        console.error('Failed to fetch credits', err)
      }
    }
    fetchCredits()
  }, [])

  const handleTemplateChange = (templateId: TemplateType) => {
    setSelectedTemplate(templateId)
    setInputs({})
    setGeneratedContent('')
    setError('')
  }

  const handleInputChange = (name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenerate = async () => {
    setError('')
    setGeneratedContent('')

    for (const field of template.fields) {
      if (field.required && !inputs[field.name]?.trim()) {
        setError(`${field.label} is required`)
        return
      }
    }

    setIsGenerating(true)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate,
          inputs,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate content')
      }

      setGeneratedContent(data.content)

      // Update credits from API response
      if (typeof data.creditsLeft === 'number') {
        setCreditsLeft(data.creditsLeft)
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const credits = creditsLeft ?? (session?.user as any)?.credits ?? 10

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Generate Content</h1>
        <p className="text-gray-400">
          Choose a template and let AI craft amazing content for you
        </p>
      </div>

      {/* Template Selector */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-400 uppercase mb-3">
          Select Template
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.values(TEMPLATES).map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => handleTemplateChange(tmpl.id)}
              className={`
                p-4 rounded-xl border transition-all text-left
                ${selectedTemplate === tmpl.id
                  ? 'bg-purple-600/20 border-purple-500/50'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
                }
              `}
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tmpl.color} flex items-center justify-center text-xl mb-2`}>
                {tmpl.icon}
              </div>
              <h3 className="text-white text-sm font-semibold">{tmpl.name}</h3>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Inputs & Output */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* LEFT: Input Form */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center text-xl`}>
              {template.icon}
            </div>
            <div>
              <h2 className="text-white font-semibold">{template.name}</h2>
              <p className="text-gray-400 text-xs">{template.description}</p>
            </div>
          </div>

          <div className="space-y-4">
            {template.fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-400 ml-1">*</span>}
                </label>

                {field.type === 'text' && (
                  <input
                    type="text"
                    value={inputs[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                )}

                {field.type === 'textarea' && (
                  <textarea
                    value={inputs[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                  />
                )}

                {field.type === 'select' && (
                  <select
                    value={inputs[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                  >
                    <option value="" className="bg-[#0f0f1a]">
                      Select {field.label}...
                    </option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-[#0f0f1a]">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || credits <= 0}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-all"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </>
            ) : credits <= 0 ? (
              <>No credits left</>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate (1 credit)
              </>
            )}
          </button>

          <p className="mt-3 text-center text-xs text-gray-500">
            {credits} credits remaining today
          </p>
        </div>

        {/* RIGHT: Output */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-semibold">Generated Content</h2>
            {generatedContent && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-300 transition-colors"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            )}
          </div>

          <div className="min-h-[400px] max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {isGenerating && (
              <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-purple-500/20 rounded-full" />
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-gray-400 text-sm">AI is crafting your content...</p>
              </div>
            )}

            {!isGenerating && !generatedContent && (
              <div className="flex flex-col items-center justify-center h-[400px] gap-3 text-center">
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">
                  Fill the form and hit Generate to create content
                </p>
              </div>
            )}

            {!isGenerating && generatedContent && (
              <div className="text-gray-300 leading-relaxed">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-2xl font-bold text-white mt-6 mb-4 first:mt-0">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-xl font-bold text-white mt-6 mb-3 first:mt-0">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-lg font-semibold text-white mt-5 mb-2">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-gray-300 mb-4 leading-relaxed">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300 ml-2">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-300 ml-2">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-gray-300 leading-relaxed">
                        {children}
                      </li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-white">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic text-gray-200">
                        {children}
                      </em>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 underline"
                      >
                        {children}
                      </a>
                    ),
                    code: ({ children }) => (
                      <code className="bg-white/10 text-purple-300 px-1.5 py-0.5 rounded text-sm font-mono">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-black/40 border border-white/10 rounded-xl p-4 mb-4 overflow-x-auto">
                        {children}
                      </pre>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-400 my-4">
                        {children}
                      </blockquote>
                    ),
                    hr: () => <hr className="border-white/10 my-6" />,
                  }}
                >
                  {generatedContent}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}