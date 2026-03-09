# Multi-Platform Docker Build Guide

This guide explains how to build and push the `deg-ev-charging` frontend for multiple platforms (amd64 and arm64).

## Prerequisites

1. **Docker Desktop** with buildx support (v20.10+)
2. **Docker Hub account** with login credentials
3. **Git** (for pushing changes)

## Platform Support

| Platform | Architecture | Use Case |
|----------|-------------|----------|
| `linux/amd64` | Intel/AMD 64-bit | Standard Linux servers, cloud VMs |
| `linux/arm64` | ARM 64-bit | Apple Silicon (M1/M2/M3), AWS Graviton, Raspberry Pi |

## Quick Start

### 1. Login to Docker Hub

```bash
docker login
# Enter your Docker Hub credentials
```

### 2. Build and Push Multi-Platform Images

```bash
cd /Users/kumarabhishek/Desktop/Beckn/beckn-ui-workspace
./build-multiplatform.sh push
```

This command will:
- ✅ Check Docker buildx availability
- ✅ Create/configure multi-platform builder
- ✅ Build for both `linux/amd64` and `linux/arm64`
- ✅ Push both versions to Docker Hub under:
  - `fidedocker/deg-ev-charging:latest`
  - `fidedocker/deg-ev-charging:v1.0.0`

### 3. Verify the Build

After successful push, verify on Docker Hub:
```bash
docker pull fidedocker/deg-ev-charging:latest
docker images
```

## Alternative Methods

### Method 1: Using the Build Script (Recommended)

```bash
# Push to Docker Hub (requires login)
./build-multiplatform.sh push

# Build locally only (no push)
./build-multiplatform.sh local

# View available images
./build-multiplatform.sh inspect

# Clean up builder
./build-multiplatform.sh clean
```

### Method 2: Manual Docker buildx Command

```bash
# Ensure buildx is set up
docker buildx create --name multiarch --use

# Build and push
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t fidedocker/deg-ev-charging:latest \
  -t fidedocker/deg-ev-charging:v1.0.0 \
  --push \
  .

# Build locally (no push)
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t fidedocker/deg-ev-charging:latest \
  --output type=docker \
  .
```

### Method 3: Step-by-Step Guide

#### Step 1: Enable Docker buildx
```bash
docker buildx ls  # Check existing builders
docker buildx create --name multiarch  # Create new builder if needed
docker buildx use multiarch  # Set as active
```

#### Step 2: Verify Platforms
```bash
docker buildx inspect --bootstrap
```

You should see:
```
Name:   multiarch
Driver: docker-container
Flags:  --allow-insecure-entitlement security.insecure
Nodes:
Name:      multiarch0
Endpoint:  unix:///var/run/docker.sock
Flags:     --allow-insecure-entitlement security.insecure
BuildkitVersion: v0.x.x
GC Policy: max-unused-build-cache-size=100gb
GC Policy: max-unused-build-cache-size=100gb
Platforms: linux/amd64, linux/amd64/v2, linux/amd64/v3, linux/amd64/v4, linux/arm64
```

#### Step 3: Build and Push
```bash
cd /Users/kumarabhishek/Desktop/Beckn/beckn-ui-workspace

docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t fidedocker/deg-ev-charging:latest \
  -t fidedocker/deg-ev-charging:v1.0.0 \
  --push \
  .
```

#### Step 4: Verify on Docker Hub
```bash
# View image details
docker inspect fidedocker/deg-ev-charging:latest

# Pull for specific platform
docker pull --platform linux/amd64 fidedocker/deg-ev-charging:latest
docker pull --platform linux/arm64 fidedocker/deg-ev-charging:latest
```

## Testing on Different Platforms

### Test on Apple Silicon (arm64)
```bash
docker run --platform linux/arm64 \
  -p 3000:3000 \
  fidedocker/deg-ev-charging:latest
```

### Test on Intel/AMD (amd64)
```bash
docker run --platform linux/amd64 \
  -p 3000:3000 \
  fidedocker/deg-ev-charging:latest
```

### Let Docker Choose Best Match
```bash
docker run -p 3000:3000 fidedocker/deg-ev-charging:latest
# Docker automatically selects the best platform for your system
```

## Troubleshooting

### Error: "buildx is not installed"
```bash
# Install buildx
docker buildx create --name multiarch
```

### Error: "Cannot connect to Docker daemon"
```bash
# Ensure Docker Desktop is running
# On macOS: Check Docker menu bar
# On Linux: Verify docker daemon is running
sudo systemctl start docker
```

### Error: "no such file or directory" in build
```bash
# Ensure you're in the correct directory
cd /Users/kumarabhishek/Desktop/Beckn/beckn-ui-workspace

# Verify Dockerfile exists
ls -la Dockerfile
```

### Build is slow
- First build takes longer as it sets up both platforms
- Subsequent builds use cached layers
- Network speed affects push time (~10-15 min for 725MB)

### Push fails with authentication error
```bash
# Login to Docker Hub again
docker logout
docker login

# Then retry the build
./build-multiplatform.sh push
```

## Understanding the Dockerfile Changes

The Dockerfile now includes platform-specific directives:

```dockerfile
# Build stage uses BUILDPLATFORM (the system you're building on)
FROM --platform=$BUILDPLATFORM node:18-alpine AS builder

# Production stage uses TARGETPLATFORM (the platform being built for)
FROM --platform=$TARGETPLATFORM node:18-alpine
```

This ensures:
- ✅ Build stage runs on your native platform (fast)
- ✅ Production stage targets the correct architecture
- ✅ No manual cross-compilation needed

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Multi-Platform Build

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: ./beckn-ui-workspace
          platforms: linux/amd64,linux/arm64
          push: true
          tags: |
            fidedocker/deg-ev-charging:latest
            fidedocker/deg-ev-charging:v1.0.0
```

## Versioning Strategy

Current setup tags images as:
- `latest` - Most recent build
- `v1.0.0` - Semantic version tag

To update version:
1. Edit the `TAGS` array in `build-multiplatform.sh`
2. Or pass custom tags manually

## Performance Notes

| Metric | Value |
|--------|-------|
| Image Size | ~725.8 MB (compressed) |
| Build Time (first) | ~15-20 minutes |
| Build Time (cached) | ~5-10 minutes |
| Push Time | ~10-15 minutes |
| Pull Time | ~3-5 minutes |

## References

- [Docker buildx Documentation](https://docs.docker.com/build/buildx/)
- [Multi-architecture Builds](https://docs.docker.com/build/building/multi-platform/)
- [Docker Hub Image Details](https://docs.docker.com/docker-hub/)

## Support

For issues or questions:
1. Check Docker buildx logs: `docker buildx du`
2. Inspect builder: `docker buildx inspect multiarch`
3. View build output: Add `--verbose` to build command
