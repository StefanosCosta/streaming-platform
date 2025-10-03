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
- ✅ Watch history tracking with backend sync
  - localStorage for offline persistence
  - Automatic sync to backend database
  - Debounced updates (5s) during playback
  - Immediate sync on video close
- ✅ Custom React hooks (useWatchHistory)
- ✅ Hover animations and transitions
- ✅ Dark theme optimized for streaming
- ✅ Comprehensive testing suite
  - Unit tests with Vitest and React Testing Library
  - E2E tests with Playwright (27 tests across browsing, modals, and watch history)

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

You can run this application either with **Docker** (recommended) or **locally** with Node.js.

### Option A: Docker Setup (Recommended)

The easiest way to run the entire stack with a single command.

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd streaming-platform
```

#### 2. Start All Services with Docker Compose

```bash
docker-compose up --build
```

This will:
- Build Docker images for backend and frontend
- Start PostgreSQL database
- Run database migrations automatically
- Start backend API on port 3001
- Start frontend on port 3000

**First-time setup**: The initial build may take 5-10 minutes as Docker downloads base images and installs dependencies.

#### 3. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api/streaming

#### 4. Seed the Database (Optional)

To populate the database with sample content:

```bash
# Run seed script in the backend container
docker-compose exec backend npm run seed:prod
```

#### 5. View Logs

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

#### 6. Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v
```

### Option B: Local Setup (Development)

