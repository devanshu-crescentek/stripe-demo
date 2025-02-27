import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

import AppProvider from './app-provider'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'], // You can add more weights if needed
  variable: '--font-poppins', // Optional: For CSS variable usage
})

export const metadata: Metadata = {
  title: 'Stripe Payment Demo',
  description: 'Next.js Stripe Payment Demo',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${poppins.variable} antialiased`}>
      <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}
