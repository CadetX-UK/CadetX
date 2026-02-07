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
  const [companies, setCompanies] = useState([])
  const [universities, setUniversities] = useState([])
  const [materials, setMaterials] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedStudent, setExpandedStudent] = useState(null)
  const [courses, setCourses] = useState([])
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    level: 'Beginner'
  })
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
    fetchCourses(token)
    fetchCompanies(token)
    fetchUniversities(token)
  }, [router])

  const fetchCompanies = async (token) => {
    try {
      const res = await fetch('/api/admin/companies', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        setCompanies(data.companies || [])
      }
    } catch (error) {
      console.error('Failed to fetch companies:', error)
    }
  }

  const fetchUniversities = async (token) => {
    try {
      const res = await fetch('/api/admin/universities', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        setUniversities(data.universities || [])
      }
    } catch (error) {
      console.error('Failed to fetch universities:', error)
    }
  }

  const fetchCourses = async (token) => {
    try {
      const res = await fetch('/api/admin/courses', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        setCourses(data.courses || [])
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    }
  }

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

  const handleGrantAccess = async (studentId, accessGranted) => {
    const token = localStorage.getItem('token')
    try {
      await fetch('/api/admin/access', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ student_id: studentId, access_granted: accessGranted })
      })
      fetchStudents(token)
    } catch (error) {
      console.error('Failed to grant access:', error)
    }
  }

  const handleApprove = async (userId, isApproved) => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('/api/admin/approve', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ user_id: userId, is_approved: isApproved })
      })
      if (res.ok) {
        fetchStudents(token)
      }
    } catch (error) {
      console.error('Failed to approve user:', error)
    }
  }

  const handleAddCourse = async () => {
    const token = localStorage.getItem('token')
    try {
      await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newCourse,
          price: parseFloat(newCourse.price)
        })
      })
      setNewCourse({
        title: '',
        description: '',
        price: '',
        duration: '',
        level: 'Beginner'
      })
      fetchCourses(token)
    } catch (error) {
      console.error('Failed to add course:', error)
    }
  }

  const handleDeleteCourse = async (id) => {
    const token = localStorage.getItem('token')
    if (!confirm('Are you sure? This will delete the course.')) return
    try {
      await fetch(`/api/admin/courses?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      fetchCourses(token)
    } catch (error) {
      console.error('Failed to delete course:', error)
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
            <span className="text-xl font-bold"><span className="text-white">Cadet</span><span className="text-[#9C0005]">X</span><span className="text-white"> Admin</span></span>
          </div >

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">Admin: {user?.email}</span>
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div >
      </header >

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
                <Shield className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {students.filter(s => !s.user?.isApproved).length}
                </div>
                <div className="text-sm text-gray-400">Pending Approval</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="students" className="data-[state=active]:bg-gray-700">Students</TabsTrigger>
            <TabsTrigger value="companies" className="data-[state=active]:bg-gray-700">Companies</TabsTrigger>
            <TabsTrigger value="universities" className="data-[state=active]:bg-gray-700">Universities</TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-gray-700">Courses</TabsTrigger>
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
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${student.user?.isApproved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {student.user?.isApproved ? 'Approved' : 'Pending'}
                            </span>
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
                                  <Button
                                    size="sm"
                                    className={`ml-2 ${student.user?.isApproved ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'}`}
                                    onClick={() => handleApprove(student.userId, !student.user?.isApproved)}
                                  >
                                    {student.user?.isApproved ? <XCircle className="w-4 h-4 mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                                    {student.user?.isApproved ? 'Deactivate Account' : 'Approve & Activate'}
                                  </Button>
                                  <Button
                                    size="sm"
                                    className={`ml-2 ${student.accessGranted ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                                    onClick={() => handleGrantAccess(student.userId, !student.accessGranted)}
                                  >
                                    {student.accessGranted ? <Lock className="w-4 h-4 mr-2" /> : <Unlock className="w-4 h-4 mr-2" />}
                                    {student.accessGranted ? 'Revoke Access' : 'Grant Access'}
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

          <TabsContent value="companies">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Company Management</CardTitle>
                <CardDescription className="text-gray-400">Review and approve company registrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {companies.map((company) => (
                    <div key={company.id} className="bg-gray-700/50 p-4 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-900 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-blue-300" />
                        </div>
                        <div>
                          <div className="font-medium text-white">{company.companyName}</div>
                          <div className="text-sm text-gray-400">{company.user?.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${company.user?.isApproved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {company.user?.isApproved ? 'Approved' : 'Pending Approval'}
                        </span>
                        <Button
                          size="sm"
                          className={company.user?.isApproved ? 'bg-orange-600' : 'bg-green-600'}
                          onClick={() => handleApprove(company.userId, !company.user?.isApproved)}
                        >
                          {company.user?.isApproved ? 'Deactivate' : 'Approve'}
                        </Button>
                      </div>
                    </div>
                  ))}
                  {companies.length === 0 && <p className="text-center text-gray-400 py-4">No companies yet</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="universities">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">University Management</CardTitle>
                <CardDescription className="text-gray-400">Review and approve university partners</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {universities.map((uni) => (
                    <div key={uni.id} className="bg-gray-700/50 p-4 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-red-900 flex items-center justify-center">
                          <Building className="w-5 h-5 text-red-300" />
                        </div>
                        <div>
                          <div className="font-medium text-white">{uni.universityName}</div>
                          <div className="text-sm text-gray-400">{uni.user?.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${uni.user?.isApproved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {uni.user?.isApproved ? 'Approved' : 'Pending Approval'}
                        </span>
                        <Button
                          size="sm"
                          className={uni.user?.isApproved ? 'bg-orange-600' : 'bg-green-600'}
                          onClick={() => handleApprove(uni.userId, !uni.user?.isApproved)}
                        >
                          {uni.user?.isApproved ? 'Deactivate' : 'Approve'}
                        </Button>
                      </div>
                    </div>
                  ))}
                  {universities.length === 0 && <p className="text-center text-gray-400 py-4">No universities yet</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Add New Course</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Course Title"
                    className="bg-gray-700 border-gray-600 text-white"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  />
                  <Input
                    placeholder="Description"
                    className="bg-gray-700 border-gray-600 text-white"
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      placeholder="Price"
                      className="bg-gray-700 border-gray-600 text-white"
                      value={newCourse.price}
                      onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                    />
                    <Input
                      placeholder="Duration (e.g. 12 weeks)"
                      className="bg-gray-700 border-gray-600 text-white"
                      value={newCourse.duration}
                      onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                    />
                  </div>
                  <select
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
                    value={newCourse.level}
                    onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <Button onClick={handleAddCourse} className="w-full bg-[#0D4ABC]">
                    <Plus className="w-4 h-4 mr-2" /> Add Course
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Existing Courses</CardTitle>
                </CardHeader>
                <CardContent>
                  {courses.length > 0 ? (
                    <div className="space-y-3">
                      {courses.map((course) => (
                        <div key={course.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                          <div>
                            <div className="text-white font-medium">{course.title}</div>
                            <div className="text-sm text-gray-400">
                              {course.level} • {course.duration} • ₹{course.price}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {course._count?.students || 0} students enrolled
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            onClick={() => handleDeleteCourse(course.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">No courses added yet</div>
                  )}
                </CardContent>
              </Card>
            </div>
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
    </div >
  )
}
