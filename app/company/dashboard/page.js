'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Building2, Users, Search, Filter, Star, Mail, Linkedin,
  Github, ExternalLink, LogOut, User, Briefcase, Award,
  GraduationCap, ChevronDown, Send, CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CompanyDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [company, setCompany] = useState(null)
  const [talent, setTalent] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [minScore, setMinScore] = useState(0)
  const [selectedTalent, setSelectedTalent] = useState(null)
  const [requestMessage, setRequestMessage] = useState('')
  const [requestSent, setRequestSent] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    if (!userData || !token) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'company') {
      router.push('/login')
      return
    }

    setUser(parsedUser)
    fetchDashboardData(token)
    fetchTalentPool(token)
  }, [router])

  const fetchDashboardData = async (token) => {
    try {
      const res = await fetch('/api/company/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        setCompany(data.company)
        setRequests(data.requests || [])
      }
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTalentPool = async (token) => {
    try {
      const res = await fetch('/api/company/talent', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        setTalent(data.talent || [])
      }
    } catch (error) {
      console.error('Failed to fetch talent:', error)
    }
  }

  const handleRequestCandidate = async () => {
    if (!selectedTalent || !requestMessage.trim()) return

    const token = localStorage.getItem('token')
    try {
      await fetch('/api/company/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          student_id: selectedTalent.id,
          message: requestMessage
        })
      })
      setRequestSent(true)
      setTimeout(() => {
        setSelectedTalent(null)
        setRequestMessage('')
        setRequestSent(false)
        fetchDashboardData(token)
      }, 2000)
    } catch (error) {
      console.error('Failed to send request:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const filteredTalent = talent.filter(t => {
    const matchesSearch = !searchTerm ||
      t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.skills?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesScore = !minScore || (t.quiz_avg_score || 0) >= minScore
    return matchesSearch && matchesScore
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D4ABC]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">

              <span className="text-2xl font-extrabold tracking-tight"><span className="text-[#0D4ABC]">Cadet</span><span className="text-[#9C0005]">X</span></span>
            </Link>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600 font-medium">Company Portal</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
              <Building2 className="w-4 h-4" />
              <span>{company?.company_name || user?.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div >
      </header >

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#0D4ABC] to-[#1976D2] rounded-2xl p-6 md:p-8 text-white mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome, {company?.company_name || user?.name}!</h1>
          <p className="text-white/80">Browse our pre-vetted talent pool and find your next team member</p>
          <div className="flex gap-6 mt-6">
            <div>
              <div className="text-3xl font-bold">{talent.length}</div>
              <div className="text-white/70 text-sm">Available Candidates</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{requests.length}</div>
              <div className="text-white/70 text-sm">Your Requests</div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search by name or skills..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">Min Score:</span>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  className="w-20"
                  value={minScore}
                  onChange={(e) => setMinScore(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Talent Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTalent.length > 0 ? (
            filteredTalent.map((candidate) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0D4ABC] to-[#1976D2] flex items-center justify-center text-white font-bold">
                          {candidate.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                          <p className="text-sm text-gray-500">{candidate.education || 'Data Professional'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium text-yellow-700">
                          {candidate.quiz_avg_score || '-'}
                        </span>
                      </div>
                    </div>

                    {candidate.bio && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{candidate.bio}</p>
                    )}

                    <div className="space-y-2 mb-4">
                      {candidate.skills && (
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.split(',').slice(0, 4).map((skill, idx) => (
                            <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Experience:</span> {candidate.experience || 'Fresher'}
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Aptitude:</span> {candidate.aptitude_score || '-'}/100
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      {candidate.linkedin && (
                        <a href={candidate.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                          <Linkedin className="w-4 h-4 text-[#0077b5]" />
                        </a>
                      )}
                      {candidate.github && (
                        <a href={candidate.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                          <Github className="w-4 h-4 text-gray-700" />
                        </a>
                      )}
                      {candidate.portfolio_links?.length > 0 && (
                        <a href={candidate.portfolio_links[0]} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                          <ExternalLink className="w-4 h-4 text-gray-600" />
                        </a>
                      )}
                    </div>

                    <Button
                      className="w-full bg-[#0D4ABC] hover:bg-[#0a3d9c]"
                      onClick={() => setSelectedTalent(candidate)}
                    >
                      <Send className="w-4 h-4 mr-2" /> Request Candidate
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full">
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No candidates found matching your criteria</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Request Modal */}
      {
        selectedTalent && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => !requestSent && setSelectedTalent(null)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {requestSent ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Request Sent!</h3>
                  <p className="text-gray-500 mt-2">We'll notify you when there's a response.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Request {selectedTalent.name}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Send a message to express your interest in this candidate.
                  </p>
                  <Textarea
                    placeholder="Hi, we're interested in your profile for a Data Analyst role..."
                    rows={4}
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    className="mb-4"
                  />
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setSelectedTalent(null)}>
                      Cancel
                    </Button>
                    <Button className="flex-1 bg-[#0D4ABC]" onClick={handleRequestCandidate} disabled={!requestMessage.trim()}>
                      <Send className="w-4 h-4 mr-2" /> Send Request
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )
      }
    </div >
  )
}
