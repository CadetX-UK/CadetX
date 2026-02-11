'use client'

import { motion } from 'framer-motion'
import {
  GraduationCap, Building, Users, Award, CheckCircle,
  ArrowRight, Star, BarChart3, Target, Zap, BookOpen, TrendingUp
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
          <Link href="/universities" className="font-medium text-[#0D4ABC]">For Universities</Link>
          <Link href="/companies" className="text-gray-700 hover:text-[#0D4ABC]">For Companies</Link>
          <Link href="/about" className="text-gray-700 hover:text-[#0D4ABC]">About</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login"><Button variant="outline">Login</Button></Link>
          <Link href="/register?role=university"><Button className="bg-[#0D4ABC]">Partner With Us</Button></Link>
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
            🏛️ For Universities & Institutions
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            A Partnership That Strengthens Your Students’ Careers — Without Adding Work to Your Faculty
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            CadetX helps universities bridge the gap between academic learning and industry expectations. We deliver internship‑driven, industry‑aligned training that prepares students to think, work, and perform like junior data professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=university">
              <Button size="lg" className="bg-white text-[#0D4ABC] hover:bg-gray-100 px-8 h-12 text-lg font-semibold">
                Partner With Us <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
)

// Why Partner With CadetX
const WhyPartnerSection = () => (
  <section className="py-20 bg-gray-50">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1D3557] mb-4">Why Partner With CadetX</h2>
        <p className="text-[#457B9D] text-lg font-medium">
          Industry‑aligned training that prepares students for the real world.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { icon: Building, title: 'Industry‑Aligned Internships', desc: 'Students work on company‑assigned tasks and gain exposure to professional workflows, teamwork, and problem‑solving.' },
          { icon: TrendingUp, title: 'Stronger Placement Outcomes', desc: 'Students graduate with practical experience, polished portfolios, GitHub projects, and confidence.' },
          { icon: CheckCircle, title: 'Zero Extra Work for Faculty', desc: 'CadetX manages the entire process — training, internships, reviews, and evaluations — so faculty can focus on academics.' },
          { icon: Target, title: 'Professional Skills', desc: 'Students develop communication, analytical thinking, documentation habits, and teamwork essential for success.' },
          { icon: ArrowRight, title: 'A Clear Path to Employment', desc: 'Top performers get referrals, portfolio support, mock interviews, and personalized guidance for job opportunities.' },
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

// How CadetX Supports Your Institution
const SupportSection = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1D3557] mb-4">How CadetX Supports Your Institution</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[
          {
            title: 'Enhances Your Placement Record',
            desc: 'More students secure meaningful roles with better job titles and stronger starting salaries — improving your overall placement performance.'
          },
          {
            title: 'Strengthens Your University Brand',
            desc: 'Your graduates perform better in industry, enhancing your institution’s reputation for producing job‑ready, high‑performing talent.'
          },
          {
            title: 'Creates Industry Connections',
            desc: 'We bring companies, real projects, and internship opportunities directly to your students, expanding your institution’s industry network.'
          }
        ].map((item, idx) => (
          <div key={idx} className="bg-[#f8f9fa] p-8 rounded-2xl border border-gray-100 text-center">
            <div className="w-16 h-16 rounded-full bg-[#0D4ABC] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-6">
              {idx + 1}
            </div>
            <h3 className="text-xl font-bold text-[#1D3557] mb-4">{item.title}</h3>
            <p className="text-[#457B9D] leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

// The Outcome for Universities
const OutcomeSection = () => (
  <section className="py-20 bg-[#1D3557] text-white">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">The Outcome for Universities</h2>
          <p className="text-xl text-gray-300 mb-8">
            Your university becomes known for producing graduates who are not just educated — but <span className="text-white font-bold">employable</span>.
          </p>
          <Link href="/register?role=university">
            <Button size="lg" className="bg-[#E63946] hover:bg-[#c92a37] text-white px-8 h-12 text-lg font-semibold">
              Become a Partner
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
        <div className="bg-white/10 p-8 rounded-2xl border border-white/20 backdrop-blur-sm">
          <h3 className="text-xl font-bold mb-6 text-[#E63946]">Your students graduate with:</h3>
          <ul className="space-y-4">
            {[
              'Internship experience',
              'Industry‑aligned skills',
              'Strong portfolios',
              'Interview confidence',
              'Job opportunities',
              'A clear path to their first year of experience'
            ].map((item, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-gray-200 font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
)

// Final CTA
const FinalCTA = () => (
  <section className="py-24 bg-white border-t border-gray-100 text-center">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-[#1D3557] mb-8">Ready to Elevate Your Institution?</h2>
      <p className="text-[#457B9D] mb-8 max-w-2xl mx-auto text-lg">
        Join universities who have transformed their placement outcomes with CadetX.
      </p>
      <Link href="/register?role=university">
        <Button size="lg" className="bg-[#0D4ABC] hover:bg-[#003399] text-white px-12 h-16 text-xl font-bold rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          Become a Partner
          <ArrowRight className="ml-2 h-6 w-6" />
        </Button>
      </Link>
    </div>
  </section>
)

export default function UniversitiesPage() {
  return (
    <main className="bg-white min-h-screen">
      <Navigation />
      <HeroSection />
      <WhyPartnerSection />
      <SupportSection />
      <OutcomeSection />
      <FinalCTA />
      <Footer />
    </main>
  )
}
