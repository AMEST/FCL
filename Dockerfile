FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build-env
WORKDIR /build
COPY . ./
RUN dotnet build -c Release --nologo;\
    dotnet publish FCL.Web.Host/FCL.Web.Host.csproj -c Release --no-build -o /dist/app

FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY fcl.frontend/ .
RUN npm install --legacy-peer-deps && npm run build

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS app
WORKDIR /app
COPY --from=build-env /dist/app/. .
COPY --from=frontend-build /app/build ./wwwroot
ENV ASPNETCORE_URLS=http://*:8080
CMD ["dotnet", "FCL.Web.Host.dll"]