'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  GraduationCap, Building2, Users, CheckCircle, ArrowRight, 
  BookOpen, Award, Briefcase, ChevronRight, Star, Menu, X,
  BarChart3, Target, Shield, Zap, Play, Mail, Phone, MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Navigation Component
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/students', label: 'For Students' },
    { href: '/universities', label: 'For Universities' },
    { href: '/companies', label: 'For Companies' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className={`text-2xl font-bold ${scrolled ? 'text-[#0D4ABC]' : 'text-white'}`}>CadetX</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors hover:text-[#0D4ABC] ${scrolled ? 'text-gray-700' : 'text-white/90 hover:text-white'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button variant={scrolled ? "outline" : "ghost"} className={!scrolled ? 'text-white border-white/30 hover:bg-white/10' : ''}>
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-[#9C0005] hover:bg-[#7a0004] text-white">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className={scrolled ? 'text-gray-900' : 'text-white'} size={24} />
            ) : (
              <Menu className={scrolled ? 'text-gray-900' : 'text-white'} size={24} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white rounded-lg shadow-xl mb-4 overflow-hidden"
            >
              <div className="py-4 px-4 space-y-2">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href}
                    className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 space-y-2 border-t">
                  <Link href="/login" className="block">
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link href="/register" className="block">
                    <Button className="w-full bg-[#9C0005] hover:bg-[#7a0004]">Get Started</Button>
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
  <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
    </div>
    
    <div className="container mx-auto px-4 pt-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white"
        >
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6">
            <Star className="w-4 h-4 text-yellow-400 mr-2" />
            <span className="text-sm font-medium">Trusted by 500+ Companies</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Hire with Confidence.
            <span className="block text-yellow-300">Every Cadet is Proven.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl">
            CadetX trains junior data professionals through intensive internships 
            and provides pre-vetted, job-ready talent to forward-thinking companies.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/register?role=student">
              <Button size="lg" className="bg-white text-[#0D4ABC] hover:bg-gray-100 w-full sm:w-auto">
                <GraduationCap className="mr-2 h-5 w-5" />
                Start as Student
              </Button>
            </Link>
            <Link href="/register?role=company">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                <Building2 className="mr-2 h-5 w-5" />
                Hire Talent
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-8 mt-12">
            <div>
              <div className="text-3xl font-bold">2000+</div>
              <div className="text-white/70 text-sm">Trained Cadets</div>
            </div>
            <div className="w-px h-12 bg-white/30" />
            <div>
              <div className="text-3xl font-bold">95%</div>
              <div className="text-white/70 text-sm">Placement Rate</div>
            </div>
            <div className="w-px h-12 bg-white/30" />
            <div>
              <div className="text-3xl font-bold">4.9★</div>
              <div className="text-white/70 text-sm">Avg. Rating</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.pexels.com/photos/8532850/pexels-photo-8532850.jpeg" 
              alt="Data Analytics Professional"
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D4ABC]/50 to-transparent" />
          </div>
          
          {/* Floating Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Skill Verified</div>
                <div className="text-sm text-gray-500">Ready to hire</div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Award className="w-6 h-6 text-[#0D4ABC]" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Top Performer</div>
                <div className="text-sm text-gray-500">Data Analytics</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>

    {/* Wave Divider */}
    <div className="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
      </svg>
    </div>
  </section>
)

