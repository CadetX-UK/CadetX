'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  GraduationCap, User, FileText, CreditCard, CheckCircle, 
  ArrowRight, ArrowLeft, Loader2, BookOpen, Briefcase,
  Linkedin, Github, Phone, Building2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useRouter } from 'next/navigation'

const aptitudeQuestions = [
  {
    question: 'What does SQL stand for?',
    options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Logic', 'System Query Language'],
    correct: 0
  },
  {
    question: 'Which Python library is commonly used for data analysis?',
    options: ['Django', 'Flask', 'Pandas', 'PyGame'],
    correct: 2
  },
  {
    question: 'What type of chart is best for showing parts of a whole?',
    options: ['Line Chart', 'Bar Chart', 'Pie Chart', 'Scatter Plot'],
    correct: 2
  },
  {
    question: 'What is the primary key in a database?',
    options: ['Any column', 'A unique identifier for each row', 'The first column', 'A password'],
    correct: 1
  },
  {
    question: 'Which of these is a data visualization tool?',
    options: ['MySQL', 'Tableau', 'MongoDB', 'Redis'],
    correct: 1
  }
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Profile form
  const [profile, setProfile] = useState({
    phone: '',
    education: '',
    experience: '',
    skills: '',
    linkedin: '',
    github: '',
    bio: '',
    company_name: '',
    company_size: '',
    industry: '',
    website: ''
  })

  // Aptitude test
  const [aptitudeAnswers, setAptitudeAnswers] = useState({})
  const [currentQuestion, setCurrentQuestion] = useState(0)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const getToken = () => localStorage.getItem('token')

  const handleProfileSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(profile)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save profile')
      }

      if (user?.role === 'company') {
        // Companies skip to completion
        const updatedUser = { ...user, onboarding_completed: true }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        router.push('/company/dashboard')
      } else {
        setStep(2)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAptitudeSubmit = async () => {
    const score = Object.entries(aptitudeAnswers).reduce((acc, [idx, answer]) => {
      return acc + (aptitudeQuestions[parseInt(idx)].correct === answer ? 20 : 0)
    }, 0)

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/onboarding/aptitude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ answers: aptitudeAnswers, score })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit test')
      }

      setStep(3)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    setLoading(true)
    setError('')

    try {
      // Mock payment - in production, integrate with Stripe/Razorpay
      const res = await fetch('/api/onboarding/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          payment_id: 'mock_' + Date.now(),
          amount: 9999
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Payment failed')
      }

      // Seed materials
      await fetch('/api/seed', { method: 'POST' })

      // Update local user
      const updatedUser = { ...user, onboarding_completed: true, payment_verified: true }
      localStorage.setItem('user', JSON.stringify(updatedUser))

      setStep(4)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const totalSteps = user?.role === 'company' ? 2 : 4
  const progress = (step / totalSteps) * 100

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to CadetX</h1>
          <p className="text-gray-600 mt-2">Let's complete your profile</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Profile */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-[#0D4ABC]" />
                    Basic Details
                  </CardTitle>
                  <CardDescription>Tell us more about yourself</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.role === 'student' ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Phone</label>
                          <Input
                            placeholder="+91 98765 43210"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Education</label>
                          <Input
                            placeholder="B.Tech in Computer Science"
                            value={profile.education}
                            onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">Experience Level</label>
                        <Input
                          placeholder="Fresher / 1-2 years / etc."
                          value={profile.experience}
                          onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">Skills</label>
                        <Input
                          placeholder="Python, SQL, Excel, Tableau"
                          value={profile.skills}
                          onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">LinkedIn URL</label>
                          <Input
                            placeholder="linkedin.com/in/username"
                            value={profile.linkedin}
                            onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">GitHub URL</label>
                          <Input
                            placeholder="github.com/username"
                            value={profile.github}
                            onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">Bio</label>
                        <Textarea
                          placeholder="Tell us about yourself and your goals..."
                          value={profile.bio}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                          rows={3}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Company Name</label>
                        <Input
                          placeholder="Your Company Inc."
                          value={profile.company_name}
                          onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Company Size</label>
                          <Input
                            placeholder="10-50 employees"
                            value={profile.company_size}
                            onChange={(e) => setProfile({ ...profile, company_size: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Industry</label>
                          <Input
                            placeholder="Technology / Finance / etc."
                            value={profile.industry}
                            onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">Website</label>
                        <Input
                          placeholder="https://yourcompany.com"
                          value={profile.website}
                          onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">Phone</label>
                        <Input
                          placeholder="+91 98765 43210"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  <Button
                    onClick={handleProfileSubmit}
                    className="w-full bg-[#0D4ABC] hover:bg-[#0a3d9c]"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue'}
                    {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Aptitude Test (Students Only) */}
          {step === 2 && user.role === 'student' && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#0D4ABC]" />
                    Aptitude Test
                  </CardTitle>
                  <CardDescription>
                    Question {currentQuestion + 1} of {aptitudeQuestions.length}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {aptitudeQuestions[currentQuestion].question}
                    </h3>
                    <div className="space-y-3">
                      {aptitudeQuestions[currentQuestion].options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => setAptitudeAnswers({ ...aptitudeAnswers, [currentQuestion]: idx })}
                          className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                            aptitudeAnswers[currentQuestion] === idx
                              ? 'border-[#0D4ABC] bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    {currentQuestion > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => setCurrentQuestion(currentQuestion - 1)}
                      >
                        <ArrowLeft className="mr-2 w-4 h-4" /> Previous
                      </Button>
                    )}
                    {currentQuestion < aptitudeQuestions.length - 1 ? (
                      <Button
                        onClick={() => setCurrentQuestion(currentQuestion + 1)}
                        className="flex-1 bg-[#0D4ABC] hover:bg-[#0a3d9c]"
                        disabled={aptitudeAnswers[currentQuestion] === undefined}
                      >
                        Next <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleAptitudeSubmit}
                        className="flex-1 bg-[#0D4ABC] hover:bg-[#0a3d9c]"
                        disabled={loading || Object.keys(aptitudeAnswers).length < aptitudeQuestions.length}
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Test'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Payment (Students Only) */}
          {step === 3 && user.role === 'student' && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#0D4ABC]" />
                    Program Payment
                  </CardTitle>
                  <CardDescription>Complete payment to access the LMS</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600">CadetX Data Analytics Program</span>
                      <span className="text-2xl font-bold text-gray-900">₹9,999</span>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        12 weeks of structured learning
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Video tutorials & PDF materials
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Weekly quizzes & assessments
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Placement assistance
                      </li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-yellow-800">
                      <strong>Demo Mode:</strong> Payment is mocked for this demo. Click below to simulate a successful payment.
                    </p>
                  </div>

                  <Button
                    onClick={handlePayment}
                    className="w-full bg-[#9C0005] hover:bg-[#7a0004]"
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Pay ₹9,999'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="text-center">
                <CardContent className="py-12">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">You're All Set!</h2>
                  <p className="text-gray-600 mb-8">
                    Welcome to CadetX! Your learning journey begins now.
                  </p>
                  <Button
                    onClick={() => router.push('/dashboard')}
                    className="bg-[#0D4ABC] hover:bg-[#0a3d9c]"
                  >
                    Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
