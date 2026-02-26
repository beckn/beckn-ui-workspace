#!/bin/bash

# Multi-platform Docker build script for deg-ev-charging frontend
# Supports: linux/amd64 (Intel/AMD 64-bit) and linux/arm64 (Apple Silicon, ARM64)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
REGISTRY="fidedocker"
IMAGE_NAME="deg-ev-charging"
PLATFORMS="linux/amd64,linux/arm64"
TAGS=("latest" "v1.0.0")

# Functions
print_header() {
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}$1${NC}"
    echo -e "${GREEN}========================================${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if buildx is available
check_buildx() {
    print_header "Checking Docker buildx availability"
    
    if ! docker buildx version &> /dev/null; then
        print_error "Docker buildx is not installed"
        print_info "Install it with: docker buildx create --name multiarch"
        exit 1
    fi
    
    print_success "Docker buildx is available"
}

# Create or use existing builder
setup_builder() {
    print_header "Setting up multi-platform builder"
    
    BUILDER_NAME="multiarch"
    
    if docker buildx inspect $BUILDER_NAME &> /dev/null; then
        print_info "Using existing builder: $BUILDER_NAME"
    else
        print_info "Creating new builder: $BUILDER_NAME"
        docker buildx create --name $BUILDER_NAME --use
    fi
    
    # Set as active
    docker buildx use $BUILDER_NAME
    print_success "Builder ready: $BUILDER_NAME"
}

# Build and push multi-platform images
build_and_push() {
    print_header "Building multi-platform Docker image"
    
    print_info "Registry: $REGISTRY"
    print_info "Image: $IMAGE_NAME"
    print_info "Platforms: $PLATFORMS"
    print_info "Tags: ${TAGS[@]}"
    
    # Build tag arguments
    TAG_ARGS=""
    for tag in "${TAGS[@]}"; do
        TAG_ARGS="$TAG_ARGS -t $REGISTRY/$IMAGE_NAME:$tag"
    done
    
    # Build and push
    print_info "Starting multi-platform build..."
    docker buildx build \
        --platform $PLATFORMS \
        $TAG_ARGS \
        --push \
        .
    
    print_success "Multi-platform build completed and pushed!"
}

# Build locally (no push) - for testing
build_local() {
    print_header "Building multi-platform image locally"
    
    print_info "Building for: $PLATFORMS"
    print_info "Image: $REGISTRY/$IMAGE_NAME:latest"
    
    docker buildx build \
        --platform $PLATFORMS \
        -t $REGISTRY/$IMAGE_NAME:latest \
        --output type=docker \
        .
    
    print_success "Local build completed!"
}

# Show available images
show_images() {
    print_header "Available Docker images"
    docker images | grep deg-ev-charging || print_info "No images found for deg-ev-charging"
}

# Main script
main() {
    if [[ $# -eq 0 ]]; then
        print_error "Usage: $0 [push|local|inspect|clean]"
        echo ""
        echo "Commands:"
        echo "  push      - Build and push to Docker Hub (requires login)"
        echo "  local     - Build locally without pushing"
        echo "  inspect   - Show available images"
        echo "  clean     - Clean up builder"
        echo ""
        echo "Example: $0 push"
        exit 1
    fi
    
    case "$1" in
        push)
            check_buildx
            setup_builder
            build_and_push
            ;;
        local)
            check_buildx
            setup_builder
            build_local
            ;;
        inspect)
            show_images
            ;;
        clean)
            print_header "Cleaning up builder"
            docker buildx rm multiarch || true
            print_success "Builder cleaned up"
            ;;
        *)
            print_error "Unknown command: $1"
            exit 1
            ;;
    esac
}

main "$@"
