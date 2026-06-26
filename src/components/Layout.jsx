import { Navbar } from './Navbar'

export function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}