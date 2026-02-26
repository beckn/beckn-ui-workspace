# Docker Setup Guide for DEG EV Charging App

This guide explains how to run the `deg-ev-charging` application using Docker.

## Prerequisites

- Docker (version 20.10+)
- Docker Compose (version 1.29+)
- Git

Install Docker and Docker Compose if not already installed:
- **macOS/Windows**: Download [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Linux**: Follow [official installation guide](https://docs.docker.com/engine/install/)

## Project Structure

```
beckn-ui-workspace/
├── Dockerfile                 # Multi-stage build configuration
├── docker-compose.yml         # Orchestrates all services
├── .dockerignore              # Files excluded from Docker build
├── apps/
│   └── deg-ev-charging/       # Main Next.js application
├── packages/                  # Shared packages (common, molecules, etc)
└── reference-bap-backend/     # Backend API (optional)
```

## Services in docker-compose.yml

1. **deg-ev-charging** (Port 3000)
   - Main Next.js frontend application
   - Built from Dockerfile (multi-stage build)
   - Connects to API on port 3001

2. **api** (Port 3001)
   - Backend Node.js server
   - Connects to MongoDB on port 27017
   - Uses reference-bap-backend code

3. **mongodb** (Port 27017)
   - Database for storing charger data, orders, users
   - Credentials: `admin` / `password`
   - Data persists in `mongodb_data` volume

4. **redis** (Port 6379)
   - In-memory cache for sessions and performance
   - Optional but recommended for production

## Quick Start

### 1. Build and Run All Services

```bash
cd /Users/kumarabhishek/Desktop/Beckn/beckn-ui-workspace

# Build Docker image and start all services
docker-compose up -d

# Check if all services are running
docker-compose ps
```

### 2. Access the Application

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001
- **MongoDB**: mongodb://admin:password@localhost:27017
- **Redis**: redis://localhost:6379

### 3. View Logs

```bash
# View logs from all services
docker-compose logs -f

# View logs from specific service
docker-compose logs -f deg-ev-charging
docker-compose logs -f api
docker-compose logs -f mongodb
```

### 4. Stop All Services

```bash
docker-compose down
```

### 5. Stop Services and Remove Data

```bash
# Remove containers, networks (keeps volumes)
docker-compose down

# Remove everything including data
docker-compose down -v
```

## Environment Variables

### For deg-ev-charging (Frontend)

Create `.env.local` in `apps/deg-ev-charging/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_key_here
```

### For API Backend

The docker-compose.yml sets these automatically:
- `NODE_ENV=production`
- `PORT=3001`
- `DB_HOST=mongodb`
- `DB_PORT=27017`
- `DB_NAME=beckn_db`

You can override by creating `.env` file or modifying docker-compose.yml.

## Build Process Explained

### Multi-Stage Dockerfile

The Dockerfile uses a 2-stage build for optimization:

**Stage 1: Builder**
- Uses Node 18 Alpine image (small footprint)
- Installs ALL dependencies (including dev dependencies)
- Builds the Next.js application
- Output: Built `.next` folder

**Stage 2: Production**
- Fresh Node 18 Alpine image
- Installs ONLY production dependencies
- Copies built app from builder stage
- Installs dumb-init for proper signal handling
- **Result**: Smaller production image (~500MB instead of 1GB+)

### Building Manually

```bash
# Build image without running
docker-compose build

# Build specific service
docker-compose build deg-ev-charging

# Build with no cache (full rebuild)
docker-compose build --no-cache
```

## Common Docker Commands

### Containers

```bash
# Start services in background
docker-compose up -d

# Start services in foreground (see logs)
docker-compose up

# Stop services
docker-compose stop

# Stop and remove containers
docker-compose down

# Remove containers and volumes
docker-compose down -v

# Show running containers
docker-compose ps

# Show all containers (including stopped)
docker-compose ps -a
```

### Logs and Debugging

```bash
# View logs (all services)
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# Logs from specific service
docker-compose logs -f deg-ev-charging

# View last 100 lines
docker-compose logs --tail 100

# View logs with timestamps
docker-compose logs -f --timestamps
```

### Executing Commands

```bash
# Execute command in running container
docker-compose exec deg-ev-charging yarn build

# Interactive shell in container
docker-compose exec deg-ev-charging sh

# Run command in new container
docker-compose run api yarn install
```

### Volumes and Data

```bash
# List all volumes
docker volume ls

# Remove unused volumes
docker volume prune

# Inspect MongoDB data volume
docker volume inspect beckn-ui-workspace_mongodb_data
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# Option 1: Change port in docker-compose.yml
# Change "3000:3000" to "3001:3000" (host:container)

# Option 2: Find and kill process using port
lsof -i :3000
kill -9 <PID>
```

### Application Won't Start

```bash
# Check container logs
docker-compose logs deg-ev-charging

# Rebuild without cache
docker-compose build --no-cache deg-ev-charging

# Stop everything and restart
docker-compose down -v
docker-compose up -d
```

### MongoDB Connection Error

```bash
# Check MongoDB logs
docker-compose logs mongodb

# Test MongoDB connection
docker-compose exec mongodb mongosh --username admin --password password

# Reset MongoDB
docker-compose down -v
docker-compose up -d mongodb
```

### Out of Disk Space

```bash
# Remove unused containers, networks, and images
docker system prune

# Remove everything (including volumes)
docker system prune -a --volumes
```

## Performance Optimization

### 1. Use BuildKit for Faster Builds

```bash
DOCKER_BUILDKIT=1 docker-compose build
```

### 2. Cache Layers Efficiently

The Dockerfile is optimized to:
- Install dependencies first (cached layer)
- Copy source code second (invalidates cache if files change)

### 3. Limit Memory Usage

Modify docker-compose.yml:

```yaml
deg-ev-charging:
  # ... other config ...
  deploy:
    resources:
      limits:
        cpus: '1'
        memory: 1G
      reservations:
        cpus: '0.5'
        memory: 512M
```

## Production Deployment

For production deployment:

1. **Use a proper database** (AWS RDS, Cloud SQL, etc)
2. **Use managed Redis** (AWS ElastiCache, Heroku Redis, etc)
3. **Add reverse proxy** (Nginx, HAProxy)
4. **Set up SSL/TLS** (Let's Encrypt)
5. **Use environment secrets** (Docker secrets or AWS Secrets Manager)
6. **Add monitoring** (Prometheus, Grafana)
7. **Add logging** (ELK Stack, CloudWatch)

Example production-ready compose file can be created on demand.

## Development Workflow

### Working with Docker during Development

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f deg-ev-charging

# Make code changes locally (in your editor)

# Restart the application container
docker-compose restart deg-ev-charging

# Or rebuild and restart
docker-compose up -d --build deg-ev-charging
```

### Hot Reload (if configured in Next.js)

The application supports hot reload:
- Edit files in `apps/deg-ev-charging/`
- Changes automatically reload in browser
- No container restart needed (in dev mode)

### Database Operations

```bash
# Access MongoDB shell
docker-compose exec mongodb mongosh --username admin --password password

# View all databases
> show databases

# Use beckn database
> use beckn_db

# View collections
> show collections

# Query data
> db.users.find()
```

## Useful Aliases

Add these to your `~/.zshrc` or `~/.bashrc`:

```bash
# Docker Compose shortcuts
alias dco='docker-compose'
alias dcup='docker-compose up -d'
alias dcdown='docker-compose down'
alias dclogs='docker-compose logs -f'
alias dcps='docker-compose ps'
alias dcexec='docker-compose exec'

# Usage: dco up -d
# Usage: dcup (same as docker-compose up -d)
# Usage: dcps (same as docker-compose ps)
```

## Next Steps

1. ✅ Run `docker-compose up -d`
2. ✅ Verify all services are healthy: `docker-compose ps`
3. ✅ Open http://localhost:3000 in browser
4. ✅ Check logs if issues: `docker-compose logs -f`
5. ✅ Stop services: `docker-compose down`

## Support

For issues:
1. Check service logs: `docker-compose logs <service_name>`
2. Ensure Docker Desktop is running
3. Try rebuilding: `docker-compose build --no-cache`
4. Check port availability: `lsof -i :3000`

---

**Last Updated**: February 25, 2026
**Docker Version**: 20.10+
**Docker Compose Version**: 1.29+
