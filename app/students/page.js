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

// Hero Section
const HeroSection = () => (
  <section className="pt-24 pb-16 bg-[#0D4ABC] text-white">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6">
            🎓 For Aspiring Data Professionals
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Become a Job‑Ready Data Professional — Through Company‑Aligned Internships
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            CadetX trains you with hands‑on, partner‑sourced project work so you build the skills, portfolio, and confidence to launch your data career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=student">
              <Button size="lg" className="bg-white text-[#0D4ABC] hover:bg-gray-100 px-8 h-12 text-lg font-semibold">
                Apply for the Internship Program <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
)

// Why Students Choose CadetX
const WhyChooseSection = () => (
  <section className="py-20 bg-gray-50">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1D3557] mb-4">Why Students Choose CadetX</h2>
        <p className="text-[#457B9D] text-lg font-medium">
          We don’t teach you tools. We prepare you for the workplace.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { icon: Target, title: 'Real Project Work', desc: 'Work on partner‑sourced project tasks that mirror industry requirements.' },
          { icon: Users, title: 'Professional Workflows', desc: 'Learn GitHub, Teams, Outlook, Scrum, and professional collaborative workflows.' },
          { icon: Award, title: 'Trusted Portfolio', desc: 'Build a portfolio of real work that employers can trust and verify.' },
          { icon: Users, title: 'Weekly Feedback', desc: 'Get weekly feedback from managers and mentors to improve your work.' },
          { icon: Zap, title: 'Thinking-First', desc: 'Strengthen your thinking, problem‑solving, and analytical ability.' },
          { icon: CheckCircle, title: 'Hire-Ready', desc: 'Become hire‑ready, not just “course‑completed”.' },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow border-0 shadow-md">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-[#0D4ABC]/10 flex items-center justify-center mb-6">
                  <item.icon className="w-6 h-6 text-[#0D4ABC]" />
                </div>
                <h3 className="text-xl font-bold text-[#1D3557] mb-3">{item.title}</h3>
                <p className="text-[#457B9D] leading-relaxed">{item.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

// Placement Support
const PlacementSupport = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1D3557] mb-6">Placement Support</h2>
          <p className="text-lg text-[#457B9D] mb-6 leading-relaxed">
            When you finish your training and internship, you won’t be standing alone wondering what to do next.
            CadetX stays with you until you’re ready for the next step.
          </p>
          <ul className="space-y-4 mb-8">
            {[
              'We help you find the right opportunities',
              'Guide you through applications and interviews',
              'Connect you to companies looking for talent like you'
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-[#0D4ABC] shrink-0 mt-0.5" />
                <span className="text-[#1D3557] font-medium">{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-xl font-bold text-[#0D4ABC]">
            Our goal is simple: to see you grow, get noticed, and step into a job you’re proud of.
            <br />
            <span className="text-[#1D3557] text-lg font-normal mt-2 block">You put in the work — we help you reach the finish line.</span>
          </p>
        </div>
        <div className="bg-[#f8f9fa] p-8 rounded-2xl border border-gray-100 flex items-center justify-center">
          <img src="https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg" alt="Placement Support" className="rounded-xl shadow-lg" />
        </div>
      </div>
    </div>
  </section>
)

// What You Will Learn
const LearningOutcomes = () => (
  <section className="py-20 bg-[#1D3557] text-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">What You Will Learn</h2>
        <p className="text-gray-300">More than just code.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {[
          {
            title: '1. Technical Skills',
            desc: 'A solid, end‑to‑end data foundation that prepares you for analytics, engineering, science, and AI roles.'
          },
          {
            title: '2. Analytical & Problem‑Solving Ability',
            desc: 'Structured reasoning, critical thinking, and the ability to break down complex problems and make informed decisions using data.'
          },
          {
            title: '3. Professional Workplace Behaviour',
            desc: 'Clear communication, documentation discipline, collaboration, meeting etiquette, and consistent delivery within deadlines.'
          },
          {
            title: '4. Career Readiness & Industry Alignment',
            desc: 'You’ll learn how to present your work professionally, build a credible portfolio, communicate with hiring teams, and position yourself confidently.'
          }
        ].map((item, idx) => (
          <div key={idx} className="bg-white/10 p-8 rounded-xl backdrop-blur-sm border border-white/10">
            <h3 className="text-xl font-bold mb-4 text-[#E63946]">{item.title}</h3>
            <p className="text-gray-200 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

// Outcome & Eligibility
const OutcomeAndEligibility = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
        {/* Outcome */}
        <div>
          <h3 className="text-2xl font-bold text-[#1D3557] mb-6 flex items-center gap-3">
            <Award className="w-8 h-8 text-[#0D4ABC]" />
            What You Get at the End
          </h3>
          <Card className="bg-gray-50 border-gray-100">
            <CardContent className="p-6">
              <ul className="space-y-4">
                {[
                  'A portfolio employers can trust',
                  'A GitHub profile with structured workflows',
                  'A case‑study‑based resume',
                  'Experience working like a junior data professional',
                  'Eligibility for CadetX hiring opportunities'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Eligibility */}
        <div>
          <h3 className="text-2xl font-bold text-[#1D3557] mb-6 flex items-center gap-3">
            <Users className="w-8 h-8 text-[#E63946]" />
            Who Should Apply
          </h3>
          <Card className="bg-gray-50 border-gray-100 h-full">
            <CardContent className="p-6 h-full flex flex-col justify-center">
              <ul className="space-y-4 mb-6">
                {[
                  'Students in their final year',
                  'Fresh graduates',
                  'Career switchers',
                  'Anyone serious about starting a data career'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#1D3557]" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[#0D4ABC] font-semibold italic mt-auto">
                No prior experience required — just commitment and willingness to learn.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </section>
)

// Final CTA
const FinalCTA = () => (
  <section className="py-24 bg-gray-50 border-t border-gray-200 text-center">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-[#1D3557] mb-8">Ready to start your data career?</h2>
      <Link href="/register?role=student">
        <Button size="lg" className="bg-[#0D4ABC] hover:bg-[#003399] text-white px-12 h-16 text-xl font-bold rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          Apply for the Internship Program
          <ArrowRight className="ml-2 h-6 w-6" />
        </Button>
      </Link>
    </div>
  </section>
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
      <HeroSection />
      <WhyChooseSection />
      <PlacementSupport />
      <LearningOutcomes />
      <OutcomeAndEligibility />
      <FinalCTA />
      <Footer />
    </main>
  )
}