// Features Section
const FeaturesSection = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Structured Learning',
      description: 'Week-by-week curriculum covering SQL, Python, Tableau, and more. Learn from industry experts.',
      color: 'bg-blue-500'
    },
    {
      icon: Target,
      title: 'Real Projects',
      description: 'Work on actual business problems. Build a portfolio that showcases your skills to employers.',
      color: 'bg-green-500'
    },
    {
      icon: Award,
      title: 'Skill Certification',
      description: 'Earn verified badges and certifications. Stand out in the job market with proven skills.',
      color: 'bg-purple-500'
    },
    {
      icon: Briefcase,
      title: 'Direct Placement',
      description: 'Get matched with companies actively hiring. Skip the job hunt with our talent pool.',
      color: 'bg-orange-500'
    },
    {
      icon: Shield,
      title: 'Quality Guarantee',
      description: 'Every cadet is vetted through rigorous assessments. Hire with confidence.',
      color: 'bg-red-500'
    },
    {
      icon: Zap,
      title: 'Fast Track',
      description: '12-week intensive program. Transform from beginner to job-ready professional.',
      color: 'bg-yellow-500'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#0D4ABC] font-semibold text-sm uppercase tracking-wider">Why CadetX</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From learning to landing your dream job, CadetX provides a complete ecosystem for data professionals.
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={fadeInUp}
              className="group"
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 card-hover">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// How It Works Section
const HowItWorksSection = () => {
  const steps = [
    { step: 1, title: 'Sign Up', description: 'Create your account and complete your profile' },
    { step: 2, title: 'Take Assessment', description: 'Complete our aptitude test to gauge your level' },
    { step: 3, title: 'Start Learning', description: 'Access structured curriculum and projects' },
    { step: 4, title: 'Get Placed', description: 'Match with companies and start your career' }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#0D4ABC] font-semibold text-sm uppercase tracking-wider">The Process</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            How CadetX Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A simple 4-step journey from aspiring to accomplished data professional.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#0D4ABC] to-[#9C0005] transform -translate-y-1/2" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative text-center"
              >
                <div className="relative z-10 mx-auto w-16 h-16 rounded-full bg-[#0D4ABC] text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/how-it-works">
            <Button size="lg" className="bg-[#0D4ABC] hover:bg-[#0a3d9c]">
              Learn More <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Data Analyst at TechCorp',
      image: 'https://images.pexels.com/photos/32115908/pexels-photo-32115908.jpeg',
      quote: 'CadetX transformed my career. The structured learning and real projects gave me the confidence to land my dream job.',
      rating: 5
    },
    {
      name: 'Rahul Verma',
      role: 'BI Developer at FinanceHub',
      image: 'https://images.pexels.com/photos/6326368/pexels-photo-6326368.jpeg',
      quote: 'The mentorship and hands-on projects at CadetX prepared me for real-world challenges. Highly recommended!',
      rating: 5
    },
    {
      name: 'Ananya Patel',
      role: 'Data Scientist at StartupX',
      image: 'https://images.pexels.com/photos/4344878/pexels-photo-4344878.jpeg',
      quote: 'From zero coding knowledge to a data scientist in 12 weeks. CadetX made it possible with their amazing curriculum.',
      rating: 5
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#0D4ABC] font-semibold text-sm uppercase tracking-wider">Success Stories</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            What Our Cadets Say
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// CTA Section
const CTASection = () => (
  <section className="py-20 gradient-primary relative overflow-hidden">
    <div className="absolute inset-0 opacity-10">
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
    </div>
    
    <div className="container mx-auto px-4 relative z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center text-white max-w-3xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Transform Your Career?
        </h2>
        <p className="text-xl text-white/90 mb-8">
          Join thousands of successful cadets who have launched their data careers with us.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register?role=student">
            <Button size="lg" className="bg-white text-[#0D4ABC] hover:bg-gray-100">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Talk to Us
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
)

// Footer
const Footer = () => (
  <footer className="bg-gray-900 text-white py-16">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#0D4ABC] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">CadetX</span>
          </div>
          <p className="text-gray-400 mb-4">
            Hire with Confidence. Every Cadet is Proven.
          </p>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">hello@cadetx.com</span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">For Students</h4>
          <ul className="space-y-2">
            <li><Link href="/students" className="text-gray-400 hover:text-white transition-colors">Programs</Link></li>
            <li><Link href="/how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</Link></li>
            <li><Link href="/register" className="text-gray-400 hover:text-white transition-colors">Apply Now</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">For Companies</h4>
          <ul className="space-y-2">
            <li><Link href="/companies" className="text-gray-400 hover:text-white transition-colors">Hire Talent</Link></li>
            <li><Link href="/companies" className="text-gray-400 hover:text-white transition-colors">Talent Pool</Link></li>
            <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Sales</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Company</h4>
          <ul className="space-y-2">
            <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
            <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-400 text-sm">
          © 2025 CadetX. All rights reserved.
        </p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link>
          <Link href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</Link>
        </div>
      </div>
    </div>
  </footer>
)

// Main Home Page
export default function HomePage() {
  return (
    <main>
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
