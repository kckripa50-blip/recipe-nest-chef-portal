# RecipeNest - Chef Portal

A complete Chef Portal web application built with React frontend and ASP.NET Core backend, featuring chef profiles, recipe management, and secure authentication.

## 🚀 Features

### Core Functionality
- **Chef Discovery**: Browse and search professional chefs
- **Recipe Portfolio**: View, filter, and sort recipes by chef
- **User Authentication**: Secure login/registration system
- **Chef Dashboard**: Manage profile and recipes (CRUD operations)
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### Important Features
- **Authentication System**
  - User Registration (Signup)
  - User Login (Signin)
  - Password encryption using bcrypt
  - Token-based authentication (JWT)
  - Authorization and protected routes

- **File Handling System**
  - File upload functionality
  - Upload and management of user profile images
  - Validation of file type and size
  - Proper storage and retrieval of uploaded files

## 🛠 Tech Stack

### Frontend
- **React.js** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons
- **Axios** - HTTP client

### Backend
- **ASP.NET Core 8.x** - Web API framework
- **C#** - Programming language
- **Entity Framework Core** - ORM
- **SQLite** - Database
- **JWT Authentication** - Security
- **bcrypt** - Password hashing

## 📁 Project Structure

```
RecipeNest/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   ├── package.json
│   └── vite.config.ts
├── backend/                 # ASP.NET Core Web API
│   ├── Controllers/         # API controllers
│   ├── Data/              # Database context
│   ├── Models/            # Data models
│   ├── Services/          # Business logic
│   ├── wwwroot/          # Static files
│   ├── Program.cs         # Application entry point
│   └── appsettings.json   # Configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- .NET 6.0 SDK
- Git

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Restore dependencies:
   ```bash
   dotnet restore
   ```

3. Run the application:
   ```bash
   dotnet run
   ```

4. The API will be available at `https://localhost:7123`

## 📱 Pages

### Main Pages
1. **Home Page** (`/`)
   - Hero section with call-to-action
   - Featured recipes grid
   - Category browsing
   - Statistics display

2. **Chefs List Page** (`/chefs`)
   - Grid layout of chef cards
   - Search functionality
   - 50-word bio snippets
   - Recipe count display

3. **Chef Profile Page** (`/chef/:id`)
   - Full chef biography
   - Profile picture and social links
   - Navigation to recipe portfolio

4. **Recipe Portfolio Page** (`/chef/:id/recipes`)
   - Interactive recipe cards with expandable details
   - Sorting by name, cooking time, difficulty
   - Category filtering
   - Social sharing buttons

5. **Chef Dashboard** (`/dashboard`)
   - Profile management
   - Recipe CRUD operations
   - Real-time updates
   - Protected authentication required

### Authentication Pages
- **Login** (`/login`)
- **Register** (`/register`)

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Chefs
- `GET /api/chefs` - Get all chefs
- `GET /api/chefs/{id}` - Get chef by ID
- `GET /api/chefs/{id}/recipes` - Get chef's recipes

### Recipes
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/{id}` - Get recipe by ID
- `POST /api/recipes` - Create new recipe (protected)
- `PUT /api/recipes/{id}` - Update recipe (protected)
- `DELETE /api/recipes/{id}` - Delete recipe (protected)

### Files
- `POST /api/files/upload` - Upload file (protected)
- `DELETE /api/files/{filePath}` - Delete file (protected)

## 🔧 Configuration

### Backend Configuration
Update `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=recipenest.db"
  },
  "JwtSettings": {
    "SecretKey": "YourSecretKeyHere",
    "Issuer": "RecipeNest",
    "Audience": "RecipeNestUsers"
  }
}
```

## 🎨 Design System

The application follows a modern, clean design with:
- **Primary Color**: Orange (#F97316)
- **Secondary Color**: Green (#22C55E)
- **Typography**: Clean, readable fonts
- **Spacing**: Consistent spacing using Tailwind CSS
- **Components**: Reusable UI components

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Protected API endpoints
- File upload validation
- CORS configuration
- Input validation

## 📝 Note

This project is designed as a university project demonstrating:
- Full-stack web development
- Modern web technologies
- Database integration
- Authentication and authorization
- File handling
- Responsive design
- API development

## 📄 License

This project is licensed under the MIT License.
