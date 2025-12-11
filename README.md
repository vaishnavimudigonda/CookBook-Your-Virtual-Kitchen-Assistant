# CookBook Application - Full Stack

A modern React + TailwindCSS frontend with JSON Server backend for recipe management.

## Project Structure

```
cookbook/
├── project/               # Frontend (React + TailwindCSS)
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React contexts (Auth, Toast)
│   │   ├── lib/          # API clients (axios, MealDB)
│   │   ├── App.jsx       # Root component
│   │   └── main.jsx      # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── .env             # Frontend environment variables
│
└── backend/              # JSON Server backend
    ├── server.js         # REST API server
    ├── db.json           # Database (auto-generated)
    ├── seed.js           # Seed sample data
    ├── package.json
    └── .env             # Backend environment variables
```

## Features

- ✅ **Recipe Management**: Create, read, update, delete recipes (CRUD)
- ✅ **Favorites**: Mark recipes as favorites
- ✅ **Search & Filter**: Search by title, filter by category
- ✅ **Authentication**: JWT-based auth with JSON Server Auth
- ✅ **Responsive Design**: Mobile-friendly TailwindCSS UI
- ✅ **TheMealDB Integration**: Search suggestions from external API
- ✅ **Toast Notifications**: User feedback system
- ✅ **Clean JavaScript**: No TypeScript, pure JavaScript codebase

## API Endpoints

### Authentication
```
POST   /auth/register       Register new user
POST   /auth/login          Login user
```

### Recipes
```
GET    /recipes             Get all recipes
GET    /recipes/:id         Get single recipe
POST   /recipes             Create recipe
PUT    /recipes/:id         Update recipe
DELETE /recipes/:id         Delete recipe
```

### Favorites
```
GET    /favorites           Get all favorites
POST   /favorites           Add to favorites
DELETE /favorites/:id       Remove from favorites
```

## Installation & Setup

### Prerequisites
- Node.js 16+
- npm or yarn

### 1. Setup Backend

```bash
cd backend
npm install

# Seed sample data (optional)
npm run seed

# Start server (runs on port 3001)
npm start
```

### 2. Setup Frontend

```bash
cd project
npm install

# Install dependencies
npm install axios

# Create .env file (already created)
# VITE_API_URL=http://localhost:3001

# Start dev server (runs on port 5173)
npm run dev
```

### 3. Access Application

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001
```

### Backend (.env)
```
PORT=3001
NODE_ENV=development
```

## Available Scripts

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Backend
```bash
npm start        # Start server
npm run dev      # Start with watch mode
npm run seed     # Seed sample data
```

## Key Technologies

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons
- **React Context** - State management

### Backend
- **JSON Server** - Lightweight REST API
- **JSON Server Auth** - JWT authentication
- **Node.js** - JavaScript runtime

## Component Structure

### Pages
- `HomePage` - Hero section with featured recipes
- `RecipesPage` - Browse all recipes with filtering
- `RecipeDetailPage` - Single recipe with full details
- `RecipeFormPage` - Add/Edit recipe form
- `FavoritesPage` - User's favorite recipes

### Components
- `Header` - Navigation and search
- `RecipeCard` - Recipe list item
- `CategoryFilter` - Category filter buttons
- `Toast` - Notification system

### Contexts
- `AuthContext` - User authentication (JWT)
- `ToastContext` - Toast notifications

## Data Models

### Recipe
```javascript
{
  id: string,
  title: string,
  image_url: string,
  category: string,
  ingredients: string[],
  steps: string[],
  duration: number,
  difficulty: 'Easy' | 'Medium' | 'Hard',
  rating: number,
  is_favorite: boolean,
  created_at: string,
  updated_at: string
}
```

### User (from JSON Server Auth)
```javascript
{
  email: string,
  password: string (hashed)
}
```

## Features Implementation

### Authentication
- JWT tokens stored in localStorage
- Auto-refresh on app load
- Protected routes with AuthProvider
- Axios interceptor for token injection

### API Integration
- Axios with base configuration
- Error handling with toast notifications
- Token-based request headers
- TheMealDB integration for search suggestions

### UI/UX
- Responsive grid layouts
- Smooth transitions and animations
- Loading states with toast feedback
- Confirmation dialogs for destructive actions

## Next Steps

1. **Database**: Modify `backend/db.json` for custom data
2. **Authentication**: Implement login page in frontend
3. **Advanced Features**: Add ratings, reviews, sharing
4. **Deployment**: Deploy frontend to Vercel/Netlify, backend to Heroku
5. **Testing**: Add Jest/Vitest unit and integration tests

## Troubleshooting

### Backend not connecting
- Ensure backend runs on port 3001
- Check `VITE_API_URL` in frontend `.env`
- Use CORS-enabled endpoints

### CORS errors
- Backend server.js includes CORS middleware
- Vite dev server includes proxy config for `/auth`, `/recipes`, `/favorites`

### Port conflicts
- Change `PORT` in `backend/.env`
- Update `VITE_API_URL` accordingly

## License

MIT
