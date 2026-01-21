'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Shield, Users, BookOpen, Award, LogOut, User, Mail,
  CheckCircle, XCircle, Lock, Unlock, Star, ChevronDown,
  ChevronUp, Plus, FileText, Play, Trash2, Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [students, setStudents] = useState([])
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedStudent, setExpandedStudent] = useState(null)
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    description: '',
    content_url: '',
    content_type: 'video',
    week_number: 1,
    order: 1
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    if (!userData || !token) {
      router.push('/admin')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'admin') {
      router.push('/admin')
      return
    }

    setUser(parsedUser)
    fetchStudents(token)
    fetchMaterials(token)
  }, [router])

  const fetchStudents = async (token) => {
    try {
      const res = await fetch('/api/admin/students', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        setStudents(data.students || [])
      }
    } catch (error) {
      console.error('Failed to fetch students:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMaterials = async (token) => {
    try {
      const res = await fetch('/api/admin/materials', {
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

  const handleUnlockWeek = async (studentId, weekNumber) => {
    const token = localStorage.getItem('token')
    try {
      await fetch('/api/admin/unlock', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ student_id: studentId, week_number: weekNumber })
      })
      fetchStudents(token)
    } catch (error) {
      console.error('Failed to unlock week:', error)
    }
  }

  const handlePromote = async (studentId, isVetted) => {
    const token = localStorage.getItem('token')
    try {
      await fetch('/api/admin/promote', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ student_id: studentId, is_vetted: isVetted })
      })
      fetchStudents(token)
    } catch (error) {
      console.error('Failed to promote student:', error)
    }
  }

  const handleAddMaterial = async () => {
    const token = localStorage.getItem('token')
    try {
      await fetch('/api/admin/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newMaterial)
      })
      setNewMaterial({
        title: '',
        description: '',
        content_url: '',
        content_type: 'video',
        week_number: 1,
        order: 1
      })
      fetchMaterials(token)
    } catch (error) {
      console.error('Failed to add material:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/admin')
  }

  const getStatusBadge = (status) => {
    const badges = {
      'onboarding': 'bg-yellow-100 text-yellow-800',
      'aptitude_completed': 'bg-blue-100 text-blue-800',
      'enrolled': 'bg-green-100 text-green-800',
      'talent_pool': 'bg-purple-100 text-purple-800'
    }
    return badges[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#9C0005] flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">CadetX Admin</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Admin: {user?.email}</span>
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-900 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{students.length}</div>
                <div className="text-sm text-gray-400">Total Students</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-900 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {students.filter(s => s.payment_verified).length}
                </div>
                <div className="text-sm text-gray-400">Paid Students</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-900 flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {students.filter(s => s.is_vetted).length}
                </div>
                <div className="text-sm text-gray-400">In Talent Pool</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-900 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{materials.length}</div>
                <div className="text-sm text-gray-400">Materials</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="students" className="data-[state=active]:bg-gray-700">Students</TabsTrigger>
            <TabsTrigger value="materials" className="data-[state=active]:bg-gray-700">Materials</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Student Management</CardTitle>
                <CardDescription className="text-gray-400">Manage student progress and access</CardDescription>
              </CardHeader>
              <CardContent>
                {students.length > 0 ? (
                  <div className="space-y-4">
                    {students.map((student) => (
                      <div key={student.id} className="bg-gray-700/50 rounded-lg overflow-hidden">
                        <div
                          className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-700/70"
                          onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-300" />
                            </div>
                            <div>
                              <div className="font-medium text-white">{student.user?.name || 'Unknown'}</div>
                              <div className="text-sm text-gray-400">{student.user?.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(student.status)}`}>
                              {student.status?.replace('_', ' ')}
                            </span>
                            {student.is_vetted && (
                              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            )}
                            {expandedStudent === student.id ? (
                              <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </div>

                        {expandedStudent === student.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            className="border-t border-gray-600 p-4"
                          >
                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-3">
                                <div className="text-sm">
                                  <span className="text-gray-400">Aptitude Score:</span>
                                  <span className="text-white ml-2 font-medium">{student.aptitude_score || '-'}</span>
                                </div>
                                <div className="text-sm">
                                  <span className="text-gray-400">Quiz Avg:</span>
                                  <span className="text-white ml-2 font-medium">{student.quiz_avg_score || '-'}</span>
                                </div>
                                <div className="text-sm">
                                  <span className="text-gray-400">Quizzes Taken:</span>
                                  <span className="text-white ml-2 font-medium">{student.quiz_count}</span>
                                </div>
                                <div className="text-sm">
                                  <span className="text-gray-400">Current Week:</span>
                                  <span className="text-white ml-2 font-medium">{student.current_week || 0}</span>
                                </div>
                                <div className="text-sm">
                                  <span className="text-gray-400">Payment:</span>
                                  <span className={`ml-2 font-medium ${student.payment_verified ? 'text-green-400' : 'text-red-400'}`}>
                                    {student.payment_verified ? 'Verified' : 'Pending'}
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <div className="text-sm text-gray-400 mb-2">Actions:</div>
                                <div className="flex flex-wrap gap-2">
                                  {[1, 2, 3, 4].map((week) => (
                                    <Button
                                      key={week}
                                      size="sm"
                                      variant={student.current_week >= week ? 'default' : 'outline'}
                                      className={student.current_week >= week ? 'bg-green-600' : ''}
                                      onClick={() => handleUnlockWeek(student.user_id, week)}
                                    >
                                      {student.current_week >= week ? <Unlock className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                                      Week {week}
                                    </Button>
                                  ))}
                                </div>
                                <div className="pt-2">
                                  <Button
                                    size="sm"
                                    className={student.is_vetted ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-purple-600 hover:bg-purple-700'}
                                    onClick={() => handlePromote(student.user_id, !student.is_vetted)}
                                  >
                                    <Star className="w-4 h-4 mr-2" />
                                    {student.is_vetted ? 'Remove from Talent Pool' : 'Add to Talent Pool'}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No students registered yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materials">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Add Material Form */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Add New Material</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Title"
                    className="bg-gray-700 border-gray-600 text-white"
                    value={newMaterial.title}
                    onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                  />
                  <Input
                    placeholder="Description"
                    className="bg-gray-700 border-gray-600 text-white"
                    value={newMaterial.description}
                    onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                  />
                  <Input
                    placeholder="Content URL (video embed or PDF link)"
                    className="bg-gray-700 border-gray-600 text-white"
                    value={newMaterial.content_url}
                    onChange={(e) => setNewMaterial({ ...newMaterial, content_url: e.target.value })}
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <select
                      className="bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
                      value={newMaterial.content_type}
                      onChange={(e) => setNewMaterial({ ...newMaterial, content_type: e.target.value })}
                    >
                      <option value="video">Video</option>
                      <option value="pdf">PDF</option>
                    </select>
                    <Input
                      type="number"
                      placeholder="Week"
                      min={1}
                      className="bg-gray-700 border-gray-600 text-white"
                      value={newMaterial.week_number}
                      onChange={(e) => setNewMaterial({ ...newMaterial, week_number: parseInt(e.target.value) })}
                    />
                    <Input
                      type="number"
                      placeholder="Order"
                      min={1}
                      className="bg-gray-700 border-gray-600 text-white"
                      value={newMaterial.order}
                      onChange={(e) => setNewMaterial({ ...newMaterial, order: parseInt(e.target.value) })}
                    />
                  </div>
                  <Button onClick={handleAddMaterial} className="w-full bg-[#0D4ABC]">
                    <Plus className="w-4 h-4 mr-2" /> Add Material
                  </Button>
                </CardContent>
              </Card>

              {/* Materials List */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">All Materials ({materials.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {materials.length > 0 ? (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                      {materials.map((material) => (
                        <div key={material.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {material.content_type === 'video' ? (
                              <Play className="w-5 h-5 text-red-400" />
                            ) : (
                              <FileText className="w-5 h-5 text-blue-400" />
                            )}
                            <div>
                              <div className="text-white text-sm font-medium">{material.title}</div>
                              <div className="text-gray-400 text-xs">Week {material.week_number}</div>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">#{material.order}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No materials added yet</p>
                    </div>
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
