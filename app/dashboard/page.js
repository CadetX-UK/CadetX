'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap, BookOpen, Play, FileText, Lock, CheckCircle,
  Award, BarChart3, User, LogOut, ChevronRight, Clock, Target,
  Briefcase, Link as LinkIcon, Plus, X, ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function StudentDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [studentData, setStudentData] = useState(null)
  const [materials, setMaterials] = useState([])
  const [currentWeek, setCurrentWeek] = useState(1)
  const [progress, setProgress] = useState({ completed: 0, total: 0, percentage: 0 })
  const [quizzes, setQuizzes] = useState([])
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [portfolioLinks, setPortfolioLinks] = useState([])
  const [newLink, setNewLink] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('materials')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    if (!userData || !token) {
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'student') {
      router.push('/login')
      return
    }

    setUser(parsedUser)
    fetchDashboardData(token)
    fetchMaterials(token)
  }, [router])

  const fetchDashboardData = async (token) => {
    try {
      const res = await fetch('/api/student/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()

      if (res.ok) {
        setStudentData(data.student)
        setProgress(data.progress)
        setQuizzes(data.quizzes || [])
        setCurrentWeek(data.student?.current_week || 1)
        setPortfolioLinks(data.student?.portfolio_links || [])
      }
    } catch (error) {
      console.error('Failed to fetch dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMaterials = async (token) => {
    try {
      const res = await fetch('/api/student/materials', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()

      if (res.ok) {
        setMaterials(data.materials || [])
      }
    } catch (error) {
      console.error('Failed to fetch materials:', error)
    }
  }

  const handleCompleteMaterial = async (materialId) => {
    const token = localStorage.getItem('token')
    try {
      await fetch('/api/student/materials/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ material_id: materialId })
      })
      fetchMaterials(token)
      fetchDashboardData(token)
    } catch (error) {
      console.error('Failed to mark complete:', error)
    }
  }

  const handleAddPortfolioLink = async () => {
    if (!newLink.trim()) return

    const token = localStorage.getItem('token')
    const updatedLinks = [...portfolioLinks, newLink.trim()]

    try {
      await fetch('/api/student/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ portfolio_links: updatedLinks })
      })
      setPortfolioLinks(updatedLinks)
      setNewLink('')
    } catch (error) {
      console.error('Failed to update portfolio:', error)
    }
  }

  const handleRemovePortfolioLink = async (index) => {
    const token = localStorage.getItem('token')
    const updatedLinks = portfolioLinks.filter((_, i) => i !== index)

    try {
      await fetch('/api/student/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ portfolio_links: updatedLinks })
      })
      setPortfolioLinks(updatedLinks)
    } catch (error) {
      console.error('Failed to update portfolio:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  // Group materials by week
  const materialsByWeek = materials.reduce((acc, m) => {
    if (!acc[m.week_number]) acc[m.week_number] = []
    acc[m.week_number].push(m)
    return acc
  }, {})

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
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-[#0D4ABC]">CadetX</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{user?.name}</span>
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
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-white/80 mb-4">Continue your learning journey</p>
          <div className="flex flex-wrap gap-6">
            <div>
              <div className="text-3xl font-bold">{progress.percentage}%</div>
              <div className="text-white/70 text-sm">Course Progress</div>
            </div>
            <div>
              <div className="text-3xl font-bold">Week {currentWeek}</div>
              <div className="text-white/70 text-sm">Current Week</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{quizzes.length}</div>
              <div className="text-white/70 text-sm">Quizzes Completed</div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-[#0D4ABC]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{progress.completed}</div>
                <div className="text-sm text-gray-500">Lessons Done</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{studentData?.aptitude_score || '-'}</div>
                <div className="text-sm text-gray-500">Aptitude Score</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {quizzes.length > 0 ? Math.round(quizzes.reduce((a, q) => a + q.score, 0) / quizzes.length) : '-'}
                </div>
                <div className="text-sm text-gray-500">Avg Quiz Score</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {studentData?.is_vetted ? 'Yes' : 'No'}
                </div>
                <div className="text-sm text-gray-500">In Talent Pool</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="materials">Learning Materials</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          </TabsList>

          <TabsContent value="materials">
            <div className="space-y-6">
              {Object.entries(materialsByWeek).map(([week, weekMaterials]) => {
                const isLocked = parseInt(week) > currentWeek
                return (
                  <Card key={week} className={isLocked ? 'opacity-60' : ''}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          {isLocked ? (
                            <Lock className="w-5 h-5 text-gray-400" />
                          ) : (
                            <BookOpen className="w-5 h-5 text-[#0D4ABC]" />
                          )}
                          Week {week}
                        </CardTitle>
                        {isLocked && (
                          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            Locked
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {weekMaterials.map((material) => (
                          <div
                            key={material.id}
                            className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                              material.is_unlocked
                                ? 'hover:bg-gray-50 cursor-pointer border-gray-200'
                                : 'bg-gray-50 border-gray-100'
                            }`}
                            onClick={() => material.is_unlocked && setSelectedMaterial(material)}
                          >
                            <div className="flex items-center gap-3">
                              {material.content_type === 'video' ? (
                                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                                  <Play className="w-5 h-5 text-red-600" />
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-[#0D4ABC]" />
                                </div>
                              )}
                              <div>
                                <div className="font-medium text-gray-900">{material.title}</div>
                                <div className="text-sm text-gray-500">{material.content_type === 'video' ? 'Video' : 'Document'}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {material.is_completed && (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              )}
                              {!material.is_unlocked && (
                                <Lock className="w-5 h-5 text-gray-400" />
                              )}
                              {material.is_unlocked && !material.is_completed && (
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

              {Object.keys(materialsByWeek).length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No materials available yet. Check back soon!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="quizzes">
            <Card>
              <CardHeader>
                <CardTitle>Quiz History</CardTitle>
                <CardDescription>Your completed quizzes and scores</CardDescription>
              </CardHeader>
              <CardContent>
                {quizzes.length > 0 ? (
                  <div className="space-y-4">
                    {quizzes.map((quiz, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#0D4ABC] text-white flex items-center justify-center font-bold">
                            W{quiz.week_number}
                          </div>
                          <div>
                            <div className="font-medium">Week {quiz.week_number} Quiz</div>
                            <div className="text-sm text-gray-500">
                              {new Date(quiz.submitted_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${
                            quiz.score >= 80 ? 'text-green-600' :
                            quiz.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {quiz.score}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No quizzes completed yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Links</CardTitle>
                <CardDescription>Add links to your projects and work</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-6">
                  <Input
                    placeholder="https://github.com/yourusername/project"
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                  />
                  <Button onClick={handleAddPortfolioLink} className="bg-[#0D4ABC]">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {portfolioLinks.length > 0 ? (
                  <div className="space-y-3">
                    {portfolioLinks.map((link, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <LinkIcon className="w-4 h-4 text-gray-400" />
                          <a href={link} target="_blank" rel="noopener noreferrer" className="text-[#0D4ABC] hover:underline truncate max-w-md">
                            {link}
                          </a>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleRemovePortfolioLink(idx)}>
                          <X className="w-4 h-4 text-gray-400" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <LinkIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No portfolio links added yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Material Modal */}
      <AnimatePresence>
        {selectedMaterial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMaterial(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{selectedMaterial.title}</h2>
                  <p className="text-sm text-gray-500">{selectedMaterial.description}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedMaterial(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-4">
                {selectedMaterial.content_type === 'video' ? (
                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                    <iframe
                      src={selectedMaterial.content_url}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="h-[60vh]">
                    <iframe
                      src={selectedMaterial.content_url}
                      className="w-full h-full rounded-lg border"
                    />
                  </div>
                )}
              </div>

              <div className="p-4 border-t flex justify-between">
                <Button variant="outline" asChild>
                  <a href={selectedMaterial.content_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" /> Open in New Tab
                  </a>
                </Button>
                {!selectedMaterial.is_completed && (
                  <Button
                    onClick={() => {
                      handleCompleteMaterial(selectedMaterial.id)
                      setSelectedMaterial(null)
                    }}
                    className="bg-[#0D4ABC]"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" /> Mark as Complete
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
