# Dockerfile for Monorepo Applications

This repository contains a Dockerfile designed to build and run different applications from a monorepo. The build process uses a build argument to specify which application to build and run.

## How to Use

### Build the Docker Image

To build the Docker image for a specific application, use the `--build-arg` option to pass the `BUILD_TARGET` argument. Replace `<app-name>` with the name of the application you want to build.

```sh
docker build --build-arg BUILD_TARGET=<app-name> -t <image-name> .
```

#### Example

To build the Docker image for the `retail` application:

```sh
docker build --build-arg BUILD_TARGET=retail -t retail-app .
```

### Run the Docker Container

After building the Docker image, you can run the Docker container. Use the `-p` option to map the container's port to your host's port.

```sh
docker run -p <host-port>:3000 <image-name>
```

#### Example

To run the Docker container for the `retail` application:

```sh
docker run -p 3000:3000 retail-app
```

### Available Applications

Here are the available applications you can build and run:

- `osm`
- `common`
- `dsep`
- `odr`
- `dhp`
- `pg`
- `dsnp`
- `industry_4.0`
- `regen-agri`
- `taxi-bpp`
- `retail`
- `mobility-bap`
- `tourismV1.1`
- `tourism`
- `OSC`
- `dsnp-v2`
- `odr-v2`

### Example Workflow

1. **Build the Docker image for the `retail` application:**
   ```sh
   docker build --build-arg BUILD_TARGET=retail -t retail-app .
   ```

2. **Run the Docker container for the `retail` application:**
   ```sh
   docker run -p 3000:3000 retail-app
   ```

Replace `retail` with any other application name from the list above to build and run different applications.

