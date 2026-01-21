'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Building, Users, Award, TrendingUp, LogOut, User, Mail,
  Plus, X, Search, Download, BarChart3, CheckCircle, Clock,
  GraduationCap, Copy, RefreshCw, Eye, Filter, ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function UniversityDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [university, setUniversity] = useState(null)
  const [stats, setStats] = useState(null)
  const [students, setStudents] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [addEmailsInput, setAddEmailsInput] = useState('')
  const [addResults, setAddResults] = useState(null)
  const [inviteCodes, setInviteCodes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

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
    fetchDashboardData(token)
    fetchAnalytics(token)
  }, [router])

  const fetchDashboardData = async (token) => {
    try {
      const res = await fetch('/api/university/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        setUniversity(data.university)
        setStats(data.stats)
        setStudents(data.students || [])
      }
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async (token) => {
    try {
      const res = await fetch('/api/university/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        setAnalytics(data.analytics)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    }
  }

  const handleAddStudents = async () => {
    if (!addEmailsInput.trim()) return

    const token = localStorage.getItem('token')
    const emails = addEmailsInput.split(/[,\n]/).map(e => e.trim()).filter(e => e)

    try {
      const res = await fetch('/api/university/students/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ emails })
      })
      const data = await res.json()
      if (res.ok) {
        setAddResults(data.results)
        setAddEmailsInput('')
        fetchDashboardData(token)
      }
    } catch (error) {
      console.error('Failed to add students:', error)
    }
  }

  const handleRemoveStudent = async (studentId) => {
    const token = localStorage.getItem('token')
    try {
      await fetch('/api/university/students/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ student_id: studentId })
      })
      fetchDashboardData(token)
    } catch (error) {
      console.error('Failed to remove student:', error)
    }
  }

  const handleGenerateInviteCodes = async (count = 10) => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('/api/university/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ count })
      })
      const data = await res.json()
      if (res.ok) {
        setInviteCodes(data.codes)
      }
    } catch (error) {
      console.error('Failed to generate codes:', error)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const getStatusBadge = (status) => {
    const badges = {
      'onboarding': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Onboarding' },
      'enrolled': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Enrolled' },
      'talent_pool': { bg: 'bg-green-100', text: 'text-green-800', label: 'Talent Pool' },
      'pending': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Pending' }
    }
    return badges[status] || badges['pending']
  }

  const filteredStudents = students.filter(s => {
    const matchesSearch = !searchTerm || 
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D4ABC]"></div>
      </div>
    )
  }

  // Show onboarding if university profile not complete
  if (!university) {
    router.push('/university/onboarding')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-[#0D4ABC]">CadetX</span>
            </Link>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600 font-medium">University Portal</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
              <Building className="w-4 h-4" />
              <span>{university?.institution_name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#0D4ABC] to-[#1976D2] rounded-2xl p-6 md:p-8 text-white mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome, {university?.institution_name}!</h1>
              <p className="text-white/80">Track your students' progress and manage enrollments</p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                university?.partnership_status === 'active' 
                  ? 'bg-green-500/20 text-green-100' 
                  : 'bg-yellow-500/20 text-yellow-100'
              }`}>
                Partnership: {university?.partnership_status || 'Pending'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#0D4ABC]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats?.total_students || 0}</div>
                <div className="text-sm text-gray-500">Total Students</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats?.active_students || 0}</div>
                <div className="text-sm text-gray-500">Active (Paid)</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats?.placed_students || 0}</div>
                <div className="text-sm text-gray-500">In Talent Pool</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats?.completion_rate || 0}%</div>
                <div className="text-sm text-gray-500">Completion Rate</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="students">
          <TabsList className="mb-6">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="invite">Invite Students</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Enrolled Students</CardTitle>
                    <CardDescription>Manage and track your students</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search students..."
                        className="pl-9 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <select
                      className="border rounded-md px-3 py-2 text-sm"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="onboarding">Onboarding</option>
                      <option value="enrolled">Enrolled</option>
                      <option value="talent_pool">Talent Pool</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredStudents.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Student</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Week</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Aptitude</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Quiz Avg</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((student) => {
                          const statusBadge = getStatusBadge(student.status)
                          return (
                            <tr key={student.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-[#0D4ABC] text-white flex items-center justify-center text-sm font-medium">
                                    {student.name?.charAt(0) || '?'}
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">{student.name}</div>
                                    <div className="text-sm text-gray-500">{student.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                                  {statusBadge.label}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{student.current_week || 0}/4</span>
                                  <Progress value={(student.current_week || 0) * 25} className="w-16 h-2" />
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`font-medium ${
                                  student.aptitude_score >= 80 ? 'text-green-600' :
                                  student.aptitude_score >= 60 ? 'text-yellow-600' : 'text-gray-600'
                                }`}>
                                  {student.aptitude_score || '-'}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`font-medium ${
                                  student.quiz_avg_score >= 80 ? 'text-green-600' :
                                  student.quiz_avg_score >= 60 ? 'text-yellow-600' : 'text-gray-600'
                                }`}>
                                  {student.quiz_avg_score || '-'}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleRemoveStudent(student.id)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No students enrolled yet</p>
                    <p className="text-sm text-gray-400 mt-1">Use the Invite Students tab to add students</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invite">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Add by Email */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" /> Add by Email
                  </CardTitle>
                  <CardDescription>Add existing CadetX students to your institution</CardDescription>
                </CardHeader>
                <CardContent>
                  <textarea
                    className="w-full border rounded-lg p-3 text-sm h-32 mb-4"
                    placeholder="Enter student emails (comma or newline separated)&#10;e.g., student1@email.com, student2@email.com"
                    value={addEmailsInput}
                    onChange={(e) => setAddEmailsInput(e.target.value)}
                  />
                  <Button onClick={handleAddStudents} className="w-full bg-[#0D4ABC]">
                    <Plus className="w-4 h-4 mr-2" /> Add Students
                  </Button>

                  {addResults && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm">
                      {addResults.added.length > 0 && (
                        <div className="text-green-600 mb-2">
                          ✓ Added: {addResults.added.join(', ')}
                        </div>
                      )}
                      {addResults.not_found.length > 0 && (
                        <div className="text-red-600 mb-2">
                          ✗ Not found: {addResults.not_found.join(', ')}
                        </div>
                      )}
                      {addResults.already_enrolled.length > 0 && (
                        <div className="text-yellow-600">
                          ⚠ Already enrolled: {addResults.already_enrolled.join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Generate Invite Codes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" /> Generate Invite Codes
                  </CardTitle>
                  <CardDescription>Create codes for new students to register under your institution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <Button onClick={() => handleGenerateInviteCodes(10)} variant="outline">
                      Generate 10 Codes
                    </Button>
                    <Button onClick={() => handleGenerateInviteCodes(25)} variant="outline">
                      Generate 25 Codes
                    </Button>
                  </div>

                  {inviteCodes.length > 0 && (
                    <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium">Generated Codes</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(inviteCodes.join('\n'))}
                        >
                          <Copy className="w-4 h-4 mr-1" /> Copy All
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {inviteCodes.map((code, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                            <code className="text-sm font-mono">{code}</code>
                            <button
                              onClick={() => copyToClipboard(code)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
                    <strong>How it works:</strong> Share these codes with students. They can enter the code during registration to be automatically enrolled under your institution.
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Progress Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Progress Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics ? (
                    <div className="space-y-4">
                      {[
                        { label: 'Week 1', value: analytics.weeklyProgress?.week1 || 0, color: 'bg-gray-400' },
                        { label: 'Week 2', value: analytics.weeklyProgress?.week2 || 0, color: 'bg-blue-400' },
                        { label: 'Week 3', value: analytics.weeklyProgress?.week3 || 0, color: 'bg-blue-500' },
                        { label: 'Week 4', value: analytics.weeklyProgress?.week4 || 0, color: 'bg-blue-600' },
                        { label: 'Completed', value: analytics.weeklyProgress?.completed || 0, color: 'bg-green-500' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <span className="w-24 text-sm text-gray-600">{item.label}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                            <div
                              className={`h-full ${item.color} transition-all`}
                              style={{ width: `${analytics.totalEnrolled > 0 ? (item.value / analytics.totalEnrolled) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="w-8 text-sm font-medium">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">No data available</div>
                  )}
                </CardContent>
              </Card>

              {/* Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics ? (
                    <div className="space-y-4">
                      {[
                        { label: 'Onboarding', value: analytics.statusDistribution?.onboarding || 0, color: 'bg-yellow-400' },
                        { label: 'Enrolled', value: analytics.statusDistribution?.enrolled || 0, color: 'bg-blue-500' },
                        { label: 'Talent Pool', value: analytics.statusDistribution?.talent_pool || 0, color: 'bg-green-500' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <span className="w-24 text-sm text-gray-600">{item.label}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                            <div
                              className={`h-full ${item.color} transition-all`}
                              style={{ width: `${analytics.totalEnrolled > 0 ? (item.value / analytics.totalEnrolled) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="w-8 text-sm font-medium">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">No data available</div>
                  )}
                </CardContent>
              </Card>

              {/* Score Distribution */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Performance Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics ? (
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { label: 'Excellent (90+)', value: analytics.scoreRanges?.excellent || 0, color: 'bg-green-500' },
                        { label: 'Good (75-89)', value: analytics.scoreRanges?.good || 0, color: 'bg-blue-500' },
                        { label: 'Average (60-74)', value: analytics.scoreRanges?.average || 0, color: 'bg-yellow-500' },
                        { label: 'Needs Work (<60)', value: analytics.scoreRanges?.needsWork || 0, color: 'bg-red-500' },
                      ].map((item, idx) => (
                        <div key={idx} className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className={`w-16 h-16 rounded-full ${item.color} flex items-center justify-center text-white text-2xl font-bold mx-auto mb-2`}>
                            {item.value}
                          </div>
                          <div className="text-sm text-gray-600">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">No data available</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
