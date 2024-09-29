

# Use the official .NET Core SDK as a parent image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build


WORKDIR /app

# Copy the project file and restore any dependencies (use .csproj for the project name)
COPY ./server/*.csproj ./
RUN dotnet restore
# Copy the rest of the application code
COPY ./server ./


# Publish the application
RUN dotnet publish -c Release -o out

# Build the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out ./

# Install PostgreSQL client
RUN apt-get update && apt-get install -y \
    postgresql-client \
    openssh-client \
    bash \
    && rm -rf /var/lib/apt/lists/*

# Copy the Bash script into the container
COPY ./server/connect_postgres.sh /usr/local/bin/connect_postgres.sh

# Make the script executable
RUN chmod +x /usr/local/bin/connect_postgres.sh

# Expose the port your application will run on
EXPOSE 5076
# Turn on development environment for swagger API
ENV ASPNETCORE_URLS=http://*:5076
ENV ASPNETCORE_ENVIRONMENT=Development  

RUN mkdir -p /root/.ssh
COPY ./secrets/id_rsa_vm /root/.ssh/id_rsa
RUN chmod 0700 /root/.ssh

# Start the application
ENTRYPOINT ["dotnet", "server.dll"]
