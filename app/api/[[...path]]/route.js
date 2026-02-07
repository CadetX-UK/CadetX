import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'cadetx-super-secret-key-2025'

// Rate limiting (in-memory)
const rateLimitMap = new Map()
const RATE_LIMIT_WINDOW = 60000
const MAX_REQUESTS = 100

function checkRateLimit(ip) {
  const now = Date.now()
  const windowStart = now - RATE_LIMIT_WINDOW
  if (!rateLimitMap.has(ip)) rateLimitMap.set(ip, [])
  const requests = rateLimitMap.get(ip).filter(time => time > windowStart)
  requests.push(now)
  rateLimitMap.set(ip, requests)
  return requests.length <= MAX_REQUESTS
}

function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

function verifyToken(request) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  const token = authHeader.substring(7)
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePassword(password) {
  return password && password.length >= 6
}

export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

async function handleRoute(request, context) {
  try {
    const params = await context?.params // Handle Next.js 15 promise params if needed
    const path = params?.path || []

    // Fallback to URL parsing if params are missing
    let route = `/${path.join('/')}`
    if (route === '/' || route === '') {
      const url = new URL(request.url)
      route = url.pathname.replace(/^\/api/, '')
    }

    const method = request.method
    const ip = request.headers.get('x-forwarded-for') || 'unknown'

    if (!checkRateLimit(ip)) {
      return handleCORS(NextResponse.json({ error: 'Too many requests' }, { status: 429 }))
    }

    // =====================
    // PUBLIC ROUTES
    // =====================

    if ((route === '/' || route === '/root') && method === 'GET') {
      return handleCORS(NextResponse.json({
        message: 'CadetX API v2.0 (Prisma + TiDB)',
        status: 'healthy',
        timestamp: new Date().toISOString()
      }))
    }

    if (route === '/health' && method === 'GET') {
      return handleCORS(NextResponse.json({ status: 'ok', database: 'tidb' }))
    }

    // =====================
    // AUTH ROUTES

    if (route === '/auth/register' && method === 'POST') {
      const body = await request.json()
      const { email, password, name, role = 'student' } = body

      if (!email || !validateEmail(email)) {
        return handleCORS(NextResponse.json({ error: 'Valid email is required' }, { status: 400 }))
      }
      if (!validatePassword(password)) {
        return handleCORS(NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 }))
      }
      if (!name || name.trim().length < 2) {
        return handleCORS(NextResponse.json({ error: 'Name is required (at least 2 characters)' }, { status: 400 }))
      }
      if (!['student', 'company', 'university'].includes(role)) {
        return handleCORS(NextResponse.json({ error: 'Role must be student, company, or university' }, { status: 400 }))
      }

      const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
      if (existingUser) {
        return handleCORS(NextResponse.json({ error: 'Email already registered' }, { status: 400 }))
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          name: name.trim(),
          role,
          onboardingCompleted: false,
          paymentVerified: false
        }
      })

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
      const { password: _, ...userWithoutPassword } = user

      return handleCORS(NextResponse.json({ user: userWithoutPassword, token }))
    }

    if (route === '/auth/login' && method === 'POST') {
      const body = await request.json()
      const { email, password } = body

      if (!email || !password) {
        return handleCORS(NextResponse.json({ error: 'Email and password are required' }, { status: 400 }))
      }

      const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
      if (!user) {
        return handleCORS(NextResponse.json({ error: 'Invalid email or password' }, { status: 401 }))
      }

      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) {
        return handleCORS(NextResponse.json({ error: 'Invalid email or password' }, { status: 401 }))
      }

      // Check if user is approved by admin
      if (!user.isApproved) {
        return handleCORS(NextResponse.json({
          error: 'Account pending approval. Please wait for the admin to activate your account and send you the payment details via email.',
          pendingApproval: true
        }, { status: 403 }))
      }

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
      const { password: _, ...userWithoutPassword } = user

      return handleCORS(NextResponse.json({ user: userWithoutPassword, token }))
    }

    if (route === '/auth/admin/login' && method === 'POST') {
      const body = await request.json()
      const { email, password } = body

      if (email === 'k641259@gmail.com' && password === 'CADETX') {
        const token = jwt.sign({ id: 'admin-001', email, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' })
        return handleCORS(NextResponse.json({
          user: { id: 'admin-001', email, name: 'Admin', role: 'admin' },
          token
        }))
      }
      return handleCORS(NextResponse.json({ error: 'Invalid credentials' }, { status: 401 }))
    }

    if (route === '/auth/me' && method === 'GET') {
      const decoded = verifyToken(request)
      if (!decoded) {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      if (decoded.role === 'admin') {
        return handleCORS(NextResponse.json({
          user: { id: decoded.id, email: decoded.email, name: 'Admin', role: 'admin' }
        }))
      }

      const user = await prisma.user.findUnique({ where: { id: decoded.id } })
      if (!user) {
        return handleCORS(NextResponse.json({ error: 'User not found' }, { status: 404 }))
      }

      // Check if user is still approved (in case of revocation)
      if (!user.isApproved) {
        return handleCORS(NextResponse.json({
          error: 'Your account has been deactivated or is pending review.',
          isApproved: false
        }, { status: 403 }))
      }

      const { password: _, ...userWithoutPassword } = user
      return handleCORS(NextResponse.json({ user: userWithoutPassword }))
    }

    // =====================
    // ONBOARDING ROUTES
    // =====================

    if (route === '/onboarding' && method === 'POST') {
      const decoded = verifyToken(request)
      if (!decoded) {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      const body = await request.json()
      const { phone, education, experience, skills, linkedin, github, bio } = body

      await prisma.user.update({
        where: { id: decoded.id },
        data: { phone, education, experience, skills, linkedin, github, bio }
      })

      if (decoded.role === 'student') {
        const existingProfile = await prisma.student.findUnique({ where: { userId: decoded.id } })
        if (!existingProfile) {
          await prisma.student.create({
            data: {
              userId: decoded.id,
              status: 'onboarding',
              paymentVerified: false,
              currentWeek: 0,
              isVetted: false,
              accessGranted: false
            }
          })
        }
      }

      if (decoded.role === 'company') {
        const existingProfile = await prisma.company.findUnique({ where: { userId: decoded.id } })
        if (!existingProfile) {
          await prisma.company.create({
            data: {
              userId: decoded.id,
              companyName: body.company_name || 'Unknown',
              companySize: body.company_size,
              industry: body.industry,
              website: body.website
            }
          })
        }
      }

      return handleCORS(NextResponse.json({ success: true, message: 'Profile updated' }))
    }

    if (route === '/onboarding/aptitude' && method === 'POST') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'student') {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      const body = await request.json()
      const { answers, score } = body

      await prisma.student.update({
        where: { userId: decoded.id },
        data: {
          aptitudeScore: score,
          aptitudeAnswers: JSON.stringify(answers),
          status: 'aptitude_completed'
        }
      })

      return handleCORS(NextResponse.json({ success: true, score }))
    }

    if (route === '/onboarding/payment' && method === 'POST') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'student') {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      const body = await request.json()
      const { payment_id, amount } = body

      await prisma.student.update({
        where: { userId: decoded.id },
        data: {
          paymentVerified: true,
          paymentId: payment_id,
          paymentAmount: amount,
          status: 'enrolled',
          currentWeek: 1
        }
      })

      await prisma.user.update({
        where: { id: decoded.id },
        data: { onboardingCompleted: true, paymentVerified: true }
      })

      // Unlock week 1 materials ONLY if access is granted (which it isn't yet)
      // Admin must manually grant access now.

      return handleCORS(NextResponse.json({ success: true, message: 'Payment verified. Waiting for admin approval.' }))
    }

    if (route === '/student/enroll' && method === 'POST') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'student') {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      const body = await request.json()
      const { course_id } = body

      await prisma.student.update({
        where: { userId: decoded.id },
        data: { courseId: course_id }
      })

      return handleCORS(NextResponse.json({ success: true }))
    }

    if (route === '/courses' && method === 'GET') {
      const courses = await prisma.course.findMany()
      return handleCORS(NextResponse.json({ courses }))
    }

    // =====================
    // STUDENT DASHBOARD ROUTES
    // =====================

    if (route === '/student/dashboard' && method === 'GET') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'student') {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      const user = await prisma.user.findUnique({ where: { id: decoded.id } })
      const student = await prisma.student.findUnique({ where: { userId: decoded.id } })

      if (!student) {
        return handleCORS(NextResponse.json({ error: 'Student profile not found' }, { status: 404 }))
      }

      const quizzes = await prisma.quizResult.findMany({ where: { studentId: student.id } })
      const completedMaterials = await prisma.materialProgress.count({
        where: { studentId: student.id, completed: true }
      })
      const totalMaterials = await prisma.material.count({
        where: { weekNumber: { lte: student.currentWeek || 1 } }
      })

      const { password: _, ...userWithoutPassword } = user

      return handleCORS(NextResponse.json({
        user: userWithoutPassword,
        student,
        quizzes,
        progress: {
          completed: completedMaterials,
          total: totalMaterials,
          percentage: totalMaterials > 0 ? Math.round((completedMaterials / totalMaterials) * 100) : 0
        }
      }))
    }

    if (route === '/student/materials' && method === 'GET') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'student') {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      const student = await prisma.student.findUnique({ where: { userId: decoded.id } })
      const allMaterials = await prisma.material.findMany({ orderBy: [{ weekNumber: 'asc' }, { order: 'asc' }] })

      const accessControls = student ? await prisma.accessControl.findMany({ where: { studentId: student.id } }) : []
      const accessMap = new Map(accessControls.map(ac => [ac.materialId, ac.isUnlocked]))

      const progressRecords = student ? await prisma.materialProgress.findMany({ where: { studentId: student.id } }) : []
      const progressMap = new Map(progressRecords.map(p => [p.materialId, p.completed]))

      const materials = allMaterials.map(m => ({
        ...m,
        is_unlocked: accessMap.get(m.id) || m.weekNumber <= (student?.currentWeek || 0),
        is_completed: progressMap.get(m.id) || false
      }))

      return handleCORS(NextResponse.json({ materials, current_week: student?.currentWeek || 0 }))
    }

    if (route === '/student/materials/complete' && method === 'POST') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'student') {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      const body = await request.json()
      const { material_id } = body
      const student = await prisma.student.findUnique({ where: { userId: decoded.id } })

      await prisma.materialProgress.upsert({
        where: { studentId_materialId: { studentId: student.id, materialId: material_id } },
        create: { studentId: student.id, materialId: material_id, completed: true, completedAt: new Date() },
        update: { completed: true, completedAt: new Date() }
      })

      return handleCORS(NextResponse.json({ success: true }))
    }

    if (route === '/student/quiz' && method === 'POST') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'student') {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      const body = await request.json()
      const { week_number, answers, score } = body
      const student = await prisma.student.findUnique({ where: { userId: decoded.id } })

      const quiz = await prisma.quizResult.create({
        data: {
          studentId: student.id,
          week: week_number,
          score,
          answers: JSON.stringify(answers)
        }
      })

      return handleCORS(NextResponse.json({ success: true, quiz }))
    }

    if (route === '/student/portfolio' && method === 'POST') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'student') {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      const body = await request.json()
      const { portfolio_links } = body

      await prisma.student.update({
        where: { userId: decoded.id },
        data: { portfolioLinks: JSON.stringify(portfolio_links) }
      })

      return handleCORS(NextResponse.json({ success: true }))
    }

    // =====================
    // ADMIN ROUTES
    // =====================

    if (route === '/admin/students' && method === 'GET') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'admin') {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      const students = await prisma.student.findMany({
        include: {
          user: true,
          quizResults: true,
          course: true
        }
      })

      const studentsWithDetails = students.map(student => {
        const avgScore = student.quizResults.length > 0
          ? Math.round(student.quizResults.reduce((sum, q) => sum + q.score, 0) / student.quizResults.length)
          : null

        return {
          ...student,
          user: {
            name: student.user?.name,
            email: student.user?.email,
            isApproved: student.user?.isApproved
          },
          quiz_avg_score: avgScore,
          quiz_count: student.quizResults.length,
          course: student.course
        }
      })

      return handleCORS(NextResponse.json({ students: studentsWithDetails }))
    }

    if (route === '/admin/companies' && method === 'GET') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'admin') {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      const companies = await prisma.company.findMany({ include: { user: true } })
      const companiesWithDetails = companies.map(company => ({
        ...company,
        user: {
          name: company.user?.name,
          email: company.user?.email,
          isApproved: company.user?.isApproved
        }
      }))

      return handleCORS(NextResponse.json({ companies: companiesWithDetails }))
    }

    if (route === '/admin/universities' && method === 'GET') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'admin') {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      const universities = await prisma.university.findMany({ include: { user: true } })
      const universitiesWithDetails = universities.map(university => ({
        ...university,
        user: {
          name: university.user?.name,
          email: university.user?.email,
          isApproved: university.user?.isApproved
        }
      }))

      return handleCORS(NextResponse.json({ universities: universitiesWithDetails }))
    }

    if (route === '/admin/approve' && method === 'PATCH') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'admin') {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      const body = await request.json()
      const { user_id, is_approved } = body

      await prisma.user.update({
        where: { id: user_id },
        data: { isApproved: is_approved }
      })

      return handleCORS(NextResponse.json({ success: true }))
    }

    if (route === '/admin/courses' && method === 'GET') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'admin') {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }
      const courses = await prisma.course.findMany({ include: { _count: { select: { students: true } } } })
      return handleCORS(NextResponse.json({ courses }))
    }

    if (route === '/admin/courses' && method === 'POST') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'admin') {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }
      const body = await request.json()
      const course = await prisma.course.create({ data: body })
      return handleCORS(NextResponse.json({ success: true, course }))
    }

    if (route === '/admin/courses' && method === 'DELETE') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'admin') {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }
      const { searchParams } = new URL(request.url)
      const id = searchParams.get('id')
      await prisma.course.delete({ where: { id: parseInt(id) } })
      return handleCORS(NextResponse.json({ success: true }))
    }

    if (route === '/admin/access' && method === 'PATCH') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'admin') {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      const body = await request.json()
      const { student_id, access_granted } = body

      const student = await prisma.student.update({
        where: { userId: student_id },
        data: { accessGranted: access_granted }
      })

      if (access_granted) {
        // Unlock week 1 materials if not already unlocked
        const week1Materials = await prisma.material.findMany({ where: { weekNumber: 1 } })
        for (const material of week1Materials) {
          await prisma.accessControl.upsert({
            where: { studentId_materialId: { studentId: student.id, materialId: material.id } },
            create: { studentId: student.id, materialId: material.id, isUnlocked: true, unlockedAt: new Date() },
            update: { isUnlocked: true }
          })
        }
      } else {
        // Lock all materials
        await prisma.accessControl.updateMany({
          where: { studentId: student.id },
          data: { isUnlocked: false }
        })
      }

      return handleCORS(NextResponse.json({ success: true }))
    }

    if (route === '/admin/unlock' && method === 'PATCH') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'admin') {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      const body = await request.json()
      const { student_id, week_number } = body

      const student = await prisma.student.findUnique({ where: { userId: student_id } })
      if (!student) {
        return handleCORS(NextResponse.json({ error: 'Student not found' }, { status: 404 }))
      }

      await prisma.student.update({
        where: { id: student.id },
        data: { currentWeek: week_number }
      })

      const materials = await prisma.material.findMany({ where: { weekNumber: week_number } })
      for (const material of materials) {
        await prisma.accessControl.upsert({
          where: { studentId_materialId: { studentId: student.id, materialId: material.id } },
          create: { studentId: student.id, materialId: material.id, isUnlocked: true, unlockedAt: new Date() },
          update: { isUnlocked: true, unlockedAt: new Date() }
        })
      }

      return handleCORS(NextResponse.json({ success: true, message: `Week ${week_number} unlocked` }))
    }

    if (route === '/admin/promote' && method === 'PATCH') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'admin') {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      const body = await request.json()
      const { student_id, is_vetted } = body

      const student = await prisma.student.findUnique({ where: { userId: student_id } })
      if (!student) {
        return handleCORS(NextResponse.json({ error: 'Student not found' }, { status: 404 }))
      }

      await prisma.student.update({
        where: { id: student.id },
        data: {
          isVetted: is_vetted !== false,
          status: is_vetted !== false ? 'talent_pool' : 'enrolled'
        }
      })

      if (is_vetted !== false) {
        await prisma.talentPool.upsert({
          where: { id: student.id },
          create: {
            studentId: student.id,
            skills: student.portfolioLinks || '',
            available: true
          },
          update: { available: true }
        })
      } else {
        await prisma.talentPool.deleteMany({ where: { studentId: student.id } })
      }

      return handleCORS(NextResponse.json({ success: true }))
    }

    if (route === '/admin/materials' && method === 'POST') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'admin') {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      const body = await request.json()
      const { title, description, content_url, content_type, week_number, order } = body

      const material = await prisma.material.create({
        data: {
          title,
          description,
          contentUrl: content_url,
          contentType: content_type,
          weekNumber: week_number,
          order: order || 1
        }
      })

      return handleCORS(NextResponse.json({ success: true, material }))
    }

    if (route === '/admin/materials' && method === 'GET') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'admin') {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      const materials = await prisma.material.findMany({ orderBy: [{ weekNumber: 'asc' }, { order: 'asc' }] })
      return handleCORS(NextResponse.json({ materials }))
    }

    // =====================
    // COMPANY ROUTES
    // =====================

    if (route === '/company/talent' && method === 'GET') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'company') {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      const vettedStudents = await prisma.student.findMany({
        where: { isVetted: true },
        include: { user: true, quizResults: true }
      })

      const talentPool = vettedStudents.map(student => {
        const avgScore = student.quizResults.length > 0
          ? Math.round(student.quizResults.reduce((sum, q) => sum + q.score, 0) / student.quizResults.length)
          : null

        return {
          id: student.id,
          name: student.user?.name,
          email: student.user?.email,
          skills: student.user?.skills,
          education: student.user?.education,
          experience: student.user?.experience,
          linkedin: student.user?.linkedin,
          github: student.user?.github,
          portfolio_links: student.portfolioLinks ? JSON.parse(student.portfolioLinks) : [],
          aptitude_score: student.aptitudeScore,
          quiz_avg_score: avgScore,
          bio: student.user?.bio
        }
      })

      return handleCORS(NextResponse.json({ talent: talentPool }))
    }

    if (route === '/company/request' && method === 'POST') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'company') {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      const body = await request.json()
      const { student_id, message } = body

      const company = await prisma.company.findUnique({ where: { userId: decoded.id } })

      const requestRecord = await prisma.candidateRequest.create({
        data: {
          companyId: company.id,
          studentId: student_id,
          message,
          status: 'pending'
        }
      })

      return handleCORS(NextResponse.json({ success: true, request: requestRecord }))
    }

    if (route === '/company/dashboard' && method === 'GET') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'company') {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      const user = await prisma.user.findUnique({ where: { id: decoded.id } })
      const company = await prisma.company.findUnique({
        where: { userId: decoded.id },
        include: { candidateRequests: true }
      })

      const { password: _, ...userWithoutPassword } = user || {}

      return handleCORS(NextResponse.json({
        user: userWithoutPassword,
        company,
        requests: company?.candidateRequests || []
      }))
    }

    // =====================
    // UNIVERSITY ROUTES
    // =====================

    if (route === '/university/dashboard' && method === 'GET') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'university') {
        return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      }

      const user = await prisma.user.findUnique({ where: { id: decoded.id } })
      const university = await prisma.university.findUnique({
        where: { userId: decoded.id },
        include: { inviteCodes: true }
      })

      const { password: _, ...userWithoutPassword } = user || {}

      return handleCORS(NextResponse.json({
        user: userWithoutPassword,
        university,
        stats: { total_students: 0, active_students: 0 },
        students: []
      }))
    }

    // =====================
    // SEED DATA
    // =====================

    if (route === '/seed' && method === 'POST') {
      const sampleMaterials = [
        { week: 1, title: 'Introduction to Data Analytics', type: 'video', order: 1 },
        { week: 1, title: 'SQL Fundamentals', type: 'pdf', order: 2 },
        { week: 1, title: 'Setting Up Your Environment', type: 'video', order: 3 },
        { week: 2, title: 'Advanced SQL Queries', type: 'video', order: 1 },
        { week: 2, title: 'Data Modeling Basics', type: 'pdf', order: 2 },
        { week: 3, title: 'Python for Data Analysis', type: 'video', order: 1 },
        { week: 3, title: 'Pandas Library Deep Dive', type: 'pdf', order: 2 },
        { week: 4, title: 'Data Visualization with Tableau', type: 'video', order: 1 },
        { week: 4, title: 'Creating Dashboards', type: 'video', order: 2 },
      ]

      for (const m of sampleMaterials) {
        const exists = await prisma.material.findFirst({
          where: { title: m.title, weekNumber: m.week }
        })

        if (!exists) {
          await prisma.material.create({
            data: {
              title: m.title,
              description: `Learn ${m.title.toLowerCase()} in this comprehensive ${m.type}.`,
              contentUrl: m.type === 'video'
                ? 'https://www.youtube.com/embed/dQw4w9WgXcQ'
                : 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
              contentType: m.type,
              weekNumber: m.week,
              order: m.order
            }
          })
        }
      }

      return handleCORS(NextResponse.json({ success: true, message: 'Seed data created' }))
    }

    // Route not found
    return handleCORS(NextResponse.json({ error: `Route ${route} not found` }, { status: 404 }))

  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 }))
  }
}

export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute
