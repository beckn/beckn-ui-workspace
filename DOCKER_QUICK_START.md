# Quick Start - DEG EV Charging Frontend Only

Run the Next.js frontend app in Docker without backend services.

## Prerequisites

- Docker Desktop installed
- `docker-compose` available

## Quick Start (3 commands)

```bash
cd /Users/kumarabhishek/Desktop/Beckn/beckn-ui-workspace

# 1. Build the Docker image
docker-compose build

# 2. Start the container
docker-compose up -d

# 3. Open in browser
# http://localhost:3000
```

## Status & Logs

```bash
# Check if container is running
docker-compose ps

# View logs
docker-compose logs -f deg-ev-charging

# Stop container
docker-compose down
```

## Environment Variables

If you need to connect to a backend API on a different host:

Edit `docker-compose.yml` and change:
```yaml
environment:
  - NEXT_PUBLIC_API_URL=http://your-api-server:3001
```

## Port Mapping

- **Container Port**: 3000 (internal)
- **Host Port**: 3000 (your machine)

If port 3000 is already in use, change in `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Access via http://localhost:3001
```

## File Structure

- `Dockerfile` - Multi-stage build configuration
- `docker-compose.yml` - Single service (deg-ev-charging only)
- `.dockerignore` - Files to exclude from build

---

**That's it! The app will be running at http://localhost:3000**
