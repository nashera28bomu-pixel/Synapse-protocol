import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata = {
  title: 'Cymor AI — Elite Coding Assistant',
  description: 'Code like a senior dev. Debug like a machine. 100% Free. Powered by multi-model AI.',
  keywords: 'AI coding assistant, free coding AI, debug code, write code, Cymor',
  openGraph: {
    title: 'Cymor AI — Elite Coding Assistant',
    description: 'Code like a senior dev. Debug like a machine. 100% Free.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-[#050A0E] text-white antialiased">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0D1B2A',
              color: '#00FFD1',
              border: '1px solid rgba(0,255,209,0.3)',
              fontFamily: 'Space Mono, monospace',
              fontSize: '13px',
            },
            success: {
              iconTheme: { primary: '#00FFD1', secondary: '#050A0E' },
            },
            error: {
              iconTheme: { primary: '#FF4D6D', secondary: '#050A0E' },
              style: {
                color: '#FF4D6D',
                borderColor: 'rgba(255,77,109,0.3)',
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  )
}
