# Use the official .NET Core SDK as a parent image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app


# Copy the project file and restore any dependencies (use .csproj for the project name)
COPY ./server/*.csproj ./
RUN dotnet restore

# Copy the rest of the application code
COPY ./server .

# Publish the application
RUN dotnet publish -c Release -o out

# Build the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out ./

# Expose the port your application will run on
EXPOSE 5076
# Turn on development environment for swagger API
ENV ASPNETCORE_URLS http://*:5076
ENV ASPNETCORE_ENVIRONMENT=Development

# Start the application
ENTRYPOINT ["dotnet", "server.dll"]