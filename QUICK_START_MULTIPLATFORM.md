# 🚀 Quick Start: Multi-Platform Build

## One-Command Build & Push

```bash
cd /Users/kumarabhishek/Desktop/Beckn/beckn-ui-workspace
./build-multiplatform.sh push
```

## What This Does

✅ Builds for both `linux/amd64` (Intel/AMD) and `linux/arm64` (Apple Silicon)  
✅ Pushes to Docker Hub as:
  - `fidedocker/deg-ev-charging:latest`
  - `fidedocker/deg-ev-charging:v1.0.0`

## Prerequisites

Make sure you're logged into Docker Hub:
```bash
docker login
# Enter your credentials
```

## Usage Options

```bash
# Build & push to Docker Hub
./build-multiplatform.sh push

# Build locally (no push, for testing)
./build-multiplatform.sh local

# View available images
./build-multiplatform.sh inspect

# Clean up builder
./build-multiplatform.sh clean
```

## Expected Output

```
========================================
Checking Docker buildx availability
========================================
✅ Docker buildx is available

========================================
Setting up multi-platform builder
========================================
ℹ️  Using existing builder: multiarch

========================================
Building multi-platform Docker image
========================================
ℹ️  Registry: fidedocker
ℹ️  Image: deg-ev-charging
ℹ️  Platforms: linux/amd64,linux/arm64
ℹ️  Tags: latest v1.0.0
ℹ️  Starting multi-platform build...
[... build output ...]
✅ Multi-platform build completed and pushed!
```

## Test on Your Mac (Apple Silicon)

After successful push:
```bash
docker pull fidedocker/deg-ev-charging:latest
docker run -p 3000:3000 fidedocker/deg-ev-charging:latest
# Open http://localhost:3000
```

## Troubleshooting

**Error: "buildx is not installed"**
```bash
docker buildx create --name multiarch --use
```

**Error: "Not logged into Docker Hub"**
```bash
docker login
# Enter your Docker Hub username and password
```

**Build is taking a long time?**
- First build takes 15-20 minutes
- Cached builds are much faster (5-10 minutes)
- Network speed affects the push time

## For More Details

See `MULTIPLATFORM_BUILD.md` for comprehensive guide.
