import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

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

        if (email === 'k641259@gmail.com' && password === 'CADETX') {
            const token = jwt.sign({ id: 'admin-001', email, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' })
            return handleCORS(NextResponse.json({
                user: { id: 'admin-001', email, name: 'Admin', role: 'admin' },
                token
            }))
        }

        return handleCORS(NextResponse.json({ error: 'Invalid credentials' }, { status: 401 }))
    } catch (error) {
        console.error('Admin Login API Error:', error)
        return handleCORS(NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 }))
    }
}
