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
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-[#0D4ABC]">CadetX</span>
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
          <div className="w-10 h-10 rounded-lg bg-[#0D4ABC] flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold">CadetX</span>
        </div>
        <p className="text-gray-400 text-sm">© 2025 CadetX. All rights reserved.</p>
      </div>
    </div>
  </footer>
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
      
      {/* Hero */}
      <section className="pt-24 pb-16 gradient-hero text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                About CadetX
              </h1>
              <p className="text-xl text-white/90">
                We're on a mission to train the next generation of data professionals 
                and connect them with companies who value quality talent.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="prose prose-lg text-gray-600">
              <p className="mb-4">
                CadetX was born from a simple observation: there's a massive gap between 
                what colleges teach and what companies need. Thousands of talented individuals 
                struggle to break into data careers, while companies struggle to find quality talent.
              </p>
              <p className="mb-4">
                We decided to bridge this gap by creating an intensive, practical training program 
                that transforms motivated individuals into job-ready data professionals. But we didn't 
                stop there—we also built a talent marketplace that gives our graduates direct access 
                to hiring companies.
              </p>
              <p>
                Today, CadetX has trained over 2,000 data professionals with a 95% placement rate. 
                Our graduates work at leading companies across tech, finance, healthcare, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
              <h3 className="text-2xl font-bold text-[#0D4ABC] mb-4">Our Mission</h3>
              <p className="text-lg text-gray-600">
                To democratize access to data careers by providing world-class training 
                and direct pathways to employment for motivated individuals, regardless 
                of their background.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#9C0005] mb-4">Our Vision</h3>
              <p className="text-lg text-gray-600">
                A world where talent wins over credentials, where anyone with determination 
                can build a successful career in data, and where companies can hire with 
                complete confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-7 h-7 text-[#0D4ABC]" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-gray-600 text-sm">{value.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Leadership Team</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="text-center overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 gradient-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '2000+', label: 'Graduates' },
              { value: '500+', label: 'Hiring Partners' },
              { value: '95%', label: 'Placement Rate' },
              { value: '4.9★', label: 'Avg. Rating' },
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-4xl font-bold">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join the CadetX Community</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're looking to start your data career or hire great talent, 
            we'd love to have you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=student">
              <Button size="lg" className="bg-[#0D4ABC]">
                Join as Student <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register?role=company">
              <Button size="lg" variant="outline">
                Join as Company <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
