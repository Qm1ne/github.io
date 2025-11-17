# AI Automation Agency Website

## Overview

This is a B2B SaaS website for an AI automation agency based in Tunisia. The application serves as a marketing and lead generation platform showcasing AI automation services including workflow automation, CRM integration, lead generation, and consulting for n8n/Make platforms. The site features a modern, professional design with smooth animations, contact form submissions, and responsive layouts optimized for both desktop and mobile devices.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**: React with TypeScript, using Vite as the build tool and development server.

**UI Framework**: Shadcn/ui component library built on Radix UI primitives, styled with Tailwind CSS. The design system follows a "New York" style variant with customized color schemes and spacing.

**Routing**: Client-side routing implemented with Wouter, a lightweight routing solution. The application currently has a single-page architecture with a home page and a 404 fallback.

**State Management**: TanStack Query (React Query) for server state management, handling API calls and caching strategies. Form state is managed locally using React Hook Form with Zod validation.

**Design System**:
- Custom Tailwind configuration with extended color palette using CSS variables for theming
- Consistent spacing units (4, 6, 8, 12, 16, 20, 24)
- Typography hierarchy using DM Sans and other Google Fonts
- Responsive breakpoints following mobile-first approach
- Animation system using CSS transitions and Intersection Observer API for scroll-triggered animations

**Component Architecture**:
- Modular section-based components (Hero, Services, Banner, Testimonials, CaseStudies, ContactForm, Footer, Navigation)
- Shared UI components from Shadcn/ui library
- Custom hooks for scroll animations (`use-scroll-animation`) and mobile detection (`use-mobile`)
- Form handling with validation using React Hook Form and Zod schemas

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript.

**API Design**: RESTful API endpoints with JSON request/response format:
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Retrieve contact submissions (admin endpoint)

**Request Handling**:
- Express middleware for JSON parsing with raw body capture
- Custom logging middleware for API requests
- Request validation using Zod schemas shared between client and server

**Development Mode**: Vite middleware integration for hot module replacement and development server proxy.

**Production Build**: Server bundled using esbuild, client bundled using Vite, both output to `dist/` directory.

### Data Storage Solutions

**Current Implementation**: In-memory storage using a Map-based data structure (`MemStorage` class). This is a temporary solution suitable for development and prototyping.

**Database Schema**: Defined using Drizzle ORM with PostgreSQL dialect:
- `users` table: Basic user authentication structure (id, username, password)
- `contact_submissions` table: Contact form data (id, name, email, phone, message, createdAt)

**Schema Validation**: Drizzle-Zod integration for runtime validation, ensuring type safety between database schema and application logic.

**Migration Strategy**: Drizzle Kit configured for schema migrations with output to `./migrations` directory.

**Future Database**: The application is configured to use PostgreSQL (via Neon Database serverless driver) but currently uses in-memory storage. The `DATABASE_URL` environment variable is expected but not yet connected to the storage layer.

### External Dependencies

**Database Provider**: Neon Database (@neondatabase/serverless) - Serverless PostgreSQL platform optimized for modern applications.

**UI Component Library**: 
- Radix UI - Unstyled, accessible component primitives
- Shadcn/ui - Pre-styled components built on Radix UI
- Tailwind CSS - Utility-first CSS framework

**Form Management**:
- React Hook Form - Performant form library with minimal re-renders
- Zod - TypeScript-first schema validation
- @hookform/resolvers - Integration layer between React Hook Form and Zod

**Data Fetching**: TanStack Query - Async state management for server data with intelligent caching and background updates.

**Icons**: Lucide React - Icon library with consistent design and tree-shaking support.

**Asset Management**: Images stored in `attached_assets/generated_images/` directory, imported as ES modules.

**Development Tools**:
- Replit-specific plugins for error overlays, cartographer, and dev banners
- TypeScript for type safety across the stack
- Vite for fast development experience with HMR

**Build Pipeline**:
- Client: Vite builds React application to `dist/public`
- Server: esbuild bundles Express server to `dist/index.js`
- Shared code in `shared/` directory for types and schemas used by both client and server