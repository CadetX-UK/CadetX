import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// MongoDB connection
let client
let db

const JWT_SECRET = process.env.JWT_SECRET || 'cadetx-super-secret-key-2025'

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME || 'cadetx')
  }
  return db
}

// Rate limiting (in-memory)
const rateLimitMap = new Map()
const RATE_LIMIT_WINDOW = 60000 // 1 minute
const MAX_REQUESTS = 100

function checkRateLimit(ip) {
  const now = Date.now()
  const windowStart = now - RATE_LIMIT_WINDOW
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, [])
  }
  
  const requests = rateLimitMap.get(ip).filter(time => time > windowStart)
  requests.push(now)
  rateLimitMap.set(ip, requests)
  
  return requests.length <= MAX_REQUESTS
}

// Helper function to handle CORS
function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

// Auth middleware
function verifyToken(request) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  const token = authHeader.substring(7)
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded
  } catch (error) {
    return null
  }
}

// Validation helpers
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePassword(password) {
  return password && password.length >= 6
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

// Route handler function
async function handleRoute(request, { params }) {
  const { path = [] } = params
  const route = `/${path.join('/')}`
  const method = request.method

  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  if (!checkRateLimit(ip)) {
    return handleCORS(NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    ))
  }

  try {
    const db = await connectToMongo()

    // =====================
    // PUBLIC ROUTES
    // =====================

    // Root endpoint
    if ((route === '/' || route === '/root') && method === 'GET') {
      return handleCORS(NextResponse.json({ 
        message: 'CadetX API v1.0',
        status: 'healthy',
        timestamp: new Date().toISOString()
      }))
    }

    // Health check
    if (route === '/health' && method === 'GET') {
      return handleCORS(NextResponse.json({ status: 'ok' }))
    }

    // =====================
    // AUTH ROUTES
    // =====================

    // Register
    if (route === '/auth/register' && method === 'POST') {
      const body = await request.json()
      const { email, password, name, role = 'student' } = body

      // Validation
      if (!email || !validateEmail(email)) {
        return handleCORS(NextResponse.json(
          { error: 'Valid email is required' },
          { status: 400 }
        ))
      }

      if (!validatePassword(password)) {
        return handleCORS(NextResponse.json(
          { error: 'Password must be at least 6 characters' },
          { status: 400 }
        ))
      }

      if (!name || name.trim().length < 2) {
        return handleCORS(NextResponse.json(
          { error: 'Name is required (at least 2 characters)' },
          { status: 400 }
        ))
      }

      if (!['student', 'company', 'university'].includes(role)) {
        return handleCORS(NextResponse.json(
          { error: 'Role must be student, company, or university' },
          { status: 400 }
        ))
      }

      // Check if user exists
      const existingUser = await db.collection('users').findOne({ email: email.toLowerCase() })
      if (existingUser) {
        return handleCORS(NextResponse.json(
          { error: 'Email already registered' },
          { status: 400 }
        ))
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create user
      const user = {
        id: uuidv4(),
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name.trim(),
        role,
        onboarding_completed: false,
        payment_verified: false,
        created_at: new Date(),
        updated_at: new Date()
      }

      await db.collection('users').insertOne(user)

      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      // Return user without password
      const { password: _, ...userWithoutPassword } = user

      return handleCORS(NextResponse.json({
        user: userWithoutPassword,
        token
      }))
    }

    // Login
    if (route === '/auth/login' && method === 'POST') {
      const body = await request.json()
      const { email, password } = body

      if (!email || !password) {
        return handleCORS(NextResponse.json(
          { error: 'Email and password are required' },
          { status: 400 }
        ))
      }

      // Find user
      const user = await db.collection('users').findOne({ email: email.toLowerCase() })
      if (!user) {
        return handleCORS(NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        ))
      }

      // Check password
      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) {
        return handleCORS(NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        ))
      }

      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      // Return user without password
      const { password: _, ...userWithoutPassword } = user

      return handleCORS(NextResponse.json({
        user: userWithoutPassword,
        token
      }))
    }

    // Admin Login (hardcoded credentials)
    if (route === '/auth/admin/login' && method === 'POST') {
      const body = await request.json()
      const { email, password } = body

      // Hardcoded admin credentials
      if (email === 'k641259@gmail.com' && password === 'CADETX') {
        const token = jwt.sign(
          { id: 'admin-001', email, role: 'admin' },
          JWT_SECRET,
          { expiresIn: '24h' }
        )

        return handleCORS(NextResponse.json({
          user: {
            id: 'admin-001',
            email,
            name: 'Admin',
            role: 'admin'
          },
          token
        }))
      }

      return handleCORS(NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      ))
    }

    // Get current user
    if (route === '/auth/me' && method === 'GET') {
      const decoded = verifyToken(request)
      if (!decoded) {
        return handleCORS(NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        ))
      }

      if (decoded.role === 'admin') {
        return handleCORS(NextResponse.json({
          user: { id: decoded.id, email: decoded.email, name: 'Admin', role: 'admin' }
        }))
      }

      const user = await db.collection('users').findOne({ id: decoded.id })
      if (!user) {
        return handleCORS(NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        ))
      }

      const { password: _, ...userWithoutPassword } = user
      return handleCORS(NextResponse.json({ user: userWithoutPassword }))
    }

    // =====================
    // ONBOARDING ROUTES
    // =====================

    // Submit onboarding
    if (route === '/onboarding' && method === 'POST') {
      const decoded = verifyToken(request)
      if (!decoded) {
        return handleCORS(NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        ))
      }

      const body = await request.json()
      const { phone, education, experience, skills, linkedin, github, bio } = body

      // Update user profile
      await db.collection('users').updateOne(
        { id: decoded.id },
        {
          $set: {
            phone,
            education,
            experience,
            skills,
            linkedin,
            github,
            bio,
            updated_at: new Date()
          }
        }
      )

      // Create student profile if student
      if (decoded.role === 'student') {
        const existingProfile = await db.collection('students').findOne({ user_id: decoded.id })
        if (!existingProfile) {
          await db.collection('students').insertOne({
            id: uuidv4(),
            user_id: decoded.id,
            status: 'onboarding',
            aptitude_score: null,
            payment_verified: false,
            portfolio_links: [],
            current_week: 0,
            is_vetted: false,
            created_at: new Date(),
            updated_at: new Date()
          })
        }
      }

      // Create company profile if company
      if (decoded.role === 'company') {
        const existingProfile = await db.collection('companies').findOne({ user_id: decoded.id })
        if (!existingProfile) {
          await db.collection('companies').insertOne({
            id: uuidv4(),
            user_id: decoded.id,
            company_name: body.company_name,
            company_size: body.company_size,
            industry: body.industry,
            website: body.website,
            created_at: new Date(),
            updated_at: new Date()
          })
        }
      }

      return handleCORS(NextResponse.json({ success: true, message: 'Profile updated' }))
    }

    // Submit aptitude test
    if (route === '/onboarding/aptitude' && method === 'POST') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'student') {
        return handleCORS(NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        ))
      }

      const body = await request.json()
      const { answers, score } = body

      // Update student profile
      await db.collection('students').updateOne(
        { user_id: decoded.id },
        {
          $set: {
            aptitude_score: score,
            aptitude_answers: answers,
            status: 'aptitude_completed',
            updated_at: new Date()
          }
        }
      )

      return handleCORS(NextResponse.json({ success: true, score }))
    }

    // Complete payment (mock)
    if (route === '/onboarding/payment' && method === 'POST') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'student') {
        return handleCORS(NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        ))
      }

      const body = await request.json()
      const { payment_id, amount } = body

      // Update payment status (mock payment success)
      await db.collection('students').updateOne(
        { user_id: decoded.id },
        {
          $set: {
            payment_verified: true,
            payment_id,
            payment_amount: amount,
            status: 'enrolled',
            current_week: 1,
            updated_at: new Date()
          }
        }
      )

      await db.collection('users').updateOne(
        { id: decoded.id },
        {
          $set: {
            onboarding_completed: true,
            payment_verified: true,
            updated_at: new Date()
          }
        }
      )

      // Unlock week 1 materials for this student
      const week1Materials = await db.collection('materials').find({ week_number: 1 }).toArray()
      for (const material of week1Materials) {
        await db.collection('access_control').insertOne({
          id: uuidv4(),
          student_id: decoded.id,
          material_id: material.id,
          is_unlocked: true,
          unlocked_at: new Date()
        })
      }

      return handleCORS(NextResponse.json({ success: true, message: 'Payment verified' }))
    }

    // =====================
    // STUDENT DASHBOARD ROUTES
    // =====================

    // Get student dashboard data
    if (route === '/student/dashboard' && method === 'GET') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'student') {
        return handleCORS(NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        ))
      }

      const student = await db.collection('students').findOne({ user_id: decoded.id })
      const user = await db.collection('users').findOne({ id: decoded.id })

      if (!student) {
        return handleCORS(NextResponse.json(
          { error: 'Student profile not found' },
          { status: 404 }
        ))
      }

      // Get quiz scores
      const quizzes = await db.collection('quizzes').find({ student_id: decoded.id }).toArray()
      
      // Get progress
      const completedMaterials = await db.collection('material_progress').countDocuments({
        student_id: decoded.id,
        completed: true
      })

      const totalMaterials = await db.collection('materials').countDocuments({
        week_number: { $lte: student.current_week || 1 }
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

    // Get materials for student
    if (route === '/student/materials' && method === 'GET') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'student') {
        return handleCORS(NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        ))
      }

      const student = await db.collection('students').findOne({ user_id: decoded.id })
      const allMaterials = await db.collection('materials').find({}).sort({ week_number: 1, order: 1 }).toArray()

      // Get access control for this student
      const accessControls = await db.collection('access_control').find({ student_id: decoded.id }).toArray()
      const accessMap = new Map(accessControls.map(ac => [ac.material_id, ac.is_unlocked]))

      // Get progress
      const progressRecords = await db.collection('material_progress').find({ student_id: decoded.id }).toArray()
      const progressMap = new Map(progressRecords.map(p => [p.material_id, p.completed]))

      // Mark materials as locked/unlocked based on current week
      const materials = allMaterials.map(m => ({
        ...m,
        is_unlocked: accessMap.get(m.id) || m.week_number <= (student?.current_week || 0),
        is_completed: progressMap.get(m.id) || false
      }))

      return handleCORS(NextResponse.json({ materials, current_week: student?.current_week || 0 }))
    }

    // Mark material as completed
    if (route === '/student/materials/complete' && method === 'POST') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'student') {
        return handleCORS(NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        ))
      }

      const body = await request.json()
      const { material_id } = body

      await db.collection('material_progress').updateOne(
        { student_id: decoded.id, material_id },
        {
          $set: {
            completed: true,
            completed_at: new Date()
          },
          $setOnInsert: {
            id: uuidv4(),
            student_id: decoded.id,
            material_id
          }
        },
        { upsert: true }
      )

      return handleCORS(NextResponse.json({ success: true }))
    }

    // Submit quiz
    if (route === '/student/quiz' && method === 'POST') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'student') {
        return handleCORS(NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        ))
      }

      const body = await request.json()
      const { week_number, answers, score } = body

      const quiz = {
        id: uuidv4(),
        student_id: decoded.id,
        week_number,
        answers,
        score,
        submitted_at: new Date()
      }

      await db.collection('quizzes').insertOne(quiz)

      return handleCORS(NextResponse.json({ success: true, quiz }))
    }

    // Update portfolio
    if (route === '/student/portfolio' && method === 'POST') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'student') {
        return handleCORS(NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        ))
      }

      const body = await request.json()
      const { portfolio_links } = body

      await db.collection('students').updateOne(
        { user_id: decoded.id },
        {
          $set: {
            portfolio_links,
            updated_at: new Date()
          }
        }
      )

      return handleCORS(NextResponse.json({ success: true }))
    }

    // =====================
    // ADMIN ROUTES
    // =====================

    // Get all students (admin only)
    if (route === '/admin/students' && method === 'GET') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'admin') {
        return handleCORS(NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        ))
      }

      const students = await db.collection('students').find({}).toArray()
      
      // Get user details for each student
      const studentsWithDetails = await Promise.all(
        students.map(async (student) => {
          const user = await db.collection('users').findOne({ id: student.user_id })
          const quizzes = await db.collection('quizzes').find({ student_id: student.user_id }).toArray()
          const avgScore = quizzes.length > 0 
            ? Math.round(quizzes.reduce((sum, q) => sum + q.score, 0) / quizzes.length)
            : null
          
          return {
            ...student,
            user: user ? { name: user.name, email: user.email } : null,
            quiz_avg_score: avgScore,
            quiz_count: quizzes.length
          }
        })
      )

      return handleCORS(NextResponse.json({ students: studentsWithDetails }))
    }

    // Unlock week for student (admin only)
    if (route === '/admin/unlock' && method === 'PATCH') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'admin') {
        return handleCORS(NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        ))
      }

      const body = await request.json()
      const { student_id, week_number } = body

      // Update student's current week
      await db.collection('students').updateOne(
        { user_id: student_id },
        {
          $set: {
            current_week: week_number,
            updated_at: new Date()
          }
        }
      )

      // Unlock materials for this week
      const materials = await db.collection('materials').find({ week_number }).toArray()
      for (const material of materials) {
        await db.collection('access_control').updateOne(
          { student_id, material_id: material.id },
          {
            $set: {
              is_unlocked: true,
              unlocked_at: new Date()
            },
            $setOnInsert: {
              id: uuidv4(),
              student_id,
              material_id: material.id
            }
          },
          { upsert: true }
        )
      }

      return handleCORS(NextResponse.json({ success: true, message: `Week ${week_number} unlocked` }))
    }

    // Promote student to talent pool (admin only)
    if (route === '/admin/promote' && method === 'PATCH') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'admin') {
        return handleCORS(NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        ))
      }

      const body = await request.json()
      const { student_id, is_vetted } = body

      await db.collection('students').updateOne(
        { user_id: student_id },
        {
          $set: {
            is_vetted: is_vetted !== false,
            status: is_vetted !== false ? 'talent_pool' : 'enrolled',
            updated_at: new Date()
          }
        }
      )

      // Add/update talent pool entry
      if (is_vetted !== false) {
        const student = await db.collection('students').findOne({ user_id: student_id })
        await db.collection('talent_pool').updateOne(
          { student_id },
          {
            $set: {
              is_vetted: true,
              portfolio_links: student?.portfolio_links || [],
              updated_at: new Date()
            },
            $setOnInsert: {
              id: uuidv4(),
              student_id,
              created_at: new Date()
            }
          },
          { upsert: true }
        )
      } else {
        await db.collection('talent_pool').deleteOne({ student_id })
      }

      return handleCORS(NextResponse.json({ success: true }))
    }

    // Manage materials (admin only)
    if (route === '/admin/materials' && method === 'POST') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'admin') {
        return handleCORS(NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        ))
      }

      const body = await request.json()
      const { title, description, content_url, content_type, week_number, order } = body

      const material = {
        id: uuidv4(),
        title,
        description,
        content_url,
        content_type, // 'video' or 'pdf'
        week_number,
        order: order || 1,
        created_at: new Date(),
        updated_at: new Date()
      }

      await db.collection('materials').insertOne(material)

      return handleCORS(NextResponse.json({ success: true, material }))
    }

    // Get all materials (admin only)
    if (route === '/admin/materials' && method === 'GET') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'admin') {
        return handleCORS(NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        ))
      }

      const materials = await db.collection('materials').find({}).sort({ week_number: 1, order: 1 }).toArray()

      return handleCORS(NextResponse.json({ materials }))
    }

    // =====================
    // COMPANY ROUTES
    // =====================

    // Get talent pool (company only)
    if (route === '/company/talent' && method === 'GET') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'company') {
        return handleCORS(NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        ))
      }

      // Get vetted students only
      const vettedStudents = await db.collection('students').find({ is_vetted: true }).toArray()
      
      const talentPool = await Promise.all(
        vettedStudents.map(async (student) => {
          const user = await db.collection('users').findOne({ id: student.user_id })
          const quizzes = await db.collection('quizzes').find({ student_id: student.user_id }).toArray()
          const avgScore = quizzes.length > 0 
            ? Math.round(quizzes.reduce((sum, q) => sum + q.score, 0) / quizzes.length)
            : null
          
          return {
            id: student.id,
            name: user?.name,
            email: user?.email,
            skills: user?.skills,
            education: user?.education,
            experience: user?.experience,
            linkedin: user?.linkedin,
            github: user?.github,
            portfolio_links: student.portfolio_links,
            aptitude_score: student.aptitude_score,
            quiz_avg_score: avgScore,
            bio: user?.bio
          }
        })
      )

      return handleCORS(NextResponse.json({ talent: talentPool }))
    }

    // Request candidate (company only)
    if (route === '/company/request' && method === 'POST') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'company') {
        return handleCORS(NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        ))
      }

      const body = await request.json()
      const { student_id, message } = body

      const companyProfile = await db.collection('companies').findOne({ user_id: decoded.id })

      const request_record = {
        id: uuidv4(),
        company_id: decoded.id,
        company_name: companyProfile?.company_name,
        student_id,
        message,
        status: 'pending',
        created_at: new Date()
      }

      await db.collection('candidate_requests').insertOne(request_record)

      return handleCORS(NextResponse.json({ success: true, request: request_record }))
    }

    // Get company dashboard
    if (route === '/company/dashboard' && method === 'GET') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'company') {
        return handleCORS(NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        ))
      }

      const user = await db.collection('users').findOne({ id: decoded.id })
      const company = await db.collection('companies').findOne({ user_id: decoded.id })
      const requests = await db.collection('candidate_requests').find({ company_id: decoded.id }).toArray()

      const { password: _, ...userWithoutPassword } = user || {}

      return handleCORS(NextResponse.json({
        user: userWithoutPassword,
        company,
        requests
      }))
    }

    // =====================
    // UNIVERSITY ROUTES
    // =====================

    // University onboarding
    if (route === '/university/onboarding' && method === 'POST') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'university') {
        return handleCORS(NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        ))
      }

      const body = await request.json()
      const { 
        institution_name, institution_type, accreditation, 
        location, website, phone, contact_person, 
        student_count, programs_offered, partnership_type 
      } = body

      // Create or update university profile
      const existingProfile = await db.collection('universities').findOne({ user_id: decoded.id })
      
      if (existingProfile) {
        await db.collection('universities').updateOne(
          { user_id: decoded.id },
          {
            $set: {
              institution_name,
              institution_type,
              accreditation,
              location,
              website,
              phone,
              contact_person,
              student_count,
              programs_offered,
              partnership_type,
              updated_at: new Date()
            }
          }
        )
      } else {
        await db.collection('universities').insertOne({
          id: uuidv4(),
          user_id: decoded.id,
          institution_name,
          institution_type,
          accreditation,
          location,
          website,
          phone,
          contact_person,
          student_count,
          programs_offered,
          partnership_type,
          partnership_status: 'pending',
          enrolled_students: [],
          created_at: new Date(),
          updated_at: new Date()
        })
      }

      // Update user onboarding status
      await db.collection('users').updateOne(
        { id: decoded.id },
        {
          $set: {
            onboarding_completed: true,
            updated_at: new Date()
          }
        }
      )

      return handleCORS(NextResponse.json({ success: true, message: 'University profile created' }))
    }

    // Get university dashboard
    if (route === '/university/dashboard' && method === 'GET') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'university') {
        return handleCORS(NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        ))
      }

      const user = await db.collection('users').findOne({ id: decoded.id })
      const university = await db.collection('universities').findOne({ user_id: decoded.id })

      if (!university) {
        return handleCORS(NextResponse.json({
          user: { ...user, password: undefined },
          university: null,
          stats: null,
          students: []
        }))
      }

      // Get enrolled students with their progress
      const enrolledStudentIds = university.enrolled_students || []
      const students = await Promise.all(
        enrolledStudentIds.map(async (studentUserId) => {
          const studentUser = await db.collection('users').findOne({ id: studentUserId })
          const studentProfile = await db.collection('students').findOne({ user_id: studentUserId })
          const quizzes = await db.collection('quizzes').find({ student_id: studentUserId }).toArray()
          const avgScore = quizzes.length > 0 
            ? Math.round(quizzes.reduce((sum, q) => sum + q.score, 0) / quizzes.length)
            : null

          return {
            id: studentUserId,
            name: studentUser?.name,
            email: studentUser?.email,
            status: studentProfile?.status || 'pending',
            current_week: studentProfile?.current_week || 0,
            aptitude_score: studentProfile?.aptitude_score,
            quiz_avg_score: avgScore,
            is_vetted: studentProfile?.is_vetted || false,
            payment_verified: studentProfile?.payment_verified || false,
            enrolled_at: studentProfile?.created_at
          }
        })
      )

      // Calculate stats
      const totalStudents = students.length
      const activeStudents = students.filter(s => s.payment_verified).length
      const completedStudents = students.filter(s => s.current_week >= 4).length
      const placedStudents = students.filter(s => s.is_vetted).length
      const avgAptitudeScore = students.filter(s => s.aptitude_score).length > 0
        ? Math.round(students.filter(s => s.aptitude_score).reduce((sum, s) => sum + s.aptitude_score, 0) / students.filter(s => s.aptitude_score).length)
        : 0

      const stats = {
        total_students: totalStudents,
        active_students: activeStudents,
        completed_students: completedStudents,
        placed_students: placedStudents,
        completion_rate: totalStudents > 0 ? Math.round((completedStudents / totalStudents) * 100) : 0,
        placement_rate: completedStudents > 0 ? Math.round((placedStudents / completedStudents) * 100) : 0,
        avg_aptitude_score: avgAptitudeScore
      }

      const { password: _, ...userWithoutPassword } = user || {}

      return handleCORS(NextResponse.json({
        user: userWithoutPassword,
        university,
        stats,
        students
      }))
    }

    // Add student to university (bulk or single)
    if (route === '/university/students/add' && method === 'POST') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'university') {
        return handleCORS(NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        ))
      }

      const body = await request.json()
      const { emails } = body // Array of student emails

      if (!emails || !Array.isArray(emails) || emails.length === 0) {
        return handleCORS(NextResponse.json(
          { error: 'At least one email is required' },
          { status: 400 }
        ))
      }

      const university = await db.collection('universities').findOne({ user_id: decoded.id })
      if (!university) {
        return handleCORS(NextResponse.json(
          { error: 'University profile not found' },
          { status: 404 }
        ))
      }

      const results = { added: [], not_found: [], already_enrolled: [] }

      for (const email of emails) {
        const studentUser = await db.collection('users').findOne({ 
          email: email.toLowerCase(), 
          role: 'student' 
        })

        if (!studentUser) {
          results.not_found.push(email)
          continue
        }

        // Check if already enrolled
        if (university.enrolled_students?.includes(studentUser.id)) {
          results.already_enrolled.push(email)
          continue
        }

        // Add student to university
        await db.collection('universities').updateOne(
          { user_id: decoded.id },
          { 
            $addToSet: { enrolled_students: studentUser.id },
            $set: { updated_at: new Date() }
          }
        )

        // Update student with university reference
        await db.collection('students').updateOne(
          { user_id: studentUser.id },
          { 
            $set: { 
              university_id: university.id,
              updated_at: new Date() 
            }
          }
        )

        results.added.push(email)
      }

      return handleCORS(NextResponse.json({ 
        success: true, 
        results,
        message: `Added ${results.added.length} students`
      }))
    }

    // Remove student from university
    if (route === '/university/students/remove' && method === 'POST') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'university') {
        return handleCORS(NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        ))
      }

      const body = await request.json()
      const { student_id } = body

      await db.collection('universities').updateOne(
        { user_id: decoded.id },
        { 
          $pull: { enrolled_students: student_id },
          $set: { updated_at: new Date() }
        }
      )

      await db.collection('students').updateOne(
        { user_id: student_id },
        { 
          $unset: { university_id: '' },
          $set: { updated_at: new Date() }
        }
      )

      return handleCORS(NextResponse.json({ success: true }))
    }

    // Get university analytics
    if (route === '/university/analytics' && method === 'GET') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'university') {
        return handleCORS(NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        ))
      }

      const university = await db.collection('universities').findOne({ user_id: decoded.id })
      if (!university) {
        return handleCORS(NextResponse.json({ analytics: null }))
      }

      const enrolledStudentIds = university.enrolled_students || []

      // Get weekly progress distribution
      const weeklyProgress = { week1: 0, week2: 0, week3: 0, week4: 0, completed: 0 }
      const statusDistribution = { onboarding: 0, enrolled: 0, talent_pool: 0 }
      const scoreRanges = { excellent: 0, good: 0, average: 0, needsWork: 0 }

      for (const studentId of enrolledStudentIds) {
        const student = await db.collection('students').findOne({ user_id: studentId })
        if (!student) continue

        // Weekly progress
        const week = student.current_week || 0
        if (week >= 4) weeklyProgress.completed++
        else if (week === 3) weeklyProgress.week4++
        else if (week === 2) weeklyProgress.week3++
        else if (week === 1) weeklyProgress.week2++
        else weeklyProgress.week1++

        // Status distribution
        if (student.is_vetted) statusDistribution.talent_pool++
        else if (student.payment_verified) statusDistribution.enrolled++
        else statusDistribution.onboarding++

        // Score ranges
        const quizzes = await db.collection('quizzes').find({ student_id: studentId }).toArray()
        if (quizzes.length > 0) {
          const avgScore = Math.round(quizzes.reduce((sum, q) => sum + q.score, 0) / quizzes.length)
          if (avgScore >= 90) scoreRanges.excellent++
          else if (avgScore >= 75) scoreRanges.good++
          else if (avgScore >= 60) scoreRanges.average++
          else scoreRanges.needsWork++
        }
      }

      return handleCORS(NextResponse.json({
        analytics: {
          weeklyProgress,
          statusDistribution,
          scoreRanges,
          totalEnrolled: enrolledStudentIds.length
        }
      }))
    }

    // Invite students (send invitation codes)
    if (route === '/university/invite' && method === 'POST') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'university') {
        return handleCORS(NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        ))
      }

      const body = await request.json()
      const { count = 10 } = body

      const university = await db.collection('universities').findOne({ user_id: decoded.id })
      if (!university) {
        return handleCORS(NextResponse.json(
          { error: 'University profile not found' },
          { status: 404 }
        ))
      }

      // Generate invitation codes
      const inviteCodes = []
      for (let i = 0; i < count; i++) {
        const code = `${university.institution_name?.substring(0, 3).toUpperCase() || 'UNI'}-${uuidv4().substring(0, 8).toUpperCase()}`
        inviteCodes.push({
          id: uuidv4(),
          code,
          university_id: university.id,
          used: false,
          created_at: new Date(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        })
      }

      await db.collection('invite_codes').insertMany(inviteCodes)

      return handleCORS(NextResponse.json({ 
        success: true, 
        codes: inviteCodes.map(c => c.code)
      }))
    }

    // Validate invite code (public route for students)
    if (route === '/university/validate-code' && method === 'POST') {
      const body = await request.json()
      const { code } = body

      const inviteCode = await db.collection('invite_codes').findOne({ 
        code: code.toUpperCase(),
        used: false,
        expires_at: { $gt: new Date() }
      })

      if (!inviteCode) {
        return handleCORS(NextResponse.json(
          { valid: false, error: 'Invalid or expired code' },
          { status: 400 }
        ))
      }

      const university = await db.collection('universities').findOne({ id: inviteCode.university_id })

      return handleCORS(NextResponse.json({ 
        valid: true, 
        university_name: university?.institution_name,
        university_id: university?.id
      }))
    }

    // Use invite code (after student registration)
    if (route === '/university/use-code' && method === 'POST') {
      const decoded = verifyToken(request)
      if (!decoded || decoded.role !== 'student') {
        return handleCORS(NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        ))
      }

      const body = await request.json()
      const { code } = body

      const inviteCode = await db.collection('invite_codes').findOne({ 
        code: code.toUpperCase(),
        used: false,
        expires_at: { $gt: new Date() }
      })

      if (!inviteCode) {
        return handleCORS(NextResponse.json(
          { error: 'Invalid or expired code' },
          { status: 400 }
        ))
      }

      // Mark code as used
      await db.collection('invite_codes').updateOne(
        { id: inviteCode.id },
        { $set: { used: true, used_by: decoded.id, used_at: new Date() } }
      )

      // Add student to university
      await db.collection('universities').updateOne(
        { id: inviteCode.university_id },
        { 
          $addToSet: { enrolled_students: decoded.id },
          $set: { updated_at: new Date() }
        }
      )

      // Update student with university reference
      await db.collection('students').updateOne(
        { user_id: decoded.id },
        { 
          $set: { 
            university_id: inviteCode.university_id,
            updated_at: new Date() 
          }
        }
      )

      return handleCORS(NextResponse.json({ success: true }))
    }

    // =====================
    // SEED DATA (for development)
    // =====================

    if (route === '/seed' && method === 'POST') {
      // Create sample materials
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
        const exists = await db.collection('materials').findOne({ 
          title: m.title, 
          week_number: m.week 
        })
        
        if (!exists) {
          await db.collection('materials').insertOne({
            id: uuidv4(),
            title: m.title,
            description: `Learn ${m.title.toLowerCase()} in this comprehensive ${m.type}.`,
            content_url: m.type === 'video' 
              ? 'https://www.youtube.com/embed/dQw4w9WgXcQ' 
              : 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            content_type: m.type,
            week_number: m.week,
            order: m.order,
            created_at: new Date(),
            updated_at: new Date()
          })
        }
      }

      return handleCORS(NextResponse.json({ success: true, message: 'Seed data created' }))
    }

    // Route not found
    return handleCORS(NextResponse.json(
      { error: `Route ${route} not found` },
      { status: 404 }
    ))

  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    ))
  }
}

// Export all HTTP methods
export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute
