import type React from "react"
import type { Metadata } from "next"
import { Blinker } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from '@/contexts/auth-context';
import { Suspense } from "react"
import "./globals.css"

const blinker = Blinker({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-blinker",
})

export const metadata: Metadata = {
  title: "Spaces - Book Your Perfect Space",
  description: "Browse, book, and manage event spaces, co-working areas, and hangout spots",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={blinker.variable}>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
                      <AuthProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
