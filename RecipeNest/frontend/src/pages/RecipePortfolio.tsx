import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Search, Star, Clock, Users, Share2, Heart, ChevronDown, ChevronUp } from 'lucide-react'

const RecipePortfolio = () => {
  const { id } = useParams<{ id: string }>()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('name')
  const [expandedRecipe, setExpandedRecipe] = useState<number | null>(null)

  // Mock chef data
  const chef = {
    id: parseInt(id || '1'),
    name: "Giovanni Rossi"
  }

  // Mock recipes data
  const recipes = [
    {
      id: 1,
      name: "Classic Carbonara",
      description: "Traditional Roman pasta dish with eggs, pecorino cheese, guanciale, and black pepper. A creamy, rich pasta that's simple yet elegant.",
      category: "Main Course",
      difficulty: "Medium",
      cookingTime: "25 min",
      servings: 4,
      rating: 4.8,
      likes: 234,
      image: "/api/placeholder/400/300",
      ingredients: ["Spaghetti", "Eggs", "Pecorino Romano", "Guanciale", "Black Pepper"],
      instructions: "Cook guanciale until crispy. Cook pasta al dente. Mix eggs and cheese. Combine all ingredients with pasta water."
    },
    {
      id: 2,
      name: "Margherita Pizza",
      description: "Classic Neapolitan pizza with San Marzano tomatoes, fresh mozzarella, basil, and olive oil on a wood-fired crust.",
      category: "Main Course",
      difficulty: "Hard",
      cookingTime: "90 min",
      servings: 2,
      rating: 4.9,
      likes: 456,
      image: "/api/placeholder/400/300",
      ingredients: ["Pizza Dough", "San Marzano Tomatoes", "Fresh Mozzarella", "Basil", "Olive Oil"],
      instructions: "Stretch dough, add toppings, bake in wood-fired oven at 485°C for 90 seconds."
    },
    {
      id: 3,
      name: "Tiramisu",
      description: "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream, dusted with cocoa.",
      category: "Dessert",
      difficulty: "Easy",
      cookingTime: "30 min",
      servings: 8,
      rating: 4.7,
      likes: 189,
      image: "/api/placeholder/400/300",
      ingredients: ["Ladyfingers", "Espresso", "Mascarpone", "Sugar", "Cocoa Powder", "Eggs"],
      instructions: "Layer coffee-soaked ladyfingers with mascarpone mixture. Refrigerate overnight. Dust with cocoa before serving."
    },
    {
      id: 4,
      name: "Risotto ai Funghi",
      description: "Creamy arborio rice risotto with mixed mushrooms, parmesan, and white wine. A comforting Northern Italian classic.",
      category: "Main Course",
      difficulty: "Medium",
      cookingTime: "35 min",
      servings: 4,
      rating: 4.6,
      likes: 167,
      image: "/api/placeholder/400/300",
      ingredients: ["Arborio Rice", "Mixed Mushrooms", "White Wine", "Parmesan", "Butter", "Onion"],
      instructions: "Sauté mushrooms, cook rice with wine and broth gradually, finish with butter and parmesan."
    },
    {
      id: 5,
      name: "Caprese Salad",
      description: "Simple Italian salad with fresh tomatoes, mozzarella, basil, and balsamic glaze. Perfect summer appetizer.",
      category: "Appetizer",
      difficulty: "Easy",
      cookingTime: "10 min",
      servings: 4,
      rating: 4.5,
      likes: 98,
      image: "/api/placeholder/400/300",
      ingredients: ["Tomatoes", "Fresh Mozzarella", "Basil", "Balsamic Glaze", "Olive Oil"],
      instructions: "Slice tomatoes and mozzarella, arrange with basil, drizzle with oil and balsamic."
    },
    {
      id: 6,
      name: "Osso Buco",
      description: "Braised veal shanks with vegetables, white wine, and broth. Served with gremolata and risotto milanese.",
      category: "Main Course",
      difficulty: "Hard",
      cookingTime: "2 hours",
      servings: 6,
      rating: 4.9,
      likes: 278,
      image: "/api/placeholder/400/300",
      ingredients: ["Veal Shanks", "Vegetables", "White Wine", "Broth", "Flour", "Gremolata"],
      instructions: "Brown veal shanks, braise with vegetables and wine for 2 hours until tender."
    }
  ]

  const categories = ['All', 'Appetizer', 'Main Course', 'Dessert']
  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'time', label: 'Cooking Time' },
    { value: 'difficulty', label: 'Difficulty' },
    { value: 'rating', label: 'Rating' }
  ]

  const filteredAndSortedRecipes = recipes
    .filter(recipe => {
      const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'time':
          return parseInt(a.cookingTime) - parseInt(b.cookingTime)
        case 'difficulty':
          const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 }
          return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - difficultyOrder[b.difficulty as keyof typeof difficultyOrder]
        case 'rating':
          return b.rating - a.rating
        default:
          return 0
      }
    })

  const toggleRecipeExpansion = (recipeId: number) => {
    setExpandedRecipe(expandedRecipe === recipeId ? null : recipeId)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-700'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700'
      case 'Hard':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{chef.name}'s Recipe Portfolio</h1>
          <p className="text-xl text-gray-600">Explore authentic Italian recipes crafted with passion</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search recipes..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>Sort by {option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedRecipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{recipe.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                    {recipe.difficulty}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {recipe.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                    <span>{recipe.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{recipe.cookingTime}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{recipe.servings}</span>
                  </div>
                </div>

                {/* Expandable Details */}
                <div className={`border-t pt-3 mt-3 ${expandedRecipe === recipe.id ? '' : 'hidden'}`}>
                  <div className="mb-3">
                    <h4 className="font-semibold text-gray-900 mb-2">Ingredients:</h4>
                    <div className="flex flex-wrap gap-1">
                      {recipe.ingredients.map((ingredient, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h4 className="font-semibold text-gray-900 mb-2">Instructions:</h4>
                    <p className="text-sm text-gray-600">{recipe.instructions}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleRecipeExpansion(recipe.id)}
                    className="flex items-center text-orange-500 hover:text-orange-600 text-sm font-medium"
                  >
                    {expandedRecipe === recipe.id ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-1" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-1" />
                        Show More
                      </>
                    )}
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center text-gray-500 hover:text-red-500 transition">
                      <Heart className="w-4 h-4 mr-1" />
                      <span className="text-sm">{recipe.likes}</span>
                    </button>
                    <button className="flex items-center text-gray-500 hover:text-blue-500 transition">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAndSortedRecipes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No recipes found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecipePortfolio
