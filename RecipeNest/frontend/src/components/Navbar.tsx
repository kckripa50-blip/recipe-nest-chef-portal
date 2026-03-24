import { Search, Plus, Heart, User, Bell } from 'lucide-react'
import { Link } from 'react-router-dom'

interface NavbarProps {
  onShowAuthModal: () => void
  isAuthenticated?: boolean
}

const Navbar = ({ onShowAuthModal, isAuthenticated = false }: NavbarProps) => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-orange-500">RN</span>
            <span className="text-xl font-semibold text-gray-800">Recipe Nest</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search recipes, chefs, ingredients..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Only show Add Recipe button if user is NOT authenticated */}
            {!isAuthenticated && (
              <button 
                className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-orange-600 transition"
                onClick={onShowAuthModal}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Recipe</span>
              </button>
            )}
            
            <button className="text-gray-600 hover:text-red-500 transition">
              <Heart className="w-5 h-5" />
            </button>
            
            <button className="text-gray-600 hover:text-gray-800 transition">
              <User className="w-5 h-5" />
            </button>
            
            <button className="text-gray-600 hover:text-gray-800 transition relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search recipes, chefs, ingredients..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
