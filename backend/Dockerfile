# Use the official Go image as a base image
FROM golang:1.21 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy go mod and sum files to the workspace
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the source code into the container
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main ./cmd/server

# Use a minimal alpine image for the final build
FROM alpine:latest

# Set necessary environment variables for better security
ENV CGO_ENABLED=0 GOOS=linux

# Install postgresql-client
RUN apk --no-cache add postgresql-client

# Set the current directory to /root
WORKDIR /root/

# Copy the binary from the builder stage
COPY --from=builder /app/main .

# Copy the migrations directory
COPY --from=builder /app/migrations /migrations

# Copy the wait-for-postgres.sh script into the image
COPY wait-for-postgres.sh /usr/local/bin/wait-for-postgres.sh

# Set the executable permission
RUN chmod +x /usr/local/bin/wait-for-postgres.sh

# Use the script to wait for Postgres to be ready before starting your Go application
# ...
ENTRYPOINT ["/usr/local/bin/wait-for-postgres.sh", "db", "./main"]
# ...

