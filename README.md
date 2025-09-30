# ZenithFlix - AI-Driven Streaming Platform

A modern, full-stack streaming platform built with NestJS, Next.js, PostgreSQL, and Tailwind CSS. This project showcases advanced web development patterns, including server-side rendering, real-time UI interactions, comprehensive testing, and secure API design.

## 🚀 Features

### Backend (NestJS)
- ✅ RESTful API with CRUD operations for streaming content
- ✅ PostgreSQL database with Prisma ORM
- ✅ JWT-based authentication with mocked guards
- ✅ Input validation using class-validator
- ✅ Global exception handling
- ✅ Security headers with Helmet
- ✅ CORS configuration
- ✅ Comprehensive unit and integration tests (Jest)
- ✅ Database seeding with sample movie data

### Frontend (Next.js)
- ✅ Server Components for optimal performance
- ✅ Responsive design with Tailwind CSS
- ✅ Interactive content browsing with horizontal scroll
- ✅ Loading skeletons for better UX
- ✅ Content modal with accessibility features (ARIA labels, keyboard navigation)
- ✅ Video player with React Player integration
  - Play/pause controls with visual feedback
  - Volume control with mute toggle
  - Progress bar with seek functionality
  - Time display (current/total duration)
  - Fullscreen toggle button
  - Custom controls overlay with smooth transitions
- ✅ Advanced video player features
  - Auto-hide controls after 3 seconds of inactivity
  - Controls reappear on mouse movement
  - Resume playback from last watched position
  - Click to pause/play (desktop) or show controls (mobile)
  - Double-click to toggle fullscreen
  - Keyboard shortcuts (Space for play/pause, Escape to close)
  - Mobile-responsive behavior (touch-optimized controls)
  - Cursor hides when controls are hidden
  - Controls stay visible when paused
- ✅ Watch history tracking using localStorage
- ✅ Custom React hooks (useWatchHistory)
- ✅ Hover animations and transitions
- ✅ Dark theme optimized for streaming
- ✅ Unit tests with Vitest and React Testing Library

## 📋 Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Git

## 🛠️ Technology Stack

### Backend
- **Framework**: NestJS 11
- **Database**: PostgreSQL 16
- **ORM**: Prisma 6
- **Authentication**: Passport JWT
- **Validation**: class-validator, class-transformer
- **Testing**: Jest, Supertest
- **Security**: Helmet

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Testing**: Vitest, React Testing Library
- **UI Components**: Custom React components with accessibility

## 📦 Project Structure

```
streaming-platform/
├── backend/                  # NestJS API
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.ts          # Sample data
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/        # JWT authentication
│   │   │   └── streaming/   # Streaming content CRUD
│   │   ├── prisma/          # Prisma service
│   │   └── main.ts          # Application entry
│   └── test/                # E2E tests
├── frontend/                # Next.js app
│   ├── app/
│   │   ├── page.tsx         # Main page
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── Header/          # Navigation header
│   │   ├── ContentCard/     # Content thumbnail
│   │   ├── ContentGrid/     # Scrollable content row
│   │   ├── ContentModal/    # Detail modal
│   │   ├── LoadingSkeleton/ # Loading state
│   │   └── WatchHistory/    # Continue watching
│   ├── hooks/
│   │   └── useWatchHistory.ts  # Watch progress hook
│   ├── types/               # TypeScript types
│   ├── utils/               # API utilities
│   └── __tests__/           # Unit tests
└── docker-compose.yml       # PostgreSQL container
```

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd streaming-platform
```

### 2. Start PostgreSQL Database

```bash
docker-compose up -d
```

This will start a PostgreSQL container on port 5432.

### 3. Backend Setup

```bash
cd backend
npm install

# Run database migrations
npx prisma migrate dev

# Seed database with sample content
npm run prisma:seed

# Start development server
npm run start:dev
```

The backend API will be available at `http://localhost:3001`.

#### Backend Environment Variables

The `.env` file is already configured with:
```env
DATABASE_URL="postgresql://zenithflix:zenithflix123@localhost:5432/zenithflix?schema=public"
JWT_SECRET="zenithflix-super-secret-jwt-key-change-in-production"
PORT=3001
```

### 4. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`.

#### Frontend Environment Variables

The `.env.local` file is already configured:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 5. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api/streaming

## 🧪 Running Tests

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e
```

### Frontend Tests

```bash
cd frontend

# Run unit tests
npm test

