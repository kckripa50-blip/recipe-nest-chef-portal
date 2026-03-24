import { useState } from 'react'
import { Search, MapPin, Star, BookOpen } from 'lucide-react'

const ChefsList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  
  const chefs = [
    {
      id: 1,
      name: "Giovanni Rossi",
      bio: "Passionate Italian chef with 15 years of experience in traditional and modern Italian cuisine. Specializing in handmade pasta and wood-fired pizzas.",
      recipeCount: 42,
      rating: 4.8,
      location: "Rome, Italy",
      image: "/api/placeholder/200/200"
    },
    {
      id: 2,
      name: "Marie Dubois",
      bio: "French pastry chef trained in Paris. Love creating delicate desserts and teaching the art of French baking to home cooks worldwide.",
      recipeCount: 38,
      rating: 4.9,
      location: "Paris, France",
      image: "/api/placeholder/200/200"
    },
    {
      id: 3,
      name: "Sarah Johnson",
      bio: "Wellness-focused chef creating nutritious and delicious meals. Expert in plant-based cooking and meal prep for busy professionals.",
      recipeCount: 56,
      rating: 4.7,
      location: "California, USA",
      image: "/api/placeholder/200/200"
    },
    {
      id: 4,
      name: "Michael Chen",
      bio: "Asian fusion specialist blending traditional Chinese techniques with modern culinary trends. Expert in wok cooking and dim sum.",
      recipeCount: 31,
      rating: 4.6,
      location: "Singapore",
      image: "/api/placeholder/200/200"
    },
    {
      id: 5,
      name: "Lisa Anderson",
      bio: "Farm-to-table advocate and seasonal cooking expert. Passionate about sustainable agriculture and local ingredient sourcing.",
      recipeCount: 29,
      rating: 4.8,
      location: "Oregon, USA",
      image: "/api/placeholder/200/200"
    },
    {
      id: 6,
      name: "Carlos Rodriguez",
      bio: "Mexican cuisine specialist preserving family recipes while adding modern twists. Expert in authentic tacos and regional Mexican dishes.",
      recipeCount: 45,
      rating: 4.9,
      location: "Mexico City, Mexico",
      image: "/api/placeholder/200/200"
    }
  ]

  const filteredChefs = chefs.filter(chef =>
    chef.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chef.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chef.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Expert Chefs</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover talented chefs from around the world and explore their unique culinary creations
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search chefs by name, location, or specialty..."
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Chefs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredChefs.map((chef) => (
            <div key={chef.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={chef.image}
                    alt={chef.name}
                    className="w-20 h-20 rounded-full object-cover mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{chef.name}</h3>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {chef.location}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {chef.bio}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    <span>{chef.recipeCount} recipes</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                    <span>{chef.rating}</span>
                  </div>
                </div>
                
                <button className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredChefs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No chefs found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChefsList
