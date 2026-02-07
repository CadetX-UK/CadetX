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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${scrolled ? 'shadow-md' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Text Only (No Icon) */}
          <Link href="/" className="flex items-center">
            <span className="text-3xl font-extrabold tracking-tight">
              <span className="text-[#0D4ABC]">Cadet</span>
              <span className="text-[#9C0005]">X</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-[#1D3557] hover:text-[#E63946] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button variant="outline" className="border-[#1D3557] text-[#1D3557] hover:bg-[#1D3557] hover:text-white">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-[#E63946] hover:bg-[#c92a37] text-white px-6 font-semibold">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[#1D3557]"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t"
            >
              <div className="py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block py-2 px-4 text-[#1D3557] hover:bg-gray-50 hover:text-[#E63946]"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 px-4 space-y-2">
                  <Link href="/login" className="block">
                    <Button variant="outline" className="w-full border-[#1D3557] text-[#1D3557]">Login</Button>
                  </Link>
                  <Link href="/register" className="block">
                    <Button className="w-full bg-[#E63946] hover:bg-[#c92a37] text-white">Get Started</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
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
        className="max-w-4xl mx-auto text-center"
      >
        <h1 className="text-[48px] font-extrabold leading-[1.1] mb-6 text-[#1D3557]">
          The Hands-On Ecosystem for Junior Data Professionals.
        </h1>

        <p className="text-xl text-[#457B9D] mb-10 max-w-3xl mx-auto leading-relaxed">
          We bridge the gap between education and industry. CadetX provides companies with pre-vetted talent, students with real-world experience, and universities with industry-aligned placement success.
        </p>

        <Link href="/register">
          <Button size="lg" className="bg-[#E63946] hover:bg-[#c92a37] text-white px-10 h-14 text-lg font-semibold rounded-lg shadow-lg">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </motion.div>
    </div>
  </section>
)

// Value Strip
const ValueStrip = () => (
  <section className="py-6 bg-[#1D3557]">
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-white text-sm md:text-base font-medium">
        <span>Hands-on internships</span>
        <span className="hidden md:inline">•</span>
        <span>Professional workflows</span>
        <span className="hidden md:inline">•</span>
        <span>Proven execution</span>
        <span className="hidden md:inline">•</span>
        <span>Industry-aligned training</span>
      </div>
    </div>
  </section>
)

// Audience Segments Section
const AudienceSegmentsSection = () => {
  const segments = [
    {
      target: 'For Companies',
      headline: 'Hire with Confidence',
      summary: 'Get junior data talent that is already trained, tested, and ready to deliver from day one without the onboarding burden.',
      cta: 'Hire Talent',
      href: '/companies',
      icon: Building2,
      color: 'bg-[#E63946]',
      hoverColor: 'hover:bg-[#c92a37]'
    },
    {
      target: 'For Students',
      headline: 'Build Your Career by Doing',
      summary: 'Stop watching lectures. Start working on real company projects, master GitHub workflows, and build a professional portfolio.',
      cta: 'Start Training',
      href: '/students',
      icon: User,
      color: 'bg-[#1D3557]',
      hoverColor: 'hover:bg-[#0f1e33]'
    },
    {
      target: 'For Universities',
      headline: 'Strengthen Placement Outcomes',
      summary: 'Enhance your university brand by providing students with industry-aligned training and direct paths to employment.',
      cta: 'Partner with Us',
      href: '/universities',
      icon: GraduationCap,
      color: 'bg-[#457B9D]',
      hoverColor: 'hover:bg-[#3a6a8a]'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {segments.map((segment, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className={`w-14 h-14 rounded-xl ${segment.color} flex items-center justify-center mb-6`}>
                    <segment.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-[#E63946] uppercase tracking-wider mb-2">
                    {segment.target}
                  </span>
                  <h3 className="text-2xl font-bold text-[#1D3557] mb-4">{segment.headline}</h3>
                  <p className="text-[#457B9D] leading-relaxed mb-6 flex-grow">{segment.summary}</p>
                  <Link href={segment.href}>
                    <Button className={`${segment.color} ${segment.hoverColor} text-white w-full font-semibold`}>
                      {segment.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Footer
const Footer = () => (
  <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div>
          {/* Logo - Text Only */}
          <div className="flex items-center mb-4">
            <span className="text-3xl font-extrabold tracking-tight">
              <span className="text-[#0D4ABC]">Cadet</span>
              <span className="text-[#9C0005]">X</span>
            </span>
          </div>
          <p className="text-[#457B9D] mb-4">
            The hands-on ecosystem for junior data professionals.
          </p>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#457B9D]" />
            <span className="text-[#457B9D]">hello@cadetx.com</span>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-[#1D3557] mb-4">For You</h4>
          <ul className="space-y-2">
            <li><Link href="/companies" className="text-[#457B9D] hover:text-[#E63946] transition-colors">For Companies</Link></li>
            <li><Link href="/students" className="text-[#457B9D] hover:text-[#E63946] transition-colors">For Students</Link></li>
            <li><Link href="/universities" className="text-[#457B9D] hover:text-[#E63946] transition-colors">For Universities</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-[#1D3557] mb-4">Company</h4>
          <ul className="space-y-2">
            <li><Link href="/about" className="text-[#457B9D] hover:text-[#E63946] transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="text-[#457B9D] hover:text-[#E63946] transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-[#1D3557] mb-4">Legal</h4>
          <ul className="space-y-2">
            <li><Link href="#" className="text-[#457B9D] hover:text-[#E63946] transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="text-[#457B9D] hover:text-[#E63946] transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-[#457B9D] text-sm">
          © 2025 CadetX. All rights reserved.
        </p>
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
      <ValueStrip />
      <AudienceSegmentsSection />
      <Footer />
    </main>
  )
}
