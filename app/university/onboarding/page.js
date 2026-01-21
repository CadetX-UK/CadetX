'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  GraduationCap, Building, Globe, Phone, User, MapPin,
  Users, BookOpen, ArrowRight, Loader2, CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

export default function UniversityOnboarding() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    institution_name: '',
    institution_type: 'university',
    accreditation: '',
    location: '',
    website: '',
    phone: '',
    contact_person: '',
    student_count: '',
    programs_offered: '',
    partnership_type: 'starter'
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    if (!userData || !token) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'university') {
      router.push('/login')
      return
    }

    setUser(parsedUser)
    setFormData(prev => ({ ...prev, contact_person: parsedUser.name }))
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/university/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save profile')
      }

      // Update local user
      const updatedUser = { ...user, onboarding_completed: true }
      localStorage.setItem('user', JSON.stringify(updatedUser))

      setSuccess(true)
      setTimeout(() => {
        router.push('/university/dashboard')
      }, 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Card className="text-center max-w-md">
            <CardContent className="py-12">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to CadetX!</h2>
              <p className="text-gray-600">Your university profile has been created. Redirecting to dashboard...</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4">
            <Building className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="text-gray-600 mt-2">Tell us about your institution</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-[#0D4ABC]" />
              Institution Details
            </CardTitle>
            <CardDescription>This information will be used for partnership setup</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Institution Name *</label>
                <Input
                  placeholder="e.g., Delhi University"
                  value={formData.institution_name}
                  onChange={(e) => setFormData({ ...formData, institution_name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Institution Type *</label>
                  <select
                    className="w-full border rounded-md px-3 py-2"
                    value={formData.institution_type}
                    onChange={(e) => setFormData({ ...formData, institution_type: e.target.value })}
                  >
                    <option value="university">University</option>
                    <option value="college">College</option>
                    <option value="institute">Technical Institute</option>
                    <option value="bootcamp">Bootcamp</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Accreditation</label>
                  <Input
                    placeholder="e.g., NAAC A+, AICTE"
                    value={formData.accreditation}
                    onChange={(e) => setFormData({ ...formData, accreditation: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Location *</label>
                  <Input
                    placeholder="City, State"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Website</label>
                  <Input
                    placeholder="https://your-university.edu"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Contact Phone *</label>
                  <Input
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Contact Person *</label>
                  <Input
                    placeholder="Name of primary contact"
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Total Student Count</label>
                  <Input
                    placeholder="e.g., 5000"
                    value={formData.student_count}
                    onChange={(e) => setFormData({ ...formData, student_count: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Programs Offered</label>
                  <Input
                    placeholder="BCA, MCA, B.Tech"
                    value={formData.programs_offered}
                    onChange={(e) => setFormData({ ...formData, programs_offered: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Partnership Tier *</label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  {[
                    { value: 'starter', label: 'Starter', desc: 'Up to 50 students' },
                    { value: 'growth', label: 'Growth', desc: '51-200 students' },
                    { value: 'enterprise', label: 'Enterprise', desc: '200+ students' },
                  ].map((tier) => (
                    <button
                      key={tier.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, partnership_type: tier.value })}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        formData.partnership_type === tier.value
                          ? 'border-[#0D4ABC] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`font-medium ${formData.partnership_type === tier.value ? 'text-[#0D4ABC]' : 'text-gray-900'}`}>
                        {tier.label}
                      </div>
                      <div className="text-xs text-gray-500">{tier.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#0D4ABC] hover:bg-[#0a3d9c] mt-6"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Complete Setup <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
