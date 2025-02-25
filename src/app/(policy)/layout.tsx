import Header from '@/components/shared/header'
import Footer from '@/components/shared/footer'
import { Poppins } from 'next/font/google'
import '../globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'], // You can add more weights if needed
  variable: '--font-poppins', // Optional: For CSS variable usage
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${poppins.variable} antialiased`}>
        <Header />
        {children}
        <Footer/>
      </body>
    </html>
  )
}