Run services locally with Node.js for development with hot reload.

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd streaming-platform
```

#### 2. Start PostgreSQL Database

```bash
docker-compose up -d postgres
```

This will start only the PostgreSQL container on port 5432.

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

**Note on Migrations**: Prisma migrations are idempotent through state tracking. Prisma maintains a `_prisma_migrations` table that records which migrations have been applied. When you run `npx prisma migrate dev` or `npx prisma migrate deploy`, Prisma automatically:
- Checks which migrations have already been applied
- Only executes new migrations that haven't run yet
- Skips previously applied migrations

This means you can safely run migrations multiple times without errors or data duplication. To check migration status, run:
```bash
npx prisma migrate status
```

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

## 🧪 Testing

This project includes comprehensive testing to meet and exceed the following requirements:

### ✅ Testing Requirements Met

**Required:**
- ✅ **Unit tests for at least one service**: `StreamingService` has 11 unit tests covering all CRUD operations
- ✅ **Integration test of at least one endpoint**: All 5 API endpoints have comprehensive E2E tests (32 tests total)

**Bonus:**
- ✅ **JWT Security Testing**: Comprehensive authentication tests including invalid tokens, expired tokens, malformed headers, and payload validation
- ✅ **Auth Component Unit Tests**: JwtStrategy (8 tests) and JwtAuthGuard (3 tests) fully covered

### Backend Test Coverage

#### Unit Tests

**StreamingService** (`streaming.service.spec.ts`) - 11 tests using Jest with mocked PrismaService:

- **create()** - 2 tests
  - ✅ Creates streaming content successfully
  - ✅ Throws BadRequestException on database error

- **findAll()** - 2 tests
  - ✅ Returns array of streaming content
  - ✅ Returns empty array when no content exists

- **findOne()** - 2 tests
  - ✅ Returns single content by ID
  - ✅ Throws NotFoundException when content not found

- **update()** - 2 tests
  - ✅ Updates streaming content successfully
  - ✅ Throws NotFoundException for non-existent content

- **remove()** - 2 tests
  - ✅ Deletes streaming content successfully
  - ✅ Throws NotFoundException for non-existent content

**JwtStrategy** (`jwt.strategy.spec.ts`) - 8 tests for JWT authentication strategy:

- **Initialization** - 2 tests
  - ✅ Strategy is defined
  - ✅ Retrieves JWT_SECRET from config service

- **validate()** - 6 tests
  - ✅ Returns user object with userId and username
  - ✅ Extracts sub as userId
  - ✅ Extracts username from payload
  - ✅ Handles payload with additional fields
  - ✅ Handles payload without username
  - ✅ Handles payload without sub

**JwtAuthGuard** (`jwt-auth.guard.spec.ts`) - 3 tests for authentication guard:

- ✅ Guard is defined
- ✅ Extends AuthGuard with jwt strategy
- ✅ Has canActivate method inherited from AuthGuard

#### E2E/Integration Tests

**All API Endpoints** (`streaming.e2e-spec.ts`) - 32 tests using Supertest with real application and JWT authentication:

- **GET /api/streaming** - 2 tests
  - ✅ Returns array of all streaming content
  - ✅ Returns proper content structure with all fields

- **GET /api/streaming/:id** - 2 tests
  - ✅ Returns single content by ID
  - ✅ Returns 404 for non-existent content

- **POST /api/streaming** - 6 tests
  - ✅ Creates content with valid JWT
  - ✅ Validates required fields
  - ✅ Validates URL formats
  - ✅ Validates year range (1900-2100)
  - ✅ Validates rating range (0-10)
  - ✅ Returns 401 without JWT

- **PUT /api/streaming/:id** - 5 tests
  - ✅ Updates content with valid JWT
  - ✅ Allows partial updates
  - ✅ Returns 404 for non-existent content
  - ✅ Validates data on update
  - ✅ Returns 401 without JWT

- **DELETE /api/streaming/:id** - 4 tests
  - ✅ Deletes content with valid JWT
  - ✅ Returns 404 for non-existent content
  - ✅ Returns 404 when deleting already deleted content
  - ✅ Returns 401 without JWT

- **JWT Authentication Security** - 14 tests
  - **Invalid JWT Tokens** - 5 tests
    - ✅ Rejects malformed token
    - ✅ Rejects token with wrong signature
    - ✅ Rejects expired token
    - ✅ Rejects random string as token
    - ✅ Rejects empty token
  - **Authorization Header Format** - 4 tests
    - ✅ Rejects token without Bearer prefix
    - ✅ Rejects wrong auth scheme
    - ✅ Rejects malformed authorization header
    - ✅ Rejects authorization header with extra content
  - **Token Payload Issues** - 2 tests
    - ✅ Rejects token with empty payload
    - ✅ Rejects token with missing sub field
  - **Security on All Protected Endpoints** - 2 tests
    - ✅ Rejects invalid token on PUT endpoint
    - ✅ Rejects invalid token on DELETE endpoint

### Frontend Test Coverage

#### Unit Tests
- **useWatchHistory hook** - Tests for localStorage operations and watch progress tracking
- **ContentModal component** - 12 tests covering rendering, interactions, accessibility, and edge cases
- Component tests using Vitest and React Testing Library

#### E2E Tests (Playwright)
- **Content Browsing** (`browsing.spec.ts`) - 8 tests
  - Homepage loading and navigation
  - Hero section with featured content
  - Multiple content sections by genre
  - Content cards with details
  - Horizontal scrolling functionality
  - Watch progress bars display
  - Keyboard navigation

- **Content Modal** (`modal.spec.ts`) - 12 tests
  - Modal opening and closing (click, backdrop, keyboard)
  - Content details display
  - ARIA attributes and accessibility
  - Focus management
  - Body scroll locking
  - Play button functionality

- **Watch History** (`watch-history.spec.ts`) - 7 tests
  - localStorage persistence
  - Continue Watching section display
  - Progress bar visualization
  - Resume from saved progress
  - Clear watch history
  - Progress updates on multiple watches

### Running Tests

**Recommended Setup for Testing:**

1. Start only the PostgreSQL container:
   ```bash
   docker-compose up -d postgres
   ```

2. Seed the database:
   ```bash
   cd backend
   npx prisma migrate dev
   npm run prisma:seed
   ```

3. Run backend manually (required for all tests):
   ```bash
   cd backend
   npm run start:dev
   ```

3. For **frontend unit tests**, no additional setup needed
4. For **frontend E2E tests**, do NOT start the frontend manually - Playwright starts its own server

This approach provides:
- Faster test execution (no Docker overhead)
- Better debugging experience
- Hot reload during development
- Direct access to test output

#### Backend Tests

```bash
cd backend

# Run all tests (unit + e2e)
npm test

# Run unit tests only
npm test streaming.service

# Run E2E tests only
npm run test:e2e

# Run tests with coverage report
npm run test:cov
```

#### Frontend Tests

```bash
cd frontend

# Run unit tests
npm test

# Run tests with UI
npm run test:ui

# Install Playwright browsers (first time only)
npx playwright install chromium

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI (interactive mode)
npm run test:e2e:ui

# Run E2E tests in headed mode (see browser)
npm run test:e2e:headed

