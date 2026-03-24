import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, BookOpen, Grid, Users, BarChart3, LogOut, Plus, ChevronDown, ChevronRight, Globe, Zap, Shield, X, Bell, Star } from 'lucide-react'

const Dashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState(true)
  const [publicVisibility, setPublicVisibility] = useState(true)
  const [autoPublish, setAutoPublish] = useState(false)
  const [advancedMode, setAdvancedMode] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [newCategory, setNewCategory] = useState('')
  const [categoriesExpanded, setCategoriesExpanded] = useState(false)
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false)
  const [isEditingRecipe, setIsEditingRecipe] = useState(false)
  const [editingRecipeId, setEditingRecipeId] = useState<number | null>(null)
  const [recipeForm, setRecipeForm] = useState({
    name: '',
    description: '',
    ingredients: '',
    instructions: '',
    prepTime: '',
    cookTime: '',
    servings: '',
    category: '',
    difficulty: 'Easy',
    imageUrl: ''
  })
  const [activeSection, setActiveSection] = useState('dashboard')
  const [stats, setStats] = useState({
    totalRecipes: 0,
    totalCategories: 0,
    activeUsers: 0,
    avgRating: 0
  })
  const [recentRecipes, setRecentRecipes] = useState<any[]>([])

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    loadRecipesFromStorage()
    loadCategoriesFromStorage()
  }, [])

  const loadRecipesFromStorage = () => {
    const storedRecipes = localStorage.getItem('dashboardRecipes')
    const storedStats = localStorage.getItem('dashboardStats')
    if (storedRecipes) {
      setRecentRecipes(JSON.parse(storedRecipes))
    }
    if (storedStats) {
      setStats(JSON.parse(storedStats))
    } else {
      setStats({ totalRecipes: 0, totalCategories: 0, activeUsers: 1, avgRating: 0 })
    }
  }

  const saveRecipesToStorage = (recipes: any[]) => {
    localStorage.setItem('dashboardRecipes', JSON.stringify(recipes))
  }

  const saveStatsToStorage = (newStats: any) => {
    localStorage.setItem('dashboardStats', JSON.stringify(newStats))
  }

  const loadCategoriesFromStorage = () => {
    const storedCategories = localStorage.getItem('userCategories')
    if (storedCategories) {
      const categoriesList = JSON.parse(storedCategories)
      setCategories(categoriesList)
      updateCategoriesCount(categoriesList)
    } else {
      const defaultCategories = ['Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Drinks', 'Appetizers']
      setCategories(defaultCategories)
      localStorage.setItem('userCategories', JSON.stringify(defaultCategories))
      updateCategoriesCount(defaultCategories)
    }
  }

  const updateCategoriesCount = (categoriesList: string[]) => {
    setStats(prev => ({ ...prev, totalCategories: categoriesList.length }))
    const currentStats = localStorage.getItem('dashboardStats')
    const statsData = currentStats ? JSON.parse(currentStats) : {}
    localStorage.setItem('dashboardStats', JSON.stringify({ ...statsData, totalCategories: categoriesList.length }))
  }

  const saveCategoriesToStorage = (cats: string[]) => {
    localStorage.setItem('userCategories', JSON.stringify(cats))
    updateCategoriesCount(cats)
    window.dispatchEvent(new Event('storage'))
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.dispatchEvent(new Event('storage'))
    navigate('/')
  }

  const handleToggleCategories = () => {
    setCategoriesExpanded(!categoriesExpanded)
  }

  const handleCategoryClick = (category: string) => {
    console.log('Category clicked:', category)
  }

  const handleViewRecipe = (recipe: any) => {
    alert(`Viewing Recipe: ${recipe.name}\n\nDescription: ${recipe.description}\n\nIngredients: ${recipe.ingredients}\n\nInstructions: ${recipe.instructions}\n\nPrep Time: ${recipe.prepTime}\nCook Time: ${recipe.cookTime}\nServings: ${recipe.servings}\nCategory: ${recipe.category}\nDifficulty: ${recipe.difficulty}`)
  }

  const handleEditRecipe = (recipe: any) => {
    const shouldEdit = confirm(`Edit recipe: ${recipe.name}?`)
    if (shouldEdit) {
      setRecipeForm({
        name: recipe.name,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        category: recipe.category,
        difficulty: recipe.difficulty,
        imageUrl: recipe.imageUrl
      })
      setIsEditingRecipe(true)
      setEditingRecipeId(recipe.id)
      setShowAddRecipeModal(true)
    }
  }

  const handleAddRecipe = () => {
    setShowAddRecipeModal(true)
  }

  const handleRecipeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isEditingRecipe && editingRecipeId) {
      // Update existing recipe
      const updatedRecipes = recentRecipes.map(recipe =>
        recipe.id === editingRecipeId
          ? { ...recipe, ...recipeForm }
          : recipe
      )
      setRecentRecipes(updatedRecipes)
      saveRecipesToStorage(updatedRecipes)
      
      // Also update in published recipes if it exists there
      const existingPublished = localStorage.getItem('publishedRecipes')
      if (existingPublished) {
        const publishedRecipes = JSON.parse(existingPublished)
        const updatedPublishedRecipes = publishedRecipes.map((recipe: any) =>
          recipe.id === editingRecipeId
            ? { ...recipe, ...recipeForm }
            : recipe
        )
        localStorage.setItem('publishedRecipes', JSON.stringify(updatedPublishedRecipes))
        
        // Trigger storage event to update Home page
        window.dispatchEvent(new Event('storage'))
      }
      
      alert(`Recipe "${recipeForm.name}" updated successfully!`)
    } else {
      // Add new recipe
      const newRecipe = {
        id: Date.now(),
        ...recipeForm,
        status: 'Draft',
        time: recipeForm.prepTime + ' + ' + recipeForm.cookTime
      }
      const updatedRecipes = [...recentRecipes, newRecipe]
      setRecentRecipes(updatedRecipes)
      saveRecipesToStorage(updatedRecipes)
      const updatedStats = { ...stats, totalRecipes: stats.totalRecipes + 1 }
      setStats(updatedStats)
      saveStatsToStorage(updatedStats)
      alert(`Recipe "${recipeForm.name}" added successfully!`)
    }
    
    // Reset form and close modal
    setRecipeForm({
      name: '', description: '', ingredients: '', instructions: '',
      prepTime: '', cookTime: '', servings: '', category: '', difficulty: 'Easy', imageUrl: ''
    })
    setIsEditingRecipe(false)
    setEditingRecipeId(null)
    setShowAddRecipeModal(false)
  }

  const handleRecipeInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setRecipeForm(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setRecipeForm(prev => ({ ...prev, image: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeleteRecipe = (recipeId: number) => {
    const recipeToDelete = recentRecipes.find(recipe => recipe.id === recipeId)
    if (recipeToDelete) {
      const shouldDelete = confirm(`Are you sure you want to delete "${recipeToDelete.name}"?`)
      if (shouldDelete) {
        const updatedRecipes = recentRecipes.filter(recipe => recipe.id !== recipeId)
        setRecentRecipes(updatedRecipes)
        saveRecipesToStorage(updatedRecipes)
        const updatedStats = { ...stats, totalRecipes: stats.totalRecipes - 1 }
        setStats(updatedStats)
        saveStatsToStorage(updatedStats)
        const existingPublished = localStorage.getItem('publishedRecipes')
        if (existingPublished) {
          const filtered = JSON.parse(existingPublished).filter((r: any) => r.id !== recipeId)
          localStorage.setItem('publishedRecipes', JSON.stringify(filtered))
        }
        alert(`Recipe "${recipeToDelete.name}" deleted successfully!`)
      }
    }
  }

  const handleDeleteRecipeFromManagement = (recipeId: number) => {
    if (confirm('Are you sure you want to delete this recipe?')) {
      handleDeleteRecipe(recipeId)
    }
  }

  const handlePublishRecipe = (recipeId: number) => {
    const updatedRecipes = recentRecipes.map(recipe =>
      recipe.id === recipeId ? { ...recipe, status: 'Published' } : recipe
    )
    setRecentRecipes(updatedRecipes)
    saveRecipesToStorage(updatedRecipes)
    
    // Get the published recipe
    const publishedRecipe = updatedRecipes.find(recipe => recipe.id === recipeId)
    if (publishedRecipe) {
      // Add to published recipes in localStorage (for home page to display)
      const existingPublished = localStorage.getItem('publishedRecipes')
      const publishedRecipes = existingPublished ? JSON.parse(existingPublished) : []
      
      // Convert dashboard recipe to home page recipe format with full details
      const homePageRecipe = {
        id: publishedRecipe.id,
        name: publishedRecipe.name,
        chef: user?.firstName || 'Chef',
        image: publishedRecipe.image || "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400",
        rating: 4.5,
        time: "30 min",
        difficulty: publishedRecipe.difficulty || "Easy",
        description: publishedRecipe.description || '',
        ingredients: publishedRecipe.ingredients || '',
        instructions: publishedRecipe.instructions || '',
        prepTime: publishedRecipe.prepTime || '',
        cookTime: publishedRecipe.cookTime || '',
        servings: publishedRecipe.servings || '',
        category: publishedRecipe.category || '',
        tags: publishedRecipe.tags || ''
      }
      
      // Add to published recipes if not already there
      if (!publishedRecipes.find((r: any) => r.id === recipeId)) {
        publishedRecipes.push(homePageRecipe)
        localStorage.setItem('publishedRecipes', JSON.stringify(publishedRecipes))
        
        // Trigger storage event to notify Home component
        window.dispatchEvent(new Event('storage'))
      }
    }
    
    alert('Recipe published successfully!')
  }

  const handleManageCategories = () => setShowCategoryModal(true)

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updatedCategories = [...categories, newCategory.trim()]
      setCategories(updatedCategories)
      saveCategoriesToStorage(updatedCategories)
      setNewCategory('')
    }
  }

  const handleDeleteCategory = (categoryToDelete: string) => {
    const updatedCategories = categories.filter(cat => cat !== categoryToDelete)
    setCategories(updatedCategories)
    saveCategoriesToStorage(updatedCategories)
  }

  const menuItems = [
    { icon: Home, label: 'Dashboard', section: 'dashboard' },
    { icon: BookOpen, label: 'Recipes', section: 'recipes' },
    { icon: Grid, label: 'Categories', section: 'categories', expandable: true, expanded: categoriesExpanded, onClick: handleToggleCategories },
    { icon: Users, label: 'Users', section: 'users' },
    { icon: BarChart3, label: 'Analytics', section: 'analytics' },
    { icon: LogOut, label: 'Logout', section: '', onClick: handleLogout }
  ]

  const quickActions = [
    { icon: Grid, label: 'Manage Categories', onClick: handleManageCategories },
    { icon: Users, label: 'View Users', onClick: () => alert('Coming soon!') },
    { icon: BarChart3, label: 'View Analytics', onClick: () => alert('Coming soon!') }
  ]

  return (
    <div className="flex h-screen bg-gray-100">

      {/* ── Sidebar ── */}
      <div className="w-64 bg-gray-900 text-white fixed h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">CP</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold truncate">Welcome, {user?.firstName || 'Chef'}!</h2>
              <p className="text-gray-400 text-xs">{user?.isChef ? 'Chef Dashboard' : 'User Dashboard'}</p>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <div key={index}>
                <button
                  onClick={item.onClick || (() => setActiveSection(item.section))}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
                    activeSection === item.section && item.section !== ''
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.expandable && (
                    item.expanded
                      ? <ChevronDown className="w-4 h-4" />
                      : <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {item.label === 'Categories' && item.expanded && (
                  <div className="ml-4 mt-2 space-y-1">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition"
                      >
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>{category}</span>
                      </button>
                    ))}
                    <button
                      onClick={handleManageCategories}
                      className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm text-orange-400 hover:bg-gray-800 hover:text-orange-300 transition"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add New Category</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 ml-64 overflow-auto">

        {/* ── DASHBOARD SECTION ── */}
        {activeSection === 'dashboard' && (
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back, {user?.firstName || 'Chef'}!</p>
              </div>
              <button
                onClick={handleAddRecipe}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-orange-600 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Recipe</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg"><BookOpen className="w-6 h-6 text-blue-600" /></div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalRecipes}</p>
                    <p className="text-sm text-gray-600">Total Recipes</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg"><Grid className="w-6 h-6 text-green-600" /></div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
                    <p className="text-sm text-gray-600">Categories</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-lg"><Users className="w-6 h-6 text-purple-600" /></div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                    <p className="text-sm text-gray-600">Active Users</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-yellow-100 rounded-lg"><BarChart3 className="w-6 h-6 text-yellow-600" /></div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.avgRating}</p>
                    <p className="text-sm text-gray-600">Avg Rating</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Recipes */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-gray-800">Recent Recipes</h2>
                      <button onClick={() => setActiveSection('recipes')} className="text-orange-500 hover:underline">
                        View All
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    {recentRecipes.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No recipes yet. Add your first recipe!</p>
                    ) : (
                      <div className="space-y-4">
                        {recentRecipes.map((recipe) => (
                          <div key={recipe.id} className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{recipe.name}</h3>
                              <p className="text-sm text-gray-600">{recipe.time}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                recipe.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {recipe.status}
                              </span>
                              <button
                                onClick={() => handlePublishRecipe(recipe.id)}
                                className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition"
                              >
                                Publish
                              </button>
                              <button
                                onClick={() => handleDeleteRecipe(recipe.id)}
                                className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions + Settings */}
              <div>
                <div className="bg-white rounded-lg shadow mb-6">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Quick Actions</h2>
                  </div>
                  <div className="p-6 space-y-3">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={action.onClick}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg hover:bg-gray-50 transition"
                      >
                        <action.icon className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-700">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Settings & Preferences</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    {[
                      { icon: Bell, label: 'Notifications', value: notifications, setter: setNotifications },
                      { icon: Globe, label: 'Public Visibility', value: publicVisibility, setter: setPublicVisibility },
                      { icon: Zap, label: 'Auto-Publish', value: autoPublish, setter: setAutoPublish },
                      { icon: Shield, label: 'Advanced Mode', value: advancedMode, setter: setAdvancedMode },
                    ].map(({ icon: Icon, label, value, setter }) => (
                      <div key={label} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5 text-gray-600" />
                          <span className="text-gray-700">{label}</span>
                        </div>
                        <button
                          onClick={() => setter(!value)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-orange-500' : 'bg-gray-300'}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    ))}
                    {notifications && publicVisibility && (
                      <p className="mt-2 text-sm text-orange-500">You will receive notifications for new activities</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── RECIPES SECTION ── */}
        {activeSection === 'recipes' && (
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Recipe Management</h1>
                <p className="text-gray-600 mt-1">Manage all your recipes in one place</p>
              </div>
              <button
                onClick={handleAddRecipe}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-orange-600 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Recipe</span>
              </button>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">All Recipes</h2>
              </div>
              <div className="overflow-x-auto">
                {recentRecipes.length === 0 ? (
                  <p className="text-gray-500 text-center py-12">No recipes yet. Add your first recipe!</p>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Difficulty</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentRecipes.map((recipe) => (
                        <tr key={recipe.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <img
                              src={recipe.imageUrl || 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400'}
                              alt={recipe.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{recipe.name}</div>
                            <div className="text-sm text-gray-500">{recipe.time}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                              {recipe.category || 'Uncategorized'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                              recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {recipe.difficulty || 'Easy'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="ml-1 text-sm font-medium">4.5</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button onClick={() => handleViewRecipe(recipe)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">View</button>
                              <button onClick={() => handleEditRecipe(recipe)} className="text-green-600 hover:text-green-800 text-sm font-medium">Edit</button>
                              <button onClick={() => handleDeleteRecipeFromManagement(recipe.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── CATEGORIES SECTION ── */}
        {activeSection === 'categories' && (
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
                <p className="text-gray-600 mt-1">Manage your recipe categories</p>
              </div>
              <button
                onClick={handleManageCategories}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-orange-600 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div key={category} className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="font-medium text-gray-800">{category}</span>
                  </div>
                  <button onClick={() => handleDeleteCategory(category)} className="text-red-400 hover:text-red-600 transition">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── USERS SECTION ── */}
        {activeSection === 'users' && (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Users</h1>
            <p className="text-gray-600">User management coming soon!</p>
          </div>
        )}

        {/* ── ANALYTICS SECTION ── */}
        {activeSection === 'analytics' && (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Analytics</h1>
            <p className="text-gray-600">Analytics coming soon!</p>
          </div>
        )}

      </div>

      {/* ── ADD RECIPE MODAL ── */}
      {showAddRecipeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {isEditingRecipe ? 'Edit Recipe' : 'Add New Recipe'}
              </h2>
              <button onClick={() => setShowAddRecipeModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRecipeSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Name *</label>
                  <input
                    type="text" name="name" value={recipeForm.name}
                    onChange={handleRecipeInputChange} required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    name="category" value={recipeForm.category}
                    onChange={handleRecipeInputChange} required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <select
                    name="difficulty" value={recipeForm.difficulty}
                    onChange={handleRecipeInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Servings *</label>
                  <input
                    type="number" name="servings" value={recipeForm.servings}
                    onChange={handleRecipeInputChange} required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time</label>
                  <input
                    type="text" name="prepTime" value={recipeForm.prepTime}
                    onChange={handleRecipeInputChange} placeholder="e.g. 15 min"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cook Time</label>
                  <input
                    type="text" name="cookTime" value={recipeForm.cookTime}
                    onChange={handleRecipeInputChange} placeholder="e.g. 30 min"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    name="description" value={recipeForm.description}
                    onChange={handleRecipeInputChange} rows={2} required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients *</label>
                  <textarea
                    name="ingredients" value={recipeForm.ingredients}
                    onChange={handleRecipeInputChange} rows={3} required
                    placeholder="One ingredient per line"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instructions *</label>
                  <textarea
                    name="instructions" value={recipeForm.instructions}
                    onChange={handleRecipeInputChange} rows={3} required
                    placeholder="Step-by-step instructions"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Image</label>
                  <input
                    type="file" accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddRecipeModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  {isEditingRecipe ? 'Update Recipe' : 'Add Recipe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CATEGORY MODAL ── */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Manage Categories</h2>
              <button onClick={() => setShowCategoryModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex space-x-2 mb-4">
                <input
                  type="text" value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                  placeholder="New category name"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button onClick={handleAddCategory} className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                  Add
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {categories.map((category) => (
                  <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">{category}</span>
                    <button onClick={() => handleDeleteCategory(category)} className="text-red-400 hover:text-red-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Dashboard
