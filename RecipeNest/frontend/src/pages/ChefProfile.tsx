import { useParams } from 'react-router-dom'
import { MapPin, Star, BookOpen, Facebook, Instagram, Twitter, Globe } from 'lucide-react'

const ChefProfile = () => {
  const { id } = useParams<{ id: string }>()

  // Mock chef data - in real app, this would come from API
  const chef = {
    id: parseInt(id || '1'),
    name: "Giovanni Rossi",
    bio: "Giovanni Rossi is a passionate Italian chef with over 15 years of experience in both traditional and modern Italian cuisine. Born and raised in Rome, Giovanni learned the art of cooking from his grandmother, who taught him the importance of using fresh, high-quality ingredients and respecting traditional cooking methods.\n\nAfter graduating from the prestigious Culinary Institute of Italy, Giovanni worked in several Michelin-starred restaurants across Italy and France before opening his own restaurant in Rome. His philosophy is simple: 'Food should be honest, flavorful, and made with love.'\n\nGiovanni specializes in handmade pasta, wood-fired pizzas, and classic Italian desserts. He believes in preserving the authenticity of Italian cuisine while adding modern touches that appeal to contemporary palates. When he's not in the kitchen, Giovanni enjoys teaching cooking classes and sharing his knowledge with aspiring chefs.",
    recipeCount: 42,
    rating: 4.8,
    location: "Rome, Italy",
    image: "/api/placeholder/300/300",
    specialties: ["Italian Cuisine", "Handmade Pasta", "Wood-fired Pizza", "Italian Desserts"],
    socialLinks: {
      facebook: "https://facebook.com/giovannirossi",
      instagram: "https://instagram.com/giovannirossi",
      twitter: "https://twitter.com/giovannirossi",
      website: "https://giovannirossi.com"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Chef Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-orange-400 to-green-400 h-32"></div>
          <div className="px-8 pb-8">
            <div className="flex items-end -mt-16 mb-6">
              <img
                src={chef.image}
                alt={chef.name}
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
              <div className="ml-6 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{chef.name}</h1>
                <div className="flex items-center text-gray-600 mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {chef.location}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {chef.bio}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {chef.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-gray-600" />
                      <span className="text-gray-700">Recipes</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{chef.recipeCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 mr-2 fill-yellow-400 text-yellow-400" />
                      <span className="text-gray-700">Rating</span>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{chef.rating}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow</h3>
                  <div className="space-y-3">
                    <a
                      href={chef.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-700 transition"
                    >
                      <Facebook className="w-5 h-5 mr-2" />
                      Facebook
                    </a>
                    <a
                      href={chef.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-pink-600 hover:text-pink-700 transition"
                    >
                      <Instagram className="w-5 h-5 mr-2" />
                      Instagram
                    </a>
                    <a
                      href={chef.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sky-600 hover:text-sky-700 transition"
                    >
                      <Twitter className="w-5 h-5 mr-2" />
                      Twitter
                    </a>
                    <a
                      href={chef.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-600 hover:text-gray-700 transition"
                    >
                      <Globe className="w-5 h-5 mr-2" />
                      Website
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* View Recipes Button */}
        <div className="text-center">
          <button className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition">
            View Recipe Portfolio
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChefProfile
