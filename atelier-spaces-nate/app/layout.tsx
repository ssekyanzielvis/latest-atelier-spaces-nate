import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Atelier Spaces Nate | Architecture & Design',
  description: 'Contemporary architecture and interior design studio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
