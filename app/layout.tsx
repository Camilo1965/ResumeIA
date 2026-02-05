import '@/styles/globals.css'
import { AppHeader } from '@/components/shared/AppHeader'

export const metadata = {
  title: 'Resume AI - AI-Powered CV Generator',
  description: 'Generate personalized resumes with artificial intelligence',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AppHeader />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  )
}
