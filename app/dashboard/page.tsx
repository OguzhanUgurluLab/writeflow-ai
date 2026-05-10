'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { TEMPLATES, TemplateType } from '@/lib/templates'

interface Stats {
  totalGenerated: number
  creditsLeft: number
  plan: string
  memberSince: string
}

interface RecentContent {
  _id: string
  templateId: string
  templateName: string
  title: string
  content: string
  createdAt: string
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentContents, setRecentContents] = useState<RecentContent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/user/stats')
      const data = await res.json()
      if (data.success) {
        setStats(data.stats)
        setRecentContents(data.recentContents)
      }
    } catch (err) {
      console.error('Failed to fetch stats', err)
    } finally {
      setLoading(false)
    }
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Create AI-powered content in seconds</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Total Generated */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm">Total Generated</span>
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-1">
            {loading ? '...' : stats?.totalGenerated ?? 0}
          </div>
          <p className="text-gray-500 text-xs">All time</p>
        </div>

        {/* Credits Left */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm">Credits Left</span>
            <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-1">
            {loading ? '...' : stats?.creditsLeft ?? 0}
          </div>
          <p className="text-gray-500 text-xs">Resets daily</p>
        </div>

        {/* Current Plan */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm">Current Plan</span>
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-white mb-1 capitalize">
            {loading ? '...' : stats?.plan ?? 'Free'}
          </div>
          <Link
            href="/dashboard/settings"
            className="text-purple-400 hover:text-purple-300 text-xs"
          >
            Upgrade to Pro →
          </Link>
        </div>
      </div>

      {/* Quick Start */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Quick Start</h2>
          <Link
            href="/dashboard/generate"
            className="text-purple-400 hover:text-purple-300 text-sm"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.values(TEMPLATES).map((tmpl) => (
            <Link
              key={tmpl.id}
              href={`/dashboard/generate?template=${tmpl.id}`}
              className="bg-white/5 hover:bg-white/[0.07] border border-white/10 hover:border-purple-500/30 rounded-2xl p-4 transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tmpl.color} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}>
                {tmpl.icon}
              </div>
              <h3 className="text-white text-sm font-semibold">{tmpl.name}</h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Content */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Recent Content</h2>
          {recentContents.length > 0 && (
            <Link
              href="/dashboard/history"
              className="text-purple-400 hover:text-purple-300 text-sm"
            >
              View all →
            </Link>
          )}
        </div>

        {loading ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl py-20 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          </div>
        ) : recentContents.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl py-16 px-6 text-center">
            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">No content yet</h3>
            <p className="text-gray-400 text-sm mb-6">
              Generate your first piece of AI content
            </p>
            <Link
              href="/dashboard/generate"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium px-6 py-3 rounded-xl transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start Generating
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentContents.map((item) => {
              const template = TEMPLATES[item.templateId as TemplateType]
              return (
                <Link
                  key={item._id}
                  href="/dashboard/history"
                  className="bg-white/5 hover:bg-white/[0.07] border border-white/10 hover:border-purple-500/30 rounded-2xl p-5 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${template?.color || 'from-gray-500 to-gray-600'} flex items-center justify-center text-lg`}>
                      {template?.icon || '📄'}
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(item.createdAt)}</span>
                  </div>

                  <div className="text-xs text-purple-400 font-medium uppercase mb-2">
                    {item.templateName}
                  </div>

                  <h3 className="text-white font-semibold mb-2 line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-gray-400 text-sm line-clamp-2">
                    {item.content.replace(/[#*`>]/g, '').substring(0, 100)}...
                  </p>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}