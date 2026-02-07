'use client'

import { motion } from 'framer-motion'
import {
  GraduationCap, BookOpen, Award, Briefcase, CheckCircle,
  ArrowRight, Star, Play, Users, Target, Zap, Clock
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
          <Link href="/students" className="font-medium text-[#0D4ABC]">For Students</Link>
          <Link href="/companies" className="text-gray-700 hover:text-[#0D4ABC]">For Companies</Link>
          <Link href="/how-it-works" className="text-gray-700 hover:text-[#0D4ABC]">How It Works</Link>
          <Link href="/about" className="text-gray-700 hover:text-[#0D4ABC]">About</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login"><Button variant="outline">Login</Button></Link>
          <Link href="/register?role=student"><Button className="bg-[#0D4ABC]">Apply Now</Button></Link>
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

export default function StudentsPage() {
  const benefits = [
    { icon: BookOpen, title: 'Structured Curriculum', desc: 'Week-by-week learning path covering SQL, Python, Tableau & more' },
    { icon: Target, title: 'Real Projects', desc: 'Work on actual business problems and build your portfolio' },
    { icon: Award, title: 'Certification', desc: 'Earn verified credentials that employers trust' },
    { icon: Briefcase, title: 'Placement Support', desc: 'Get matched with companies actively hiring data talent' },
    { icon: Users, title: 'Community', desc: 'Join a network of aspiring and established data professionals' },
    { icon: Zap, title: 'Fast Track', desc: 'Go from beginner to job-ready in just 12 weeks' },
  ]

  const curriculum = [
    { week: '1-2', title: 'Foundations', topics: ['Introduction to Data Analytics', 'SQL Basics', 'Excel for Analysis'] },
    { week: '3-4', title: 'SQL Mastery', topics: ['Advanced Queries', 'Joins & Subqueries', 'Database Design'] },
    { week: '5-6', title: 'Python for Data', topics: ['Python Fundamentals', 'Pandas & NumPy', 'Data Cleaning'] },
    { week: '7-8', title: 'Visualization', topics: ['Tableau Basics', 'Dashboard Design', 'Storytelling with Data'] },
    { week: '9-10', title: 'Advanced Analytics', topics: ['Statistical Analysis', 'Predictive Modeling', 'A/B Testing'] },
    { week: '11-12', title: 'Capstone Project', topics: ['Real Business Problem', 'End-to-End Analysis', 'Presentation'] },
  ]

  return (
    <main>
      <Navigation />

      {/* Hero */}
      <section className="pt-24 pb-16 gradient-hero text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6">
                🎓 For Aspiring Data Professionals
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Launch Your Data Career in 12 Weeks
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Intensive, hands-on training that transforms beginners into job-ready data analysts.
                No prior experience required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register?role=student">
                  <Button size="lg" className="bg-white text-[#0D4ABC] hover:bg-gray-100">
                    Apply Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    <Play className="mr-2 h-5 w-5" /> See How It Works
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '2000+', label: 'Graduates' },
              { value: '95%', label: 'Placement Rate' },
              { value: '₹6.5L', label: 'Avg. Starting Salary' },
              { value: '500+', label: 'Hiring Partners' },
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose CadetX?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We don't just teach skills—we prepare you for real jobs.
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
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                      <benefit.icon className="w-6 h-6 text-[#0D4ABC]" />
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

      {/* Curriculum */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">12-Week Curriculum</h2>
            <p className="text-gray-600">A comprehensive journey from basics to job-ready</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {curriculum.map((module, idx) => (
              <Card key={idx} className="border-l-4 border-l-[#0D4ABC]">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-medium text-[#0D4ABC] bg-blue-50 px-2 py-1 rounded">
                      Week {module.week}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{module.title}</h3>
                  <ul className="space-y-2">
                    {module.topics.map((topic, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" /> {topic}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto">
            <Card className="border-2 border-[#0D4ABC] shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="inline-block px-3 py-1 bg-[#0D4ABC] text-white text-sm font-medium rounded-full mb-4">
                  Most Popular
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Data Analytics Program</h3>
                <p className="text-gray-600 mb-6">Complete 12-week intensive training</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">₹9,999</span>
                  <span className="text-gray-500 ml-2">one-time</span>
                </div>
                <ul className="text-left space-y-3 mb-8">
                  {[
                    'Full curriculum access',
                    'Live mentor sessions',
                    'Real project portfolio',
                    'Certification',
                    'Placement assistance',
                    'Lifetime community access'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-500" /> {item}
                    </li>
                  ))}
                </ul>
                <Link href="/register?role=student">
                  <Button size="lg" className="w-full bg-[#0D4ABC]">
                    Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Career?</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of successful graduates who have launched their data careers with CadetX.
          </p>
          <Link href="/register?role=student">
            <Button size="lg" className="bg-white text-[#0D4ABC] hover:bg-gray-100">
              Apply Now — Limited Seats <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