# Run tests with UI
npm run test:ui
```

## 📚 API Documentation

### Base URL
```
http://localhost:3001
```

### Endpoints

#### GET /api/streaming
Get all streaming content

**Response**: 200 OK
```json
[
  {
    "id": "uuid",
    "title": "Movie Title",
    "description": "Description",
    "thumbnailUrl": "https://...",
    "videoUrl": "https://...",
    "year": 2024,
    "genre": "Action",
    "rating": 8.5,
    "duration": 120,
    "cast": ["Actor 1", "Actor 2"],
    "watchProgress": 0,
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

#### GET /api/streaming/:id
Get a single content item by ID

**Response**: 200 OK (single content object) or 404 Not Found

#### POST /api/streaming
Create new streaming content (requires JWT token)

**Headers**:
```
Authorization: Bearer <token>
```

**Body**:
```json
{
  "title": "string",
  "description": "string",
  "thumbnailUrl": "string (URL)",
  "videoUrl": "string (URL)",
  "year": 2024,
  "genre": "string",
  "rating": 8.5,
  "duration": 120,
  "cast": ["string"]
}
```

**Response**: 201 Created

#### PUT /api/streaming/:id
Update streaming content (requires JWT token)

**Headers**:
```
Authorization: Bearer <token>
```

**Body**: Partial content object

**Response**: 200 OK

#### DELETE /api/streaming/:id
Delete streaming content (requires JWT token)

**Headers**:
```
Authorization: Bearer <token>
```

**Response**: 200 OK

## 🏗️ Architecture Decisions

### Backend

1. **NestJS Framework**: Chosen for its enterprise-grade architecture, built-in dependency injection, and excellent TypeScript support.

2. **Prisma ORM**: Selected over TypeORM for:
   - Better TypeScript integration
   - Automatic type generation
   - Intuitive migration system
   - Better developer experience

3. **Layered Architecture**:
   - Controllers handle HTTP requests/responses
   - Services contain business logic
   - DTOs validate and transform data
   - Modular structure for scalability

4. **JWT Authentication**: Mocked implementation to satisfy requirements without adding complexity of user management. Production apps would integrate with a user service.

5. **Global Validation Pipe**: Ensures all incoming data is validated at the application level, reducing boilerplate code.

### Frontend

1. **Next.js App Router**: Leverages React Server Components for:
   - Improved performance
   - Better SEO
   - Reduced client-side JavaScript

2. **Client Components for Interactivity**: Used strategically for:
   - Modal interactions
   - Scroll functionality
   - localStorage operations

3. **Custom Hooks**: `useWatchHistory` encapsulates localStorage logic, making it reusable and testable.

4. **Tailwind CSS**: Rapid UI development with:
   - Consistent design system
   - Responsive utilities
   - Custom animations

5. **No External State Management**: React's built-in state management (useState, useEffect, useMemo) is sufficient for this application's complexity.

6. **React Player**: Selected for video playback functionality due to:
   - Multi-source support (YouTube, Vimeo, MP4, HLS, DASH, etc.)
   - Lightweight and well-maintained library
   - Simple API for custom controls
   - Built-in progress tracking and seek functionality
   - Cross-browser compatibility
   - Active development and community support

## 🎨 Design Decisions

### UX Patterns

1. **Netflix-Inspired Layout**: Users are familiar with this pattern, reducing cognitive load.

2. **Horizontal Scrolling**: Maximizes screen real estate and follows established streaming platform conventions.

3. **Loading Skeletons**: Provides visual feedback during data fetching, improving perceived performance.

4. **Hover Effects**: Scale and shadow effects provide clear affordance for clickable elements.

5. **Watch Progress Bars**: Visual indicators help users resume content where they left off.

### Accessibility

1. **Keyboard Navigation**: All interactive elements support Enter/Space key activation.

2. **ARIA Labels**: Screen reader support for buttons and modal dialogs.

3. **Focus Management**: Modal auto-focuses close button and traps focus within the modal.

4. **Semantic HTML**: Proper use of heading hierarchy and landmark elements.

## 🔐 Security Considerations

### Implemented

- Helmet middleware for security headers
- CORS configuration
- Input validation and sanitization
- Environment variable usage for secrets
- JWT token-based authentication

### Production Recommendations

- Use proper secrets management (e.g., AWS Secrets Manager)
- Implement rate limiting
- Add request logging and monitoring
- Use HTTPS everywhere
- Implement proper user authentication
- Add CSRF protection
- Sanitize database inputs
- Implement API versioning

## 🚧 Known Limitations & Future Enhancements

### Current Limitations

1. **Mock Authentication**: JWT authentication is mocked. Production would require user registration/login.

2. **Client-Side Watch History**: Uses localStorage. Production would sync with backend.

3. **Image Loading**: Uses external URLs. Production would use CDN with optimized images.

4. **No Pagination**: All content loads at once. Production would implement infinite scroll or pagination.

### Future Enhancements

- [ ] User authentication with registration/login
- [ ] Video player integration
- [ ] Backend watch history sync
- [ ] Search functionality
- [ ] Advanced filtering (by genre, year, rating)
- [ ] User profiles and recommendations
- [ ] Social features (sharing, reviews)
- [ ] Admin dashboard for content management
- [ ] Analytics and metrics
- [ ] Multi-language support
- [ ] Progressive Web App (PWA) features

## 📝 Development Notes

### Database Reset

If you need to reset the database:

```bash
cd backend
npx prisma migrate reset
npm run prisma:seed
```

### Stopping Services

```bash
# Stop Docker containers
docker-compose down

# Stop backend
Ctrl+C in backend terminal

# Stop frontend
Ctrl+C in frontend terminal
```

### Common Issues

**Port Already in Use:**
```bash
# Check what's using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>
```

**Database Connection Issues:**
```bash
# Restart PostgreSQL container
docker-compose restart postgres
```

## 👥 Contributing

This is an assessment project, but feedback and suggestions are welcome!

## 📄 License

This project is for assessment purposes only.

---

**Built with by Stefanos Costa**

*Last Updated: 2025-09-30*