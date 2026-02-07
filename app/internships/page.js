import { Users, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function InternshipsPage() {
    return (
        <div className="min-h-screen bg-white pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-4xl text-center">
                <div className="w-16 h-16 bg-[#E63946] rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Users className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-[#1D3557] mb-6">
                    Internship Programs
                </h1>
                <p className="text-xl text-[#457B9D] mb-8 max-w-2xl mx-auto">
                    Join our intensive internship programs to gain real-world experience. Work on live projects and get mentored by industry experts.
                </p>
                <Link href="/register">
                    <Button size="lg" className="bg-[#E63946] hover:bg-[#c92a37] text-white">
                        Apply Now <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
            </div>
        </div>
    )
}