# Run E2E tests in debug mode
npm run test:e2e:debug
```

**Important Notes on E2E Tests**:
- **Both backend AND frontend servers must be running** for E2E tests to pass
  - Backend: `cd backend && npm run start:dev` (runs on http://localhost:3001)
  - Frontend: `cd frontend && npm run dev` (runs on http://localhost:3000)
- The Playwright config will automatically start the frontend dev server if not already running
- Tests use Chromium browser by default
- First-time setup requires installing Playwright browsers with `npx playwright install chromium`
- E2E tests verify full stack functionality including watch history persistence to backend

## 📚 API Documentation

### Postman Collection

A complete Postman collection is available for testing all API endpoints.

**Location**: `backend/ZenithFlix-API.postman_collection.json`

#### Importing into Postman

1. Open Postman
2. Click the **Import** button in the top left corner
3. Select the **File** tab
4. Click **Choose Files** and navigate to `backend/ZenithFlix-API.postman_collection.json`
5. Click **Import**

The collection includes all endpoints for:
- Authentication (JWT login)
- Streaming content CRUD operations
- Watch progress tracking

#### Setting up Postman Environment (Optional)

Create a new environment with these variables for easier testing:
- `baseUrl`: `http://localhost:3001` (or your production URL)
- `authToken`: Your JWT token from the login endpoint

### Base URL
```
http://localhost:3001
```

### Authentication

All protected endpoints require a JWT token obtained from the login endpoint.

#### POST /api/auth/login
Authenticate and receive a JWT token

**Body**:
```json
{
  "email": "demo@zenithflix.com",
  "password": "DemoPass123!"
}
```

**Validation Rules**:
- `email`: Must be a valid email format
- `password`: Minimum 8 characters, must contain at least 1 uppercase letter, 1 lowercase letter, and 1 special character

**Response**: 201 Created
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": "1d"
}
```

**Note**: This is a mock implementation that accepts any credentials matching the validation rules. In production, this would validate against a user database.

### Streaming Content Endpoints

#### GET /api/streaming
Get all streaming content (public, no authentication required)

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
Get a single content item by ID (public, no authentication required)

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
Update streaming content with **full replacement** (requires JWT token)

**Headers**:
```
Authorization: Bearer <token>
```

**Body**: Complete content object (all fields required except watchProgress)

**Example**:
```json
{
  "title": "Updated Movie Title",
  "description": "Updated description",
  "thumbnailUrl": "https://example.com/thumbnail.jpg",
  "videoUrl": "https://example.com/video.mp4",
  "year": 2024,
  "genre": "Drama",
  "rating": 9.0,
  "duration": 135,
  "cast": ["Actor 1", "Actor 2"]
}
```

**Validation Rules**:
- All fields are required (except optional `watchProgress`)
- Returns 400 if any required field is missing
- This is a true PUT operation - entire resource is replaced

**Response**: 200 OK

#### DELETE /api/streaming/:id
Delete streaming content (requires JWT token)

**Headers**:
```
Authorization: Bearer <token>
```

**Response**: 200 OK

#### PATCH /api/streaming/:id/progress
Update watch progress for a content item (public, no authentication required)

**Body**:
```json
{
  "watchProgress": 67.5
}
```

**Validation Rules**:
- `watchProgress`: Number between 0 and 100 (percentage)

**Response**: 200 OK (returns updated content object)

**Note**: This endpoint is public to allow easy progress tracking from the frontend without authentication overhead. It only updates the `watchProgress` field and does not require JWT tokens.

## 🏗️ Architecture Decisions

### Backend

1. **NestJS Framework**: Chosen for its enterprise-grade architecture, built-in dependency injection, and excellent TypeScript support.

2. **Prisma ORM**: Selected over TypeORM for:
   - Better TypeScript integration
   - Automatic type generation
   - Intuitive migration system
   - Better developer experience

3. **UUID Primary Keys**: Using UUIDs instead of auto-increment integers for:
   - Globally unique identifiers across distributed systems
   - Better security (non-sequential, unpredictable IDs)
   - No collision risk when merging databases
   - Suitable for microservices architecture
   - Generated via Prisma's `@default(uuid())`

4. **Layered Architecture**:
   - Controllers handle HTTP requests/responses
   - Services contain business logic
   - DTOs validate and transform data
   - Modular structure for scalability

5. **JWT Authentication & Route Protection**:
   - **Public Routes**: GET endpoints (`/api/streaming`, `/api/streaming/:id`) are public for browsing content without authentication
   - **Protected Routes**: POST, PUT, DELETE endpoints require JWT authentication via `@UseGuards(JwtAuthGuard)` decorator
   - **Implementation**: Uses Passport JWT strategy with `JwtAuthGuard` extending `AuthGuard('jwt')`
   - **Demo Purpose**: JWT validation is mocked (no user database). Production systems would validate users against a database and implement proper authentication flows
   - **Security**: Token validation includes checking required payload fields (sub) and rejecting invalid/expired tokens

6. **Global Validation Pipe**: Ensures all incoming data is validated at the application level, reducing boilerplate code.

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

7. **Watch Progress Tracking Strategy**: localStorage-first with bi-directional sync
   - **Primary Storage**: Browser localStorage for fast, offline-capable tracking
   - **Backend Sync**: Automatic sync to database via `PATCH /api/streaming/:id/progress`
   - **Sync Behavior**:
     - **Frontend → Backend**: Debounced updates every 5 seconds during playback, immediate sync on video close
     - **Backend → Frontend**: On page load, syncs backend progress to localStorage if localStorage is empty
   - **Cross-Device Support**:
     - First-time load on new device automatically restores progress from backend
     - Enables seamless continuation across devices
   - **Rationale**:
     - Faster user experience (localStorage reads)
     - Works offline with backend backup
     - Automatic progress restoration on new devices

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
- JWT token-based authentication (symmetric HS256)

### Production Recommendations

- **JWT Security**: Use asymmetric keys (RS256) instead of symmetric keys for better security
  - Generate public/private key pairs
  - Store private keys securely in cloud secret management (AWS Secrets Manager, Azure Key Vault, Google Secret Manager, HashiCorp Vault)
  - Distribute only public keys to services that need to verify tokens
  - Rotate keys periodically
  - Use longer, randomly generated secrets (minimum 256 bits)
- Use proper secrets management (e.g., AWS Secrets Manager)
- Implement rate limiting
- Add request logging and monitoring
- Use HTTPS everywhere
- Implement proper user authentication
- Add CSRF protection
- Sanitize database inputs
- Implement API versioning

**Note**: This project currently uses a symmetric secret key (`JWT_SECRET`) stored in `.env` for simplicity. In production, asymmetric cryptography (RS256 with public/private key pairs) provides better security by separating signing (private key) from verification (public key) capabilities, and keys should be managed through cloud-based secret management services rather than environment files.

## 🚧 Known Limitations & Future Enhancements

### Current Limitations

1. **Mock Authentication**: JWT authentication is mocked. Production would require user registration/login.

2. **No RBAC for Content Management**: The backend CRUD endpoints (POST, PUT, DELETE) for streaming content are currently open for demo purposes. In production, these would be protected with Role-Based Access Control (RBAC), allowing only admin users to create, update, or delete movies from the database.

3. **No Authentication for Video Viewing**: Video viewing and progress tracking have no JWT protection for demo purposes. In production, video viewing functionality would require user login with watch history tied to authenticated user sessions.

4. **Watch History Storage**: Backend stores `watchProgress` directly on each content item with automatic debounced updates (5s during playback, immediate on close). Frontend uses localStorage for offline persistence and syncs with backend. In production, this would use a proper many-to-many relationship between Users/Profiles and Movies in the database to track individual watch history per user.

5. **Image Loading**: Uses external URLs. Production would use CDN with optimized images.

6. **No Pagination**: All content loads at once. Production would implement infinite scroll or pagination.

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

**Docker Setup:**
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v

# Rebuild after code changes
docker-compose up --build
```

**Local Setup:**
```bash
# Stop PostgreSQL container only
docker-compose down

# Stop backend
Ctrl+C in backend terminal

# Stop frontend
Ctrl+C in frontend terminal
```

### Common Issues

**Docker Issues:**

*Container fails to start:*
```bash
# View logs for specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Rebuild containers
docker-compose up --build --force-recreate
```

*Port already in use:*
```bash
# Stop all running containers
docker-compose down

# Check what's using the port
lsof -i :3000  # frontend
lsof -i :3001  # backend
lsof -i :5432  # postgres

# Kill the process
kill -9 <PID>
```

*Database connection issues:*
```bash
# Check if postgres is healthy
docker-compose ps

# Restart postgres
docker-compose restart postgres

# Reset database completely
docker-compose down -v
docker-compose up --build
```

*Changes not reflected:*
```bash
# Rebuild images after code changes
docker-compose up --build

# Clear cache and rebuild
docker-compose build --no-cache
docker-compose up
```

**Local Setup Issues:**

*Port already in use:*
```bash
# Check what's using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>
```

*Database connection issues:*
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