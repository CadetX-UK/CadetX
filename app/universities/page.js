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

export default function UniversitiesPage() {
  const benefits = [
    { icon: TrendingUp, title: 'Boost Placement Rates', desc: 'Improve your institution\'s placement statistics with our industry-ready training program' },
    { icon: BookOpen, title: 'Industry Curriculum', desc: 'Access our constantly updated curriculum designed by industry experts' },
    { icon: BarChart3, title: 'Real-Time Analytics', desc: 'Track your students\' progress with detailed dashboards and reports' },
    { icon: Award, title: 'Certified Graduates', desc: 'Students earn recognized certifications that employers trust' },
    { icon: Users, title: 'Employer Network', desc: 'Connect your students to our network of 500+ hiring companies' },
    { icon: Target, title: 'Custom Programs', desc: 'Tailor the program to fit your university\'s specific needs' },
  ]

  const partnershipTiers = [
    {
      name: 'Starter',
      students: 'Up to 50 students',
      features: ['LMS Access', 'Basic Analytics', 'Email Support', 'Certification'],
      highlight: false
    },
    {
      name: 'Growth',
      students: '51-200 students',
      features: ['Everything in Starter', 'Priority Placements', 'Dedicated Manager', 'Custom Branding', 'Monthly Reports'],
      highlight: true
    },
    {
      name: 'Enterprise',
      students: '200+ students',
      features: ['Everything in Growth', 'Custom Curriculum', 'On-Campus Workshops', 'API Integration', 'Co-Branded Certificates'],
      highlight: false
    }
  ]

  return (
    <main>
      <Navigation />

      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-[#0D4ABC] via-[#1565C0] to-[#1976D2] text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6">
                🏛️ For Universities & Institutions
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Transform Your Students Into Industry-Ready Professionals
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Partner with CadetX to provide world-class data analytics training,
                boost your placement rates, and connect students directly with top employers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register?role=university">
                  <Button size="lg" className="bg-white text-[#0D4ABC] hover:bg-gray-100">
                    Become a Partner <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Schedule a Demo
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
                src="https://images.pexels.com/photos/5475750/pexels-photo-5475750.jpeg"
                alt="University partnership"
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
              { value: '100+', label: 'Partner Institutions' },
              { value: '95%', label: 'Avg. Placement Rate' },
              { value: '50K+', label: 'Students Trained' },
              { value: '4.8★', label: 'Partner Satisfaction' },
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Partner With CadetX?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We help universities bridge the gap between academic education and industry requirements.
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

      {/* Partnership Tiers */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Partnership Programs</h2>
            <p className="text-gray-600">Flexible options to fit your institution's needs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {partnershipTiers.map((tier, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className={`h-full ${tier.highlight ? 'border-2 border-[#0D4ABC] shadow-xl' : ''}`}>
                  <CardContent className="p-6">
                    {tier.highlight && (
                      <span className="inline-block px-3 py-1 bg-[#0D4ABC] text-white text-xs font-medium rounded-full mb-4">
                        Most Popular
                      </span>
                    )}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                    <p className="text-gray-600 mb-6">{tier.students}</p>
                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-700">
                          <CheckCircle className="w-5 h-5 text-green-500" /> {feature}
                        </li>
                      ))}
                    </ul>
                    <Link href="/contact">
                      <Button className={`w-full ${tier.highlight ? 'bg-[#0D4ABC]' : ''}`} variant={tier.highlight ? 'default' : 'outline'}>
                        Get Started
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How Partnership Works</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { step: 1, title: 'Sign Up', desc: 'Register as a university partner' },
              { step: 2, title: 'Onboard Students', desc: 'Enroll your students via invite codes' },
              { step: 3, title: 'Track Progress', desc: 'Monitor learning with real-time analytics' },
              { step: 4, title: 'Celebrate Placements', desc: 'Watch your students get hired' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#0D4ABC] text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Institution?</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join 100+ universities who have transformed their placement outcomes with CadetX.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=university">
              <Button size="lg" className="bg-white text-[#0D4ABC] hover:bg-gray-100">
                Become a Partner <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Talk to Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
