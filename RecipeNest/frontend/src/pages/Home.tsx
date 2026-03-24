import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, User, Star, Clock, X, Eye } from 'lucide-react'

interface HomeProps {
  showAuthModal?: boolean
  setShowAuthModal?: React.Dispatch<React.SetStateAction<boolean>>
}

const Home: React.FC<HomeProps> = ({ showAuthModal: externalShowAuthModal, setShowAuthModal: externalSetShowAuthModal }) => {
  const navigate = useNavigate()
  const [internalShowAuthModal, setInternalShowAuthModal] = useState(false)
  
  // Use external state if provided, otherwise use internal state
  const showAuthModal = externalShowAuthModal ?? internalShowAuthModal
  const setShowAuthModal = externalSetShowAuthModal ?? setInternalShowAuthModal
  
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [userType, setUserType] = useState<'normal' | 'chef'>('normal')
  const [authSuccess, setAuthSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    agreeTerms: false
  })
  const [formErrors, setFormErrors] = useState<any>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [featuredRecipes, setFeaturedRecipes] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null)
  const [showRecipeModal, setShowRecipeModal] = useState(false)

  // Load published recipes from localStorage
  useEffect(() => {
    loadPublishedRecipes()
    loadCategoriesFromStorage()
    
    // Listen for storage changes to update when recipes are published
    const handleStorageChange = () => {
      loadPublishedRecipes()
      loadCategoriesFromStorage()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const loadCategoriesFromStorage = () => {
    const storedCategories = localStorage.getItem('userCategories')
    if (storedCategories) {
      const userCategories = JSON.parse(storedCategories)
      setCategories(['All Recipes', ...userCategories])
    } else {
      // Fallback to default categories
      setCategories(['All Recipes', 'Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Drinks', 'Appetizers', 'Vegetarian'])
    }
  }

  const loadPublishedRecipes = () => {
    // Get published recipes from localStorage (simulating database)
    const storedRecipes = localStorage.getItem('publishedRecipes')
    if (storedRecipes) {
      setFeaturedRecipes(JSON.parse(storedRecipes))
    } else {
      // Fallback to default recipes if no published recipes exist
      setFeaturedRecipes([
        {
          id: 1,
          name: "Classic Margherita Pizza",
          chef: "Chef Mario",
          image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400",
          rating: 4.8,
          time: "30 min",
          difficulty: "Medium",
          liked: false
        },
        {
          id: 2,
          name: "Chocolate Lava Cake",
          chef: "Chef Julia",
          image: "https://images.unsplash.com/photo-1578985545062-699937241d57?w=400",
          rating: 4.9,
          time: "25 min",
          difficulty: "Hard",
          liked: false
        },
        {
          id: 3,
          name: "Fresh Caesar Salad",
          chef: "Chef Gordon",
          image: "https://images.unsplash.com/photo-1550304943-4f24f2dd45bb?w=400",
          rating: 4.6,
          time: "15 min",
          difficulty: "Easy",
          liked: false
        }
      ])
    }
  }

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 6
  }

  const validateForm = () => {
    const errors: any = {}

    if (authMode === 'signup') {
      if (!formData.firstName.trim()) errors.firstName = 'First name is required'
      if (!formData.lastName.trim()) errors.lastName = 'Last name is required'
      if (!validateEmail(formData.email)) errors.email = 'Valid email is required'
      if (!validatePassword(formData.password)) errors.password = 'Password must be at least 6 characters'
      if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match'
      if (!formData.agreeTerms) errors.agreeTerms = 'You must agree to the terms'
    } else {
      if (!validateEmail(formData.email)) errors.email = 'Valid email is required'
      if (!formData.password) errors.password = 'Password is required'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')
    
    if (validateForm()) {
      setIsSubmitting(true)
      
      try {
        if (authMode === 'signup') {
          // Simulate API call for now
          setTimeout(() => {
            setIsSubmitting(false)
            setAuthSuccess(true)
            setFormData({
              email: '',
              password: '',
              confirmPassword: '',
              firstName: '',
              lastName: '',
              agreeTerms: false
            })
            setFormErrors({})
          }, 1500)
        } else {
          // Simulate login
          setTimeout(() => {
            setIsSubmitting(false)
            
            // Store mock user data in localStorage
            const mockUser = {
              id: 1,
              firstName: formData.firstName || 'kripa',
              lastName: formData.lastName || 'User',
              email: formData.email,
              isChef: true
            }
            
            localStorage.setItem('token', 'mock-jwt-token')
            localStorage.setItem('user', JSON.stringify(mockUser))
            
            // Trigger storage event to notify App component
            window.dispatchEvent(new Event('storage'))
            
            // Redirect to dashboard
            navigate('/dashboard')
            setShowAuthModal(false)
            setFormData({
              email: '',
              password: '',
              confirmPassword: '',
              firstName: '',
              lastName: '',
              agreeTerms: false
            })
            setFormErrors({})
          }, 1500)
        }
      } catch (error: any) {
        setApiError(error.message || 'An error occurred')
        setIsSubmitting(false)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev: any) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSwitchToLogin = () => {
    setAuthMode('login')
    setAuthSuccess(false)
    setFormErrors({})
    setApiError('')
  }

  const handleCloseModal = () => {
    setShowAuthModal(false)
    setAuthSuccess(false)
    setFormErrors({})
    setApiError('')
  }

  const handleViewRecipe = (recipe: any) => {
    // Try to get full recipe details from dashboard recipes
    const dashboardRecipes = localStorage.getItem('dashboardRecipes')
    if (dashboardRecipes) {
      const dashboardRecipesArray = JSON.parse(dashboardRecipes)
      const fullRecipe = dashboardRecipesArray.find((r: any) => r.id === recipe.id)
      if (fullRecipe) {
        // Merge the published recipe with full details from dashboard
        setSelectedRecipe({
          ...recipe,
          description: fullRecipe.description || recipe.description || '',
          ingredients: fullRecipe.ingredients || recipe.ingredients || '',
          instructions: fullRecipe.instructions || recipe.instructions || '',
          prepTime: fullRecipe.prepTime || recipe.prepTime || '',
          cookTime: fullRecipe.cookTime || recipe.cookTime || '',
          servings: fullRecipe.servings || recipe.servings || '',
          category: fullRecipe.category || recipe.category || '',
          tags: fullRecipe.tags || recipe.tags || ''
        })
      } else {
        setSelectedRecipe(recipe)
      }
    } else {
      setSelectedRecipe(recipe)
    }
    setShowRecipeModal(true)
  }

  const handleCloseRecipeModal = () => {
    setShowRecipeModal(false)
    setSelectedRecipe(null)
  }
  
  
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-orange-400 to-green-400 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Discover Amazing Recipes</h1>
          <p className="text-xl mb-8">Share your culinary creations with the world</p>
          <div className="flex justify-center gap-4">
            <button className="bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Explore Recipes
            </button>
            <button 
              className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-500 transition"
              onClick={() => setShowAuthModal(true)}
            >
              Share Your Recipe
            </button>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-3xl font-bold mb-2">500+</h3>
              <p className="text-lg">Expert Chefs</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-3xl font-bold mb-2">10,000+</h3>
              <p className="text-lg">Recipes</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-3xl font-bold mb-2">1M+</h3>
              <p className="text-lg">Active Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Browse by Category */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Browse by Category</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-6 py-2 rounded-full font-medium transition ${
                index === 0 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Recipes */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Recipes</h2>
          <button className="text-orange-500 font-semibold hover:underline">
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredRecipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer" onClick={() => handleViewRecipe(recipe)}>
              <div className="relative">
                <img 
                  src={recipe.image} 
                  alt={recipe.name}
                  className="w-full h-48 object-cover"
                />
                <button 
                  className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition"
                  onClick={(e) => {
                    e.stopPropagation()
                    // Handle like functionality
                  }}
                >
                  <Heart 
                    className={`w-5 h-5 ${recipe.liked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                  />
                </button>
                {recipe.difficulty && (
                  <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
                    recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                    recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {recipe.difficulty}
                  </span>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{recipe.name}</h3>
                <p className="text-gray-600 text-sm mb-3">by {recipe.chef}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{recipe.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{recipe.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Recipe Nest</h3>
              <p className="text-gray-400">Discover, share, and enjoy amazing recipes from around the world.</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Explore</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">All Recipes</a></li>
                <li><a href="#" className="hover:text-white transition">Chefs</a></li>
                <li><a href="#" className="hover:text-white transition">Categories</a></li>
                <li><a href="#" className="hover:text-white transition">Design System</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Recipe Nest. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                {authSuccess ? 'Success!' : authMode === 'login' ? 'Sign In' : 'Sign Up'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {authSuccess ? (
                // Success State
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Account Created Successfully!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Your {userType === 'chef' ? 'chef' : 'user'} account has been created successfully. You can now log in and start sharing your amazing recipes!
                  </p>
                  <button
                    onClick={handleSwitchToLogin}
                    className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
                  >
                    Go to Login
                  </button>
                </div>
              ) : (
                // Auth Form
                <form onSubmit={handleSubmit}>
                  {/* API Error Display */}
                  {apiError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm">{apiError}</p>
                    </div>
                  )}

                  {/* User Type Selection (only for signup) */}
                  {authMode === 'signup' && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        I want to sign up as:
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setUserType('normal')}
                          className={`p-3 rounded-lg border-2 transition ${
                            userType === 'normal'
                              ? 'border-orange-500 bg-orange-50 text-orange-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <User className="w-6 h-6 mx-auto mb-2" />
                          <span className="text-sm font-medium">Normal User</span>
                          <p className="text-xs text-gray-500 mt-1">Browse and save recipes</p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setUserType('chef')}
                          className={`p-3 rounded-lg border-2 transition ${
                            userType === 'chef'
                              ? 'border-orange-500 bg-orange-50 text-orange-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Star className="w-6 h-6 mx-auto mb-2" />
                          <span className="text-sm font-medium">Chef</span>
                          <p className="text-xs text-gray-500 mt-1">Share your recipes</p>
                        </button>
                      </div>
                    </div>
                  )}

                  {authMode === 'signup' && (
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <input
                          type="text"
                          name="firstName"
                          placeholder="First Name"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                            formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {formErrors.firstName && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Last Name"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                            formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {formErrors.lastName && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <input
                      type="text"
                      name="email"
                      placeholder="Email or Username"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                          formErrors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <X className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {formErrors.password && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                    )}
                  </div>

                  {authMode === 'signup' && (
                    <div className="mb-4">
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                            formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? (
                            <X className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {formErrors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>
                      )}
                    </div>
                  )}

                  {authMode === 'signup' && (
                    <div className="mb-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="agreeTerms"
                          checked={formData.agreeTerms}
                          onChange={handleInputChange}
                          className={`mr-2 ${formErrors.agreeTerms ? 'border-red-500' : ''}`}
                        />
                        <span className="text-sm text-gray-600">
                          I agree to the{' '}
                          <a href="#" className="text-orange-600 hover:underline">
                            Terms of Service
                          </a>{' '}
                          and{' '}
                          <a href="#" className="text-orange-600 hover:underline">
                            Privacy Policy
                          </a>
                        </span>
                      </label>
                      {formErrors.agreeTerms && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.agreeTerms}</p>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {authMode === 'login' ? 'Signing In...' : 'Creating Account...'}
                      </span>
                    ) : (
                      authMode === 'login' ? 'Sign In' : 'Sign Up'
                    )}
                  </button>
                </form>
              )}

              {/* Switch Auth Mode */}
              {!authSuccess && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button
                      onClick={() => {
                        setAuthMode(authMode === 'login' ? 'signup' : 'login')
                        setFormErrors({})
                      }}
                      className="text-orange-600 hover:underline font-medium"
                    >
                      {authMode === 'login' ? 'Sign Up' : 'Sign In'}
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recipe Detail Modal */}
      {showRecipeModal && selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="relative">
              <img 
                src={selectedRecipe.image} 
                alt={selectedRecipe.name}
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <button
                onClick={handleCloseRecipeModal}
                className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition"
              >
                <X className="w-6 h-6" />
              </button>
              {selectedRecipe.difficulty && (
                <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedRecipe.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                  selectedRecipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {selectedRecipe.difficulty}
                </span>
              )}
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedRecipe.name}</h2>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-lg text-gray-600">by {selectedRecipe.chef}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{selectedRecipe.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="w-5 h-5" />
                      <span>{selectedRecipe.time}</span>
                    </div>
                  </div>
                </div>
                
                {selectedRecipe.category && (
                  <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedRecipe.category}
                  </span>
                )}
              </div>

              {selectedRecipe.description && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{selectedRecipe.description}</p>
                </div>
              )}

              {/* Recipe Details Grid */}
              {(selectedRecipe.prepTime || selectedRecipe.cookTime || selectedRecipe.servings) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {selectedRecipe.prepTime && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-1">Prep Time</h4>
                      <p className="text-gray-700">{selectedRecipe.prepTime}</p>
                    </div>
                  )}
                  {selectedRecipe.cookTime && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-1">Cook Time</h4>
                      <p className="text-gray-700">{selectedRecipe.cookTime}</p>
                    </div>
                  )}
                  {selectedRecipe.servings && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-1">Servings</h4>
                      <p className="text-gray-700">{selectedRecipe.servings}</p>
                    </div>
                  )}
                </div>
              )}

              {selectedRecipe.ingredients && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Ingredients</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-line">{selectedRecipe.ingredients}</p>
                  </div>
                </div>
              )}

              {selectedRecipe.instructions && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Instructions</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-line">{selectedRecipe.instructions}</p>
                  </div>
                </div>
              )}

              {selectedRecipe.tags && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecipe.tags.split(',').map((tag: string, index: number) => (
                      <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Show message if details are missing */}
              {!selectedRecipe.description && !selectedRecipe.ingredients && !selectedRecipe.instructions && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800">
                    <strong>Note:</strong> This recipe was published before the detailed view was implemented. 
                    To see full details, please edit and republish this recipe from the dashboard.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCloseRecipeModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Close
                </button>
                <button className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                  Save Recipe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
