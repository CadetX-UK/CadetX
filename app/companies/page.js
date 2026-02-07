'use client'

import { motion } from 'framer-motion'
import {
  GraduationCap, Building2, Users, Shield, CheckCircle,
  ArrowRight, Star, Clock, Award, Target, Zap, Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

// Shared Navigation
const Navigation = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between h-16">
        <Link href="/" className="flex items-center space-x-2">

          <span className="text-3xl font-extrabold tracking-tight"><span className="text-[#0D4ABC]">Cadet</span><span className="text-[#9C0005]">X</span></span>
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/students" className="text-gray-700 hover:text-[#0D4ABC]">For Students</Link>
          <Link href="/companies" className="font-medium text-[#0D4ABC]">For Companies</Link>
          <Link href="/how-it-works" className="text-gray-700 hover:text-[#0D4ABC]">How It Works</Link>
          <Link href="/about" className="text-gray-700 hover:text-[#0D4ABC]">About</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login"><Button variant="outline">Login</Button></Link>
          <Link href="/register?role=company"><Button className="bg-[#9C0005]">Hire Talent</Button></Link>
        </div>
      </div>
    </div>
  </nav>
)

// Footer
const Footer = () => (
  <footer className="bg-gray-900 text-white py-12">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">

          <span className="text-2xl font-extrabold tracking-tight"><span className="text-[#0D4ABC]">Cadet</span><span className="text-[#9C0005]">X</span></span>
        </div>
        <p className="text-gray-400 text-sm">© 2025 CadetX. All rights reserved.</p>
      </div>
    </div>
  </footer>
)

export default function CompaniesPage() {
  const benefits = [
    { icon: Shield, title: 'Pre-Vetted Talent', desc: 'Every candidate has passed rigorous assessments and real projects' },
    { icon: Clock, title: 'Faster Hiring', desc: 'Skip lengthy screening—our candidates are job-ready from day one' },
    { icon: Award, title: 'Verified Skills', desc: 'Transparent scores, portfolios, and performance metrics' },
    { icon: Filter, title: 'Smart Matching', desc: 'Filter by skills, scores, and experience to find the perfect fit' },
    { icon: Target, title: 'Quality Guarantee', desc: '30-day replacement guarantee if the hire doesn\'t work out' },
    { icon: Zap, title: 'Zero Upfront Cost', desc: 'Browse candidates free—pay only when you hire' },
  ]

  const hiringPartners = [
    'TechCorp', 'DataDriven Inc', 'Analytics Pro', 'InsightHub',
    'MetricsMaster', 'DataFlow', 'SmartBI', 'CloudAnalytics'
  ]

  return (
    <main>
      <Navigation />

      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="inline-block px-4 py-2 bg-[#9C0005] rounded-full text-sm font-medium mb-6">
                🏢 For Companies
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Hire Pre-Vetted Data Talent with Confidence
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Access our curated pool of trained, assessed, and job-ready data professionals.
                Every cadet is proven—no more bad hires.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register?role=company">
                  <Button size="lg" className="bg-[#9C0005] hover:bg-[#7a0004]">
                    Access Talent Pool <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                    Talk to Sales
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:block"
            >
              <img
                src="https://images.pexels.com/photos/5439368/pexels-photo-5439368.jpeg"
                alt="Corporate hiring"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Hiring Partners' },
              { value: '2000+', label: 'Candidates Placed' },
              { value: '95%', label: 'Retention Rate' },
              { value: '< 2 weeks', label: 'Avg. Time to Hire' },
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-3xl md:text-4xl font-bold text-[#0D4ABC]">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Hire from CadetX?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We solve the biggest hiring challenges for data teams.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center mb-4">
                      <benefit.icon className="w-6 h-6 text-[#9C0005]" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Hire</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Create Account', desc: 'Sign up as a company in minutes' },
              { step: 2, title: 'Browse Talent', desc: 'Filter candidates by skills & scores' },
              { step: 3, title: 'Request Candidate', desc: 'Express interest in top candidates' },
              { step: 4, title: 'Interview & Hire', desc: 'We coordinate everything' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#0D4ABC] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Leading Companies</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {hiringPartners.map((company, idx) => (
              <div key={idx} className="px-6 py-3 bg-white rounded-lg shadow-sm text-gray-600 font-medium">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#9C0005] to-[#c20006] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Next Data Star?</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join 500+ companies who have simplified their data hiring with CadetX.
          </p>
          <Link href="/register?role=company">
            <Button size="lg" className="bg-white text-[#9C0005] hover:bg-gray-100">
              Start Hiring Today <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
