import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    setIsAuthenticated(!!token && !!user)
  }

  useEffect(() => {
    checkAuthStatus()
    
    // Listen for storage changes (when user logs in/out)
    const handleStorageChange = () => {
      checkAuthStatus()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Also check periodically for immediate updates
    const interval = setInterval(checkAuthStatus, 1000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar onShowAuthModal={() => setShowAuthModal(true)} isAuthenticated={isAuthenticated} />
        <Routes>
          <Route path="/" element={<Home showAuthModal={showAuthModal} setShowAuthModal={setShowAuthModal} />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
