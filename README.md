# TechBlog Backend

Express.js + MongoDB API for the TechBlog application.

## Quick Start

### With Docker (Recommended)

```bash
# Clone the repo and run
docker-compose up -d

# View logs
docker-compose logs -f backend
```

### Local Development

```bash
# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Run in development mode
npm run dev
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 5000 | Server port |
| NODE_ENV | development | Environment |
| MONGO_URI | mongodb://admin:admin123@localhost:27017/techblog?authSource=admin | MongoDB connection string |

## API Endpoints

### Posts
- `GET /api/posts` - Get all published posts
- `GET /api/posts/featured` - Get featured posts
- `GET /api/posts/slug/:slug` - Get post by slug
- `GET /api/posts/category/:category` - Get posts by category
- `GET /api/posts/search?q=` - Search posts
- `GET /api/posts/admin/all` - Get all posts (admin)
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `PATCH /api/posts/:id/featured` - Toggle featured

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Health
- `GET /api/health` - API health check

## Docker Commands

```bash
# Build and start
docker-compose up -d

# Stop
docker-compose down

# Rebuild
docker-compose build

# View logs
docker-compose logs -f
```

## Default Admin Account

Created automatically on first run:
- Name: Admin
- Email: admin@techblog.local