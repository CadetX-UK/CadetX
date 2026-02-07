'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  GraduationCap, Mail, Phone, MapPin, Send,
  MessageSquare, Clock, CheckCircle, Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))

    setLoading(false)
    setSubmitted(true)
  }

  const contactInfo = [
    { icon: Mail, title: 'Email', value: 'hello@cadetx.com', link: 'mailto:hello@cadetx.com' },
    { icon: Phone, title: 'Phone', value: '+91 98765 43210', link: 'tel:+919876543210' },
    { icon: MapPin, title: 'Address', value: 'Bangalore, India', link: null },
    { icon: Clock, title: 'Hours', value: 'Mon-Fri, 9AM-6PM IST', link: null },
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
                Get in Touch
              </h1>
              <p className="text-xl text-white/90">
                Have questions? We'd love to hear from you. Send us a message
                and we'll respond as soon as possible.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardContent className="p-8">
                  {submitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                      <p className="text-gray-600">We'll get back to you within 24 hours.</p>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700">Name</label>
                            <Input
                              placeholder="Your name"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Subject</label>
                          <Input
                            placeholder="How can we help?"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Message</label>
                          <Textarea
                            placeholder="Your message..."
                            rows={5}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full bg-[#0D4ABC]" disabled={loading}>
                          {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              Send Message <Send className="ml-2 w-4 h-4" />
                            </>
                          )}
                        </Button>
                      </form>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                <div className="space-y-4">
                  {contactInfo.map((info, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                        <info.icon className="w-6 h-6 text-[#0D4ABC]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{info.title}</h3>
                        {info.link ? (
                          <a href={info.link} className="text-[#0D4ABC] hover:underline">{info.value}</a>
                        ) : (
                          <p className="text-gray-600">{info.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="bg-gray-50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Quick Questions?</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Check out our FAQ section for instant answers to common questions.
                  </p>
                  <Link href="/how-it-works">
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="mr-2 w-4 h-4" /> View FAQ
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-[#0D4ABC] text-white">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">For Partnerships</h3>
                  <p className="text-white/80 text-sm mb-4">
                    Interested in partnering with CadetX? We'd love to explore opportunities.
                  </p>
                  <a href="mailto:partners@cadetx.com">
                    <Button variant="secondary" className="w-full">
                      <Mail className="mr-2 w-4 h-4" /> partners@cadetx.com
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
