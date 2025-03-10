import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'

import Header from '@/components/shared/header'

import '../globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'], // You can add more weights if needed
  variable: '--font-poppins', // Optional: For CSS variable usage
})

export const metadata: Metadata = {
  title: 'Land Registry & Title Register Deeds in England, Wales & Scotland',
  description: 'Land Registry & Title Register Deeds in England, Wales & Scotland',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${poppins.variable} antialiased`}>
        <main className='h-screen flex gap-6 flex-col'>
          <Header />
          {children}
        </main>
      </body>
    </html>
  )
}
