'use client'

import { motion } from 'framer-motion'
import {
  GraduationCap, Target, Heart, Users, Award, Rocket,
  ArrowRight, Linkedin, Twitter, Mail
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
          <Link href="/companies" className="text-gray-700 hover:text-[#0D4ABC]">For Companies</Link>
          <Link href="/how-it-works" className="text-gray-700 hover:text-[#0D4ABC]">How It Works</Link>
          <Link href="/about" className="font-medium text-[#0D4ABC]">About</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login"><Button variant="outline">Login</Button></Link>
          <Link href="/register"><Button className="bg-[#0D4ABC]">Get Started</Button></Link>
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
  <section className="pt-24 pb-16 bg-[#1D3557] text-white">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6">
            Building the Next Generation of Job‑Ready Data Professionals
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Talent is Everywhere — But Opportunity Isn’t.
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Every year, thousands of students graduate with strong academic knowledge but struggle to enter the industry because they lack one thing employers expect: <span className="font-bold text-[#E63946]">real, workplace‑aligned experience.</span>
            <br className="mt-4 block" />
            CadetX exists to bridge that gap.
          </p>
        </motion.div>
      </div>
    </div>
  </section>
)

// Our Story (The Gap)
const StorySection = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1D3557] mb-6">Why CadetX Exists</h2>
          <p className="text-xl text-[#457B9D] font-medium">Because the traditional education‑to‑employment pipeline is broken.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12 text-center">
          {[
            { title: 'Students', desc: 'Learn theory without practice.' },
            { title: 'Universities', desc: 'Carry the pressure of placements.' },
            { title: 'Employers', desc: 'Struggle to find job‑ready talent.' }
          ].map((item, idx) => (
            <div key={idx} className="p-6 bg-gray-50 rounded-xl border border-gray-100">
              <h3 className="text-lg font-bold text-[#1D3557] mb-2">{item.title}</h3>
              <p className="text-[#457B9D]">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#f0f4f8] p-8 rounded-2xl text-center border-l-4 border-[#0D4ABC]">
          <p className="text-lg text-[#1D3557] leading-relaxed font-medium">
            CadetX brings all three together — students, universities, and companies — into one aligned ecosystem.
            <br /><br />
            We prepare students to think, work, and perform like junior data professionals through structured, company‑aligned internships and industry‑ready training.
          </p>
        </div>
      </div>
    </div>
  </section>
)

// Mission & Vision
const MissionVisionSection = () => (
  <section className="py-20 bg-[#1D3557] text-white">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div>
          <h3 className="text-2xl font-bold text-[#E63946] mb-4 flex items-center gap-2">
            <Target className="w-6 h-6" /> Our Mission
          </h3>
          <p className="text-lg text-gray-300 leading-relaxed">
            To create a talent ecosystem where students gain real experience, companies hire with confidence, and universities strengthen their placement outcomes — all through a single, scalable platform.
          </p>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-[#E63946] mb-4 flex items-center gap-2">
            <Rocket className="w-6 h-6" /> Our Vision
          </h3>
          <p className="text-lg text-gray-300 leading-relaxed">
            To create a world where every student graduates with industry‑aligned skills, real experience, and a clear path to employment — supported by a unified ecosystem connecting students, universities, and companies.
          </p>
        </div>
      </div>
    </div>
  </section>
)

// The CadetX Promise
const PromiseSection = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1D3557]">The CadetX Promise</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[
          { icon: Users, target: 'To Every Student', desc: 'We help you build the skills, confidence, and experience to start your career.' },
          { icon: GraduationCap, target: 'To Every University', desc: 'We strengthen your placement outcomes and industry reputation.' },
          { icon: Award, target: 'To Every Company', desc: 'We deliver junior talent that is trained, vetted, and ready to contribute.' }
        ].map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -5 }}
            className="p-8 bg-white border border-gray-100 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <div className="w-14 h-14 rounded-full bg-[#0D4ABC]/10 flex items-center justify-center mb-6 mx-auto">
              <item.icon className="w-7 h-7 text-[#0D4ABC]" />
            </div>
            <h3 className="text-xl font-bold text-[#1D3557] mb-3 text-center">{item.target}</h3>
            <p className="text-[#457B9D] text-center leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

// Join Us CTA
const JoinUsSection = () => (
  <section className="py-24 bg-gray-50 border-t border-gray-200 text-center">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-[#1D3557] mb-6">Join Us</h2>
      <p className="text-[#457B9D] mb-10 max-w-2xl mx-auto text-lg">
        Whether you’re a student looking to start your career, a university aiming to strengthen placements, or a company seeking job‑ready talent — CadetX is building the platform that supports your journey.
      </p>

      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/register?role=student">
          <Button size="lg" className="bg-[#0D4ABC] hover:bg-[#003399] text-white px-8 h-12 text-lg">
            For Students <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
        <Link href="/register?role=company">
          <Button size="lg" variant="outline" className="border-[#0D4ABC] text-[#0D4ABC] hover:bg-[#0D4ABC] hover:text-white px-8 h-12 text-lg">
            For Companies
          </Button>
        </Link>
        <Link href="/register?role=university">
          <Button size="lg" variant="outline" className="border-[#0D4ABC] text-[#0D4ABC] hover:bg-[#0D4ABC] hover:text-white px-8 h-12 text-lg">
            For Universities
          </Button>
        </Link>
      </div>
    </div>
  </section>
)

export default function AboutPage() {
  const values = [
    { icon: Target, title: 'Mission-Driven', desc: 'We exist to democratize access to data careers for everyone.' },
    { icon: Heart, title: 'Student-First', desc: 'Every decision we make prioritizes student success and outcomes.' },
    { icon: Award, title: 'Quality Obsessed', desc: 'We never compromise on the quality of our training or talent.' },
    { icon: Rocket, title: 'Innovation', desc: 'We constantly evolve our curriculum to match industry needs.' },
  ]

  const team = [
    { name: 'Founder & CEO', role: 'Building the future of data hiring', image: 'https://images.pexels.com/photos/6326368/pexels-photo-6326368.jpeg' },
    { name: 'Head of Curriculum', role: 'Ex-Data Scientist at Google', image: 'https://images.pexels.com/photos/32115908/pexels-photo-32115908.jpeg' },
    { name: 'Head of Placements', role: '10+ years in tech recruiting', image: 'https://images.pexels.com/photos/4344878/pexels-photo-4344878.jpeg' },
  ]

  return (
    <main>
      <Navigation />
      <HeroSection />
      <StorySection />
      <MissionVisionSection />
      <PromiseSection />
      <JoinUsSection />
      <Footer />
    </main>
  )
}
