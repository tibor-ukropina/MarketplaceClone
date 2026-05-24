# Marketplace Clone

A full-stack Facebook Marketplace clone built with Spring Boot and Angular.

## Tech Stack

**Backend:** Java, Spring Boot, Spring Data JPA, Spring Security, H2 (dev) / PostgreSQL (prod)

**Frontend:** Angular, TypeScript, SCSS

## Project Structure

```
MarketplaceClone/
├── marketplace-api/     Spring Boot REST API (port 8080)
└── marketplace-ui/      Angular SPA (port 4200)
```

## Getting Started

### Backend
```bash
cd marketplace-api
./mvnw spring-boot:run
```

### Frontend
```bash
cd marketplace-ui
npm install
ng serve
```
