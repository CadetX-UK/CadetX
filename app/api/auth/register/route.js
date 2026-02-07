import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'cadetx-super-secret-key-2025'

function handleCORS(response) {
    response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    return response
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

export async function POST(request) {
    try {
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
                isApproved: false, // Explicitly set to false
                paymentVerified: false
            }
        })

        // Create initial profile shell so admin can see the registration
        if (role === 'student') {
            await prisma.student.create({
                data: {
                    userId: user.id,
                    status: 'onboarding',
                    paymentVerified: false,
                    currentWeek: 0,
                    isVetted: false,
                    accessGranted: false
                }
            })
        } else if (role === 'company') {
            await prisma.company.create({
                data: {
                    userId: user.id,
                    companyName: 'Pending Setup',
                    isApproved: false
                }
            })
        } else if (role === 'university') {
            await prisma.university.create({
                data: {
                    userId: user.id,
                    universityName: 'Pending Setup'
                }
            })
        }

        const { password: _, ...userWithoutPassword } = user

        return handleCORS(NextResponse.json({
            success: true,
            message: 'Registration successful. Application sent to admin for review.',
            user: userWithoutPassword
        }))
    } catch (error) {
        console.error('Registration API Error:', error)
        return handleCORS(NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 }))
    }
}
