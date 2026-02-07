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

export async function OPTIONS() {
    return handleCORS(new NextResponse(null, { status: 200 }))
}

export async function POST(request) {
    try {
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
    } catch (error) {
        console.error('Login API Error:', error)
        return handleCORS(NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 }))
    }
}
