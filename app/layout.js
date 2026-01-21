import './globals.css'

export const metadata = {
  title: 'CadetX - Hire with Confidence. Every Cadet is Proven.',
  description: 'CadetX trains junior data professionals via internships and provides pre-vetted talent to companies. Hire with confidence, every cadet is proven.',
  keywords: 'data analytics, data science, internship, hiring, talent pool, training',
  openGraph: {
    title: 'CadetX - Pre-vetted Data Talent',
    description: 'Train and hire junior data professionals with confidence.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  )
}
