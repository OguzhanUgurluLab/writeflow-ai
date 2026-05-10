"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { 
  Sparkles, 
  Zap, 
  Brain, 
  CheckCircle2, 
  ArrowRight,
  Star,
  PenTool,
  Globe,
  Shield,
  LayoutDashboard
} from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-slate-950/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-purple-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              WriteFlow AI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="hover:text-purple-400 transition">Features</a>
            <a href="#pricing" className="hover:text-purple-400 transition">Pricing</a>
            <a href="#testimonials" className="hover:text-purple-400 transition">Reviews</a>
            {!isLoggedIn && (
              <Link href="/login" className="hover:text-purple-400 transition">Sign In</Link>
            )}
          </div>
          {isLoggedIn ? (
            <Link 
              href="/dashboard" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2 rounded-full text-sm font-semibold hover:scale-105 transition inline-flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          ) : (
            <Link 
              href="/register" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2 rounded-full text-sm font-semibold hover:scale-105 transition inline-block"
            >
              Get Started
            </Link>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-40 pb-24 px-6 relative">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[150px] opacity-20"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full blur-[150px] opacity-20"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8 text-sm"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Powered by Llama 3.3 & Groq AI</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Write 10x Faster with{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              AI Magic
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
          >
            Turn your ideas into stunning content in seconds. Blog posts, emails, ads, and more — all powered by cutting-edge AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {isLoggedIn ? (
              <Link 
                href="/dashboard" 
                className="group bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition flex items-center gap-2"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </Link>
            ) : (
              <>
                <Link 
                  href="/register" 
                  className="group bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition flex items-center gap-2"
                >
                  Start Writing Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </Link>
                <Link 
                  href="/login" 
                  className="px-8 py-4 rounded-full font-semibold text-lg border border-white/20 hover:bg-white/5 transition inline-block"
                >
                  Sign In
                </Link>
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-400"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              10 free credits daily
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                write better
              </span>
            </h2>
            <p className="text-gray-400 text-lg">Powerful features that make writing effortless</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Brain, title: "Smart AI Writing", desc: "Advanced Llama 3.3 model that understands context and creates human-like content." },
              { icon: Zap, title: "Lightning Fast", desc: "Generate articles, emails, and copy in seconds. No more writer's block." },
              { icon: PenTool, title: "6+ Templates", desc: "Pre-built templates for blogs, ads, social media, emails and more." },
              { icon: Globe, title: "Multi-Language", desc: "Write fluently in multiple languages with native-level accuracy." },
              { icon: Shield, title: "100% Original", desc: "AI-generated content tailored to your unique requirements." },
              { icon: Sparkles, title: "SEO Optimized", desc: "Generate content that ranks. Built-in SEO best practices for every output." },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 hover:bg-white/10 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Loved by 50,000+ writers</h2>
            <div className="flex justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-gray-400">4.9/5 from 12,000+ reviews</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Sarah Chen", role: "Content Marketer", text: "WriteFlow AI completely changed my workflow. I now produce 3x more content in half the time." },
              { name: "Marcus Johnson", role: "Startup Founder", text: "Best AI writing tool I've used. The quality is incredible and saves me thousands on copywriters." },
              { name: "Emma Williams", role: "Blogger", text: "I was skeptical at first, but this tool genuinely writes like a human. My readers can't tell the difference!" },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-8"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-gray-400">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-gray-400 text-lg">Choose the plan that fits your needs</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Free", price: "0", desc: "Perfect for trying out", features: ["10 generations/day", "6+ templates", "Basic support"], popular: false },
              { name: "Pro", price: "29", desc: "For serious writers", features: ["Unlimited generations", "All templates", "Priority support", "API access", "Team collaboration"], popular: true },
              { name: "Enterprise", price: "99", desc: "For teams & businesses", features: ["Everything in Pro", "Custom AI models", "Dedicated manager", "SSO & advanced security"], popular: false },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`relative rounded-2xl p-8 ${
                  plan.popular 
                    ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500" 
                    : "bg-white/5 border border-white/10"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1 rounded-full text-xs font-semibold">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-6">{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link 
                  href={isLoggedIn ? "/dashboard" : "/register"} 
                  className={`block text-center w-full py-3 rounded-full font-semibold transition ${
                    plan.popular
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  {isLoggedIn ? "Go to Dashboard" : "Get Started"}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-3xl p-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to transform your writing?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join 50,000+ writers who are creating amazing content with AI.
          </p>
          <Link 
            href={isLoggedIn ? "/dashboard" : "/register"} 
            className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition inline-flex items-center gap-2"
          >
            {isLoggedIn ? "Go to Dashboard" : "Get Started Free"}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <span className="text-lg font-bold">WriteFlow AI</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 WriteFlow AI. Built by Oğuzhan U. — Full-Stack Developer
          </p>
        </div>
      </footer>

    </div>
  );
}