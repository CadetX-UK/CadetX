import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'cadetx-super-secret-key-2025'

function handleCORS(response) {
    const corsOrigins = process.env.CORS_ORIGINS || '*'
    response.headers.set('Access-Control-Allow-Origin', corsOrigins)
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
}

function verifyToken(request) {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null
    }

    const token = authHeader.substring(7)
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch (error) {
        return null
    }
}

export async function POST(request) {
    try {
        // Verify authorization
        const decoded = verifyToken(request)
        if (!decoded || decoded.role !== 'university') {
            return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
        }

        // Parse request body
        const body = await request.json()
        const {
            institution_name,
            location,
            website,
            institutionType,
            accreditation,
            contactPhone,
            contactPerson,
            studentCount,
            programs,
            partnershipTier
        } = body

        // Basic validation
        if (!institution_name || !location) {
            return handleCORS(NextResponse.json({
                error: 'Missing required fields: institution_name and location are required'
            }, { status: 400 }))
        }

        // Upsert university record
        const university = await prisma.university.upsert({
            where: { userId: decoded.id },
            create: {
                userId: decoded.id,
                universityName: institution_name,
                location,
                website: website || null,
                institutionType: institutionType || null,
                accreditation: accreditation || null,
                contactPhone: contactPhone || null,
                contactPerson: contactPerson || null,
                studentCount: studentCount ? parseInt(studentCount) : null,
                programs: programs || null,
                partnershipTier: partnershipTier || 'Bronze'
            },
            update: {
                universityName: institution_name,
                location,
                website: website || null,
                institutionType: institutionType || null,
                accreditation: accreditation || null,
                contactPhone: contactPhone || null,
                contactPerson: contactPerson || null,
                studentCount: studentCount ? parseInt(studentCount) : null,
                programs: programs || null,
                partnershipTier: partnershipTier || undefined
            }
        })

        // Mark user onboarding as complete
        await prisma.user.update({
            where: { id: decoded.id },
            data: { onboardingCompleted: true }
        })

        return handleCORS(NextResponse.json({
            success: true,
            university: {
                id: university.id,
                universityName: university.universityName,
                location: university.location,
                website: university.website,
                institutionType: university.institutionType,
                accreditation: university.accreditation,
                contactPhone: university.contactPhone,
                contactPerson: university.contactPerson,
                studentCount: university.studentCount,
                programs: university.programs,
                partnershipTier: university.partnershipTier
            }
        }))
    } catch (error) {
        console.error('University onboarding error:', error)
        return handleCORS(NextResponse.json({
            error: 'Internal server error during university onboarding',
            details: error.message
        }, { status: 500 }))
    }
}

export async function OPTIONS() {
    return handleCORS(new NextResponse(null, { status: 204 }))
}
