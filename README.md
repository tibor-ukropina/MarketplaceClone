# Marketplace Clone

### Live Demo: [marketplace-clone-lovat.vercel.app](https://marketplace-clone-lovat.vercel.app/)

A full-stack Facebook Marketplace clone where users can browse and post item listings. Built with a Spring Boot REST API backend and an Angular single-page application frontend, deployed across Railway and Vercel.

---

## Tech Stack

**Frontend:** Angular 21, TypeScript, SCSS, Bootstrap 5, Angular Signals, Angular Router

**Backend:** Java 21, Spring Boot 3.4, Lombok

**Deployment:** Vercel (frontend), Railway (backend)

---

## Features

- Browse all marketplace listings
- Post a new listing with title, description, price, condition, location, and categories
- Reactive state management using Angular Signals
- REST API with a three-layer architecture (Controller, Service, Repository)
- Environment-based API configuration for development and production

---

## Project Structure

```
MarketplaceClone/
├── marketplace-api/     Spring Boot REST API (port 8080)
└── marketplace-ui/      Angular SPA (port 4200)
```

---

## Running Locally

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

Open `http://localhost:4200` in your browser.
