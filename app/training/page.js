import { BookOpen, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function TrainingPage() {
    return (
        <div className="min-h-screen bg-white pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-4xl text-center">
                <div className="w-16 h-16 bg-[#1D3557] rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-[#1D3557] mb-6">
                    Corporate Training
                </h1>
                <p className="text-xl text-[#457B9D] mb-8 max-w-2xl mx-auto">
                    Upskill your workforce with our tailored training programs. From data analytics to AI implementation, we cover it all.
                </p>
                <Link href="/contact">
                    <Button size="lg" className="bg-[#1D3557] hover:bg-[#0f1e33] text-white">
                        Contact Sales <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
            </div>
        </div>
    )
}
