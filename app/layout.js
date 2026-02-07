import { IBM_Plex_Sans } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'

const ibmPlexSans = IBM_Plex_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
})

export const metadata = {
  title: 'CadetX - The Hands-On Ecosystem for Junior Data Professionals',
  description: 'CadetX bridges the gap between education and industry. We provide companies with pre-vetted talent, students with real-world experience, and universities with industry-aligned placement success.',
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
      <body className={`${ibmPlexSans.variable} font-sans min-h-screen bg-background antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
