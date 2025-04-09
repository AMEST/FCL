# FCL (Fast Check List)

FCL is a fast and simple checklist application that allows users to create and manage checklists without requiring authentication.

## Configuration

The application is configured using environment variables:

- `ConnectionStrings__MongoDB` - MongoDB connection string for data storage
- `ConnectionStrings__Redis` - Redis connection string for configuration in cluster environments with more than 1 replica (required for WebSocket cluster support)

## Running the Application

You can run FCL using either a pre-built Docker container or by building it locally:

### Using Pre-built Docker Container
```bash
docker run -d \
  -e "ConnectionStrings__MongoDB=your_mongo_connection_string" \
  -e "ConnectionStrings__Redis=your_redis_connection_string" \
  -p 8080:8080 \
  eluki/fcl
```

### Building and Running Locally
1. Clone the repository
2. Build the Docker image:
```bash
docker build -t fcl .
```
3. Run the container:
```bash
docker run -d \
  -e "ConnectionStrings__MongoDB=your_mongo_connection_string" \
  -e "ConnectionStrings__Redis=your_redis_connection_string" \
  -p 8080:8080 \
  fcl
