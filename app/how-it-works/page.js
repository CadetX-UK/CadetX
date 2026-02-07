'use client'

import { motion } from 'framer-motion'
import {
  GraduationCap, UserPlus, FileText, CreditCard, BookOpen,
  Award, Briefcase, ArrowRight, CheckCircle, Play
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
          <Link href="/how-it-works" className="font-medium text-[#0D4ABC]">How It Works</Link>
          <Link href="/about" className="text-gray-700 hover:text-[#0D4ABC]">About</Link>
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

export default function HowItWorksPage() {
  const studentJourney = [
    { icon: UserPlus, title: 'Sign Up', desc: 'Create your free account and tell us about yourself' },
    { icon: FileText, title: 'Take Assessment', desc: 'Complete our aptitude test to assess your current level' },
    { icon: CreditCard, title: 'Enroll', desc: 'Pay the program fee and get instant access to the LMS' },
    { icon: BookOpen, title: 'Learn', desc: 'Go through week-by-week curriculum at your own pace' },
    { icon: Award, title: 'Get Certified', desc: 'Complete quizzes and projects to earn your certification' },
    { icon: Briefcase, title: 'Get Hired', desc: 'Join our talent pool and get matched with employers' },
  ]

  const companyJourney = [
    { step: 1, title: 'Register as Company', desc: 'Create your company profile in minutes' },
    { step: 2, title: 'Browse Talent Pool', desc: 'Access our curated pool of pre-vetted candidates' },
    { step: 3, title: 'Filter & Search', desc: 'Find candidates by skills, scores, and experience' },
    { step: 4, title: 'Request Candidates', desc: 'Express interest in candidates you like' },
    { step: 5, title: 'Interview', desc: 'We coordinate interviews between you and candidates' },
    { step: 6, title: 'Hire', desc: 'Make an offer and onboard your new team member' },
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
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                How CadetX Works
              </h1>
              <p className="text-xl text-white/90">
                A simple, transparent process for both students and companies.
                Here's your roadmap to success.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Student Journey */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[#0D4ABC] font-semibold text-sm uppercase tracking-wider">For Students</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">Your Journey to a Data Career</h2>
          </div>
          <div className="relative">
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-[#0D4ABC] to-[#1976D2]" />
            <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-6">
              {studentJourney.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative text-center"
                >
                  <div className="relative z-10 mx-auto w-16 h-16 rounded-full bg-[#0D4ABC] text-white flex items-center justify-center shadow-lg mb-4">
                    <item.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="/register?role=student">
              <Button size="lg" className="bg-[#0D4ABC]">
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What You'll Learn</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'SQL', desc: 'Query databases like a pro' },
              { title: 'Python', desc: 'Data analysis with Pandas & NumPy' },
              { title: 'Tableau', desc: 'Create stunning visualizations' },
              { title: 'Statistics', desc: 'Make data-driven decisions' },
            ].map((skill, idx) => (
              <Card key={idx} className="text-center">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-[#0D4ABC] mb-2">{skill.title}</h3>
                  <p className="text-gray-600">{skill.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Journey */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[#9C0005] font-semibold text-sm uppercase tracking-wider">For Companies</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">Hire in 6 Simple Steps</h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {companyJourney.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-[#9C0005] text-white flex items-center justify-center font-bold shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="/register?role=company">
              <Button size="lg" className="bg-[#9C0005]">
                Start Hiring <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: 'Do I need prior experience?', a: 'No! Our program is designed for complete beginners. Basic computer literacy is all you need.' },
              { q: 'How long is the program?', a: 'The intensive program runs for 12 weeks, with 10-15 hours of learning per week.' },
              { q: 'Is there a guarantee?', a: 'Yes! We offer placement assistance and a money-back guarantee if you\'re not satisfied.' },
              { q: 'What happens after I complete the program?', a: 'You\'ll be added to our talent pool where companies can discover and hire you.' },
            ].map((faq, idx) => (
              <Card key={idx}>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join CadetX today and take the first step towards your data career.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=student">
              <Button size="lg" className="bg-white text-[#0D4ABC] hover:bg-gray-100">
                I'm a Student
              </Button>
            </Link>
            <Link href="/register?role=company">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                I'm a Company
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
