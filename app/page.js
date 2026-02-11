'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2, Users, GraduationCap, ArrowRight,
  Menu, X, BarChart3, Mail, User,
  Briefcase, BookOpen, Award
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

// Navigation Component
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/companies', label: 'For Companies' },
    { href: '/students', label: 'For Students' },
    { href: '/universities', label: 'For Universities' },
    { href: '/about', label: 'About' },
  ]

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gradient-to-r from-[#1D3557] via-[#0D4ABC] to-[#E63946] shadow-lg py-3' : 'bg-gradient-to-r from-[#1D3557]/95 via-[#0D4ABC]/95 to-[#E63946]/95 backdrop-blur-sm shadow-md py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo with White Background Pill */}
          <Link href="/" className="group">
            <div className="bg-white px-6 py-2 rounded-full shadow-lg border-2 border-white/20 transform transition-transform group-hover:scale-105">
              <span className="text-2xl font-extrabold tracking-tight">
                <span className="text-[#0D4ABC]">Cadet</span><span className="text-[#E63946]">X</span>
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/companies" className="text-white/90 font-medium hover:text-white transition-colors hover:bg-white/10 px-4 py-2 rounded-lg">For Companies</Link>
            <Link href="/students" className="text-white/90 font-medium hover:text-white transition-colors hover:bg-white/10 px-4 py-2 rounded-lg">For Students</Link>
            <Link href="/universities" className="text-white/90 font-medium hover:text-white transition-colors hover:bg-white/10 px-4 py-2 rounded-lg">For Universities</Link>
            <Link href="/about" className="text-white/90 font-medium hover:text-white transition-colors hover:bg-white/10 px-4 py-2 rounded-lg">About</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:bg-white/20 hover:text-white font-medium">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-white text-[#0D4ABC] hover:bg-gray-100 font-bold shadow-lg shadow-black/20">Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2 hover:bg-white/10 rounded-lg">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#1D3557] border-t border-white/10 overflow-hidden shadow-xl"
          >
            <div className="px-4 py-6 space-y-4">
              <Link href="/companies" className="block text-white/90 font-medium py-2 hover:bg-white/5 px-4 rounded-lg">For Companies</Link>
              <Link href="/students" className="block text-white/90 font-medium py-2 hover:bg-white/5 px-4 rounded-lg">For Students</Link>
              <Link href="/universities" className="block text-white/90 font-medium py-2 hover:bg-white/5 px-4 rounded-lg">For Universities</Link>
              <Link href="/about" className="block text-white/90 font-medium py-2 hover:bg-white/5 px-4 rounded-lg">About</Link>
              <div className="pt-4 flex flex-col space-y-3 px-4">
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 hover:text-white bg-transparent">Login</Button>
                </Link>
                <Link href="/register" className="w-full">
                  <Button className="w-full bg-white text-[#0D4ABC] font-bold hover:bg-gray-100">Get Started</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

// Hero Section
const HeroSection = () => (
  <section className="relative pt-32 pb-16 bg-white overflow-hidden">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto text-center"
      >
        <h1 className="text-[42px] md:text-[56px] font-extrabold leading-[1.1] mb-6 text-[#1D3557]">
          CadetX is the only platform that builds <span className="text-[#E63946]">junior data professionals</span> through hands‑on, company‑sourced internships
        </h1>

        <p className="text-xl text-[#457B9D] mb-10 max-w-4xl mx-auto leading-relaxed font-medium">
          Curated, Pre‑Trained Junior Data Professionals — Ready to Deliver from Day One.
          <br className="hidden md:block" />
          Skip the hiring risk. Get junior data talent that’s already trained, tested, and proven through structured, company‑aligned project work.
          <br className="hidden md:block" />
          <span className="text-[#1D3557] font-semibold mt-2 block">You get project‑ready talent — without hiring, onboarding, or supervision.</span>
        </p>

        <Link href="/register">
          <Button size="lg" className="bg-[#E63946] hover:bg-[#c92a37] text-white px-10 h-14 text-lg font-semibold rounded-lg shadow-lg">
            Get Curated Candidates
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </motion.div>
    </div>
  </section>
)

// Mind Map Section
const MindMapSection = () => {
  const [activeNode, setActiveNode] = useState(null)

  const nodes = [
    {
      id: 'internships',
      label: 'Hands-on internships',
      content: 'Company‑sourced internship pipeline that mirrors real workplace expectations.',
      position: 'top-left' // Not strictly used for positioning anymore, but good for ref
    },
    {
      id: 'workflows',
      label: 'Professional workflows',
      content: 'Pre‑trained, pre‑interviewed candidates vetted through structured workflows. Strong Employer Positioning - Every candidate proves their ability through structured workflows, documented tasks, and real deliverables.',
      position: 'top-right'
    },
    {
      id: 'execution',
      label: 'Proven execution',
      content: 'Zero training cost — talent arrives ready to deliver. Hire with confidence — juniors who contribute from day one.',
      position: 'bottom-left'
    },
    {
      id: 'training',
      label: 'Industry-aligned training',
      content: 'Thinking‑First Training Approach — we train analytical thinking, problem‑solving, and decision‑making so juniors can operate independently.',
      position: 'bottom-right'
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-white to-[#f0f8ff] overflow-hidden">
      <div className="container mx-auto px-4">

        {/* Highlighted Header Section */}
        <div className="text-center mb-24 relative bg-[#1D3557] py-16 rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-[#0D4ABC]/30 mx-2 md:mx-0">
          {/* Decorative Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0D4ABC] rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E63946] rounded-full blur-[120px] opacity-10 translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 px-6">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight drop-shadow-xl">
              WHY COMPANIES CHOOSE <span className="text-[#4CC9F0]">CADET</span><span className="text-[#E63946]">X</span>
            </h2>

            <div className="max-w-4xl mx-auto space-y-4 text-xl md:text-2xl text-blue-100 font-medium leading-relaxed">
              <p>Your company doesn’t need juniors who only know tools.</p>
              <p>You need juniors who can think, solve problems, and deliver.</p>

              <div className="pt-8">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block bg-[#0D4ABC] text-white font-bold text-2xl md:text-3xl py-4 px-10 rounded-full shadow-[0_20px_40px_rgba(13,74,188,0.4)] border border-white/20 transform hover:scale-105 transition-transform"
                >
                  That’s exactly what we prepare.
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto h-[600px] md:h-[500px] flex items-center justify-center">

          {/* Animated Connecting Lines (Double - Blue & Red Theme) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="lineFlowBlue" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0D4ABC" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#0D4ABC" stopOpacity="1" />
                <stop offset="100%" stopColor="#0D4ABC" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="lineFlowRed" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E63946" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#E63946" stopOpacity="1" />
                <stop offset="100%" stopColor="#E63946" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Top Left Connection */}
            {/* Primary Blue Line */}
            <motion.line
              x1="50%" y1="50%" x2="20%" y2="20%"
              stroke="#0D4ABC" strokeWidth="3" strokeDasharray="10 10"
              animate={{ strokeDashoffset: [0, -20] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              opacity="0.6"
            />
            {/* Secondary Red Line (Parallel Offset) */}
            <motion.line
              x1="51%" y1="51%" x2="21%" y2="21%"
              stroke="#E63946" strokeWidth="2" strokeDasharray="5 5"
              animate={{ strokeDashoffset: [0, -20] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              opacity="0.4"
            />

            {/* Top Right Connection */}
            <motion.line
              x1="50%" y1="50%" x2="80%" y2="20%"
              stroke="#0D4ABC" strokeWidth="3" strokeDasharray="10 10"
              animate={{ strokeDashoffset: [0, 20] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              opacity="0.6"
            />
            <motion.line
              x1="49%" y1="51%" x2="79%" y2="21%"
              stroke="#E63946" strokeWidth="2" strokeDasharray="5 5"
              animate={{ strokeDashoffset: [0, 20] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              opacity="0.4"
            />

            {/* Bottom Left Connection */}
            <motion.line
              x1="50%" y1="50%" x2="20%" y2="80%"
              stroke="#0D4ABC" strokeWidth="3" strokeDasharray="10 10"
              animate={{ strokeDashoffset: [0, -20] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              opacity="0.6"
            />
            <motion.line
              x1="51%" y1="49%" x2="21%" y2="79%"
              stroke="#E63946" strokeWidth="2" strokeDasharray="5 5"
              animate={{ strokeDashoffset: [0, -20] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              opacity="0.4"
            />

            {/* Bottom Right Connection */}
            <motion.line
              x1="50%" y1="50%" x2="80%" y2="80%"
              stroke="#0D4ABC" strokeWidth="3" strokeDasharray="10 10"
              animate={{ strokeDashoffset: [0, 20] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              opacity="0.6"
            />
            <motion.line
              x1="49%" y1="49%" x2="79%" y2="79%"
              stroke="#E63946" strokeWidth="2" strokeDasharray="5 5"
              animate={{ strokeDashoffset: [0, 20] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              opacity="0.4"
            />
          </svg>

          {/* Central Hub */}
          <div className="absolute z-20 w-56 h-56 rounded-full flex items-center justify-center bg-white shadow-[0_0_40px_rgba(13,74,188,0.2)] border-4 border-[#0D4ABC]">
            {/* Pulse Effect */}
            <div className="absolute inset-0 rounded-full border-4 border-[#0D4ABC] opacity-20 animate-ping"></div>
            <div className="text-center px-4 relative z-10">
              <span className="block text-[#457B9D] text-sm font-semibold tracking-wider uppercase mb-1">The CadetX</span>
              <span className="block text-2xl font-extrabold text-[#1D3557]">Standard</span>
            </div>
          </div>

          {/* Nodes Container */}
          <div className="absolute inset-0 z-10 w-full h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full">

              {/* Top Left */}
              <div className="flex justify-center md:justify-start md:pl-16 md:pt-10 items-start">
                <MindMapNode node={nodes[0]} activeNode={activeNode} setActiveNode={setActiveNode} />
              </div>

              {/* Top Right */}
              <div className="flex justify-center md:justify-end md:pr-16 md:pt-10 items-start">
                <MindMapNode node={nodes[1]} activeNode={activeNode} setActiveNode={setActiveNode} />
              </div>

              {/* Bottom Left */}
              <div className="flex justify-center md:justify-start md:pl-16 md:pb-10 items-end">
                <MindMapNode node={nodes[2]} activeNode={activeNode} setActiveNode={setActiveNode} />
              </div>

              {/* Bottom Right */}
              <div className="flex justify-center md:justify-end md:pr-16 md:pb-10 items-end">
                <MindMapNode node={nodes[3]} activeNode={activeNode} setActiveNode={setActiveNode} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const MindMapNode = ({ node, activeNode, setActiveNode }) => (
  <motion.div
    onHoverStart={() => setActiveNode(node.id)}
    onHoverEnd={() => setActiveNode(null)}
    className="relative group cursor-pointer w-72"
  >
    {/* Node Card */}
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`
        bg-white px-6 py-5 rounded-xl border-2 shadow-lg transition-all duration-300 relative z-20 text-center
        ${activeNode === node.id ? 'border-[#0D4ABC] bg-[#f0f8ff] shadow-[#0D4ABC]/20' : 'border-[#0D4ABC]/30 hover:border-[#0D4ABC]'}
      `}
    >
      <h3 className={`font-bold text-lg transition-colors ${activeNode === node.id ? 'text-[#0D4ABC]' : 'text-[#1D3557]'}`}>
        {node.label}
      </h3>
    </motion.div>

    {/* Connecting Dot (Visual anchor for the line) */}
    <div className={`
      absolute w-4 h-4 bg-[#0D4ABC] rounded-full border-2 border-white z-10 transition-all duration-300
      top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100
      ${activeNode === node.id ? 'scale-125' : 'scale-100'}
    `}></div>

    {/* Popover Content */}
    <AnimatePresence>
      {activeNode === node.id && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 5, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-80 bg-[#1D3557] text-white p-6 rounded-xl shadow-2xl border border-[#0D4ABC] z-50 text-center"
        >
          {/* Arrow */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#1D3557] transform rotate-45 border-l border-t border-[#0D4ABC]"></div>
          <p className="text-sm leading-relaxed font-medium text-white/90">
            {node.content}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
)

// Audience Segments Section (Restored)
const AudienceSection = () => (
  <section className="py-20 bg-gray-50 border-t border-gray-100">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Companies */}
        <Card className="hover:shadow-xl transition-all duration-300 group border-0 shadow-md">
          <CardContent className="p-8">
            <div className="w-14 h-14 rounded-xl bg-[#E63946] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <span className="text-[#E63946] font-bold tracking-wider text-xs uppercase mb-2 block">For Companies</span>
            <h3 className="text-2xl font-bold text-[#1D3557] mb-4">Hire with Confidence</h3>
            <p className="text-[#457B9D] mb-6 leading-relaxed">
              Get junior data talent that is already trained, tested, and ready to deliver from day one without the onboarding burden.
            </p>
            <Link href="/companies">
              <Button className="w-full bg-[#E63946] hover:bg-[#c92a37] text-white">
                Hire Talent <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Students */}
        <Card className="hover:shadow-xl transition-all duration-300 group border-0 shadow-md">
          <CardContent className="p-8">
            <div className="w-14 h-14 rounded-xl bg-[#1D3557] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <User className="w-7 h-7 text-white" />
            </div>
            <span className="text-[#E63946] font-bold tracking-wider text-xs uppercase mb-2 block">For Students</span>
            <h3 className="text-2xl font-bold text-[#1D3557] mb-4">Build Your Career by Doing</h3>
            <p className="text-[#457B9D] mb-6 leading-relaxed">
              Stop watching lectures. Start working on real company projects, master GitHub workflows, and build a professional portfolio.
            </p>
            <Link href="/students">
              <Button className="w-full bg-[#1D3557] hover:bg-[#0D4ABC] text-white">
                Start Training <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Universities */}
        <Card className="hover:shadow-xl transition-all duration-300 group border-0 shadow-md">
          <CardContent className="p-8">
            <div className="w-14 h-14 rounded-xl bg-[#457B9D] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <span className="text-[#E63946] font-bold tracking-wider text-xs uppercase mb-2 block">For Universities</span>
            <h3 className="text-2xl font-bold text-[#1D3557] mb-4">Strengthen Placement Outcomes</h3>
            <p className="text-[#457B9D] mb-6 leading-relaxed">
              Enhance your university brand by providing students with industry-aligned training and direct paths to employment.
            </p>
            <Link href="/universities">
              <Button className="w-full bg-[#457B9D] hover:bg-[#345d7a] text-white">
                Partner with Us <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
)

// How We Train Them
const TrainingSection = () => (
  <section className="py-24 bg-[#1D3557] relative overflow-hidden">
    {/* Background Accents (Subtle) */}
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#0D4ABC] rounded-full blur-[128px] opacity-20"></div>
      <div className="absolute top-1/2 -left-24 w-72 h-72 bg-[#E63946] rounded-full blur-[128px] opacity-10"></div>
    </div>

    <div className="container mx-auto px-4 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight drop-shadow-md">
          HOW WE <span className="text-[#4CC9F0]">TRAIN</span> THEM
        </h2>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto font-medium">
          We simulate the real world so they are ready for yours.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {[
          {
            step: '01',
            title: 'Company‑Sourced Project Experience',
            content: 'Every trainee works on partner‑sourced projects that follow workplace‑level expectations. They operate inside a company‑style setup using Microsoft Teams, Outlook, and GitHub to ensure they are ready for your environment.',
            borderColor: 'border-[#0D4ABC]',
            textColor: 'text-[#0D4ABC]',
            badgeColor: 'bg-[#0D4ABC]'
          },
          {
            step: '02',
            title: 'Real Scrum & Team Collaboration',
            content: 'Students follow Scrum methods with weekly sprint planning, daily stand‑ups, task boards, and end‑of‑week reviews. They learn to work in squads, handle ambiguity, and deliver consistently.',
            borderColor: 'border-[#E63946]',
            textColor: 'text-[#E63946]',
            badgeColor: 'bg-[#E63946]'
          },
          {
            step: '03',
            title: 'Weekly Manager Reviews',
            content: 'Every week, trainees meet with their manager to review progress, discuss blockers, present deliverables, and plan the next stage. This builds accountability and professional communication.',
            borderColor: 'border-[#E63946]',
            textColor: 'text-[#E63946]',
            badgeColor: 'bg-[#E63946]'
          },
          {
            step: '04',
            title: 'Thinking‑First Skill Development',
            content: 'To strengthen decision‑making, students undergo aptitude tests, analytical reasoning tasks, and logic‑based challenges. This sharpens their ability to troubleshoot and operate independently.',
            borderColor: 'border-[#0D4ABC]',
            textColor: 'text-[#0D4ABC]',
            badgeColor: 'bg-[#0D4ABC]'
          }
        ].map((card, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -5 }}
            className={`bg-white rounded-2xl p-8 border-l-8 ${card.borderColor} shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-[4rem] -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <div className={`absolute top-4 right-4 text-4xl font-black ${card.textColor} opacity-10 z-0`}>{card.step}</div>

            <div className="relative z-10">
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-4 ${card.badgeColor}`}>
                STEP {card.step}
              </div>
              <h3 className={`text-2xl font-bold ${card.textColor} mb-4`}>{card.title}</h3>
              <p className="text-[#1D3557]/80 leading-relaxed font-medium">{card.content}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

// Outcome & Hiring
const OutcomeSection = () => (
  <section className="py-20 bg-[#1D3557] text-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <span className="text-[#E63946] font-bold tracking-wider uppercase text-sm">OUTCOME</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">JOB‑READY JUNIOR DATA PROFESSIONALS</h2>
        <p className="text-xl text-[#457B9D] max-w-3xl mx-auto">
          By the time they reach your company, they already know how to think, communicate, collaborate, and deliver.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
        <div>
          <h3 className="text-2xl font-bold mb-6">Roles We Provide</h3>
          <ul className="space-y-4">
            {['Junior Data Analyst', 'Junior BI Analyst', 'Junior Data Scientist', 'Data Engineer'].map((role, idx) => (
              <li key={idx} className="flex items-center p-4 bg-white/10 rounded-lg border border-white/10">
                <div className="w-10 h-10 rounded-full bg-[#E63946] flex items-center justify-center mr-4">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold">{role}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-8 rounded-2xl text-[#1D3557]">
          <h3 className="text-2xl font-bold mb-6">How Hiring Works</h3>
          <div className="space-y-6">
            {[
              'You tell us the role you need',
              'We shortlist trained candidates and run multi‑round internal interviews',
              'You interview the final shortlisted candidates',
              'You hire with confidence'
            ].map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#E63946] flex items-center justify-center font-bold text-sm text-white">
                  {idx + 1}
                </div>
                <p className="text-[#457B9D]">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
)

// Final CTA
const FinalCTA = () => (
  <section className="py-24 bg-gray-50 border-t border-gray-200 text-center">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-[#1D3557] mb-8">Ready to hire pre‑trained junior data talent?</h2>
      <Link href="/register">
        <Button size="lg" className="bg-[#E63946] hover:bg-[#c92a37] text-white px-12 h-16 text-xl font-bold rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          Get Curated Candidates
          <ArrowRight className="ml-2 h-6 w-6" />
        </Button>
      </Link>
    </div>
  </section>
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

// Main Home Page
export default function HomePage() {
  return (
    <main className="bg-white min-h-screen">
      <Navigation />
      <HeroSection />
      <MindMapSection />
      <TrainingSection />
      <OutcomeSection />
      <AudienceSection />
      <FinalCTA />
      <Footer />
    </main>
  )
}
