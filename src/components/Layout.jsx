import { Navbar } from './Navbar'
import { useState, useEffect } from 'react'

export function Layout({ children }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#13141F' }}>
      {!isMobile && <Navbar />}
      <main style={{ flex: 1, overflow: 'auto', paddingBottom: isMobile ? '60px' : '0' }}>
        {children}
      </main>
      {isMobile && <Navbar />}
    </div>
  )
}