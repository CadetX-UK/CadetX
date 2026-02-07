import { GraduationCap, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function RecruitmentPage() {
    return (
        <div className="min-h-screen bg-white pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-4xl text-center">

                <h1 className="text-4xl md:text-5xl font-bold text-[#1D3557] mb-6">
                    Recruitment Solutions
                </h1>
                <p className="text-xl text-[#457B9D] mb-8 max-w-2xl mx-auto">
                    Find the perfect candidate for your team. Our AI-driven recruitment process ensures you get pre-vetted, high-quality talent.
                </p>
                <Link href="/register">
                    <Button size="lg" className="bg-[#E63946] hover:bg-[#c92a37] text-white">
                        Start Hiring <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
            </div>
        </div>
    )
}
