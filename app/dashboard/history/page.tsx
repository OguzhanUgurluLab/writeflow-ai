'use client'

import { useState, useEffect } from 'react'
import { TEMPLATES, TemplateType } from '@/lib/templates'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ContentItem {
  _id: string
  templateId: string
  templateName: string
  title: string
  content: string
  inputs: Record<string, string>
  createdAt: string
}

export default function HistoryPage() {
  const [contents, setContents] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchContents()
  }, [filter])

  const fetchContents = async () => {
    setLoading(true)
    try {
      const url = filter === 'all'
        ? '/api/contents'
        : `/api/contents?templateId=${filter}`
      const res = await fetch(url)
      const data = await res.json()
      if (data.success) {
        setContents(data.contents)
      }
    } catch (err) {
      console.error('Failed to fetch contents', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (!confirm('Are you sure you want to delete this content?')) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/contents/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setContents((prev) => prev.filter((c) => c._id !== id))
        if (selectedContent?._id === id) {
          setSelectedContent(null)
        }
      }
    } catch (err) {
      console.error('Failed to delete', err)
    } finally {
      setDeleting(null)
    }
  }

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const filteredContents = contents.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  )

  const getTemplateInfo = (templateId: string) => {
    return TEMPLATES[templateId as TemplateType]
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Content History</h1>
        <p className="text-gray-400">
          {contents.length} {contents.length === 1 ? 'item' : 'items'} in your library
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
          />
        </div>

        {/* Template Filter */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-colors"
        >
          <option value="all" className="bg-[#0f0f1a]">All Templates</option>
          {Object.values(TEMPLATES).map((tmpl) => (
            <option key={tmpl.id} value={tmpl.id} className="bg-[#0f0f1a]">
              {tmpl.name}
            </option>
          ))}
        </select>
      </div>

      {/* Content List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        </div>
      ) : filteredContents.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl py-20 text-center">
          <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-400">
            {search ? 'No results found' : 'No content yet. Start generating!'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContents.map((item) => {
            const template = getTemplateInfo(item.templateId)
            return (
              <div
                key={item._id}
                onClick={() => setSelectedContent(item)}
                className="group bg-white/5 hover:bg-white/[0.07] border border-white/10 hover:border-purple-500/30 rounded-2xl p-5 cursor-pointer transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${template?.color || 'from-gray-500 to-gray-600'} flex items-center justify-center text-lg flex-shrink-0`}>
                    {template?.icon || '📄'}
                  </div>
                  <button
                    onClick={(e) => handleDelete(item._id, e)}
                    disabled={deleting === item._id}
                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all p-1"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                    </svg>
                  </button>
                </div>

                {/* Template Badge */}
                <div className="text-xs text-purple-400 font-medium uppercase mb-2">
                  {item.templateName}
                </div>

                {/* Title */}
                <h3 className="text-white font-semibold mb-2 line-clamp-2 leading-snug">
                  {item.title}
                </h3>

                {/* Preview */}
                <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                  {item.content.replace(/[#*`>]/g, '').substring(0, 150)}...
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatDate(item.createdAt)}</span>
                  <span className="text-purple-400 group-hover:text-purple-300">
                    View →
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedContent && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedContent(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0f0f1a] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getTemplateInfo(selectedContent.templateId)?.color || 'from-gray-500 to-gray-600'} flex items-center justify-center text-lg flex-shrink-0`}>
                  {getTemplateInfo(selectedContent.templateId)?.icon || '📄'}
                </div>
                <div className="min-w-0">
                  <h2 className="text-white font-semibold truncate">{selectedContent.title}</h2>
                  <p className="text-gray-400 text-xs">
                    {selectedContent.templateName} · {formatDate(selectedContent.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleCopy(selectedContent.content)}
                  className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-300 transition-colors"
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied
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
                <button
                  onClick={() => handleDelete(selectedContent._id)}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                  </svg>
                </button>
                <button
                  onClick={() => setSelectedContent(null)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="text-gray-300 leading-relaxed">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => <h1 className="text-2xl font-bold text-white mt-6 mb-4 first:mt-0">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-bold text-white mt-6 mb-3 first:mt-0">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-semibold text-white mt-5 mb-2">{children}</h3>,
                    p: ({ children }) => <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300 ml-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-300 ml-2">{children}</ol>,
                    li: ({ children }) => <li className="text-gray-300 leading-relaxed">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                    em: ({ children }) => <em className="italic text-gray-200">{children}</em>,
                    code: ({ children }) => <code className="bg-white/10 text-purple-300 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>,
                    blockquote: ({ children }) => <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-400 my-4">{children}</blockquote>,
                    hr: () => <hr className="border-white/10 my-6" />,
                  }}
                >
                  {selectedContent.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}