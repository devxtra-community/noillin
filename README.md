
# Noillin

**Noillin** is a web-based Influencer × Brand collaboration platform that enables brands to discover influencers, book services based on availability, and complete payments securely with realtime communication and notifications.

---

## 1. Project Purpose

Noillin is built to solve structured influencer–brand collaboration at scale by:
- Eliminating manual coordination and availability conflicts
- Enforcing payment-before-confirmation booking rules
- Supporting single and multi-influencer (group) gigs
- Providing realtime chat and notifications
- Maintaining a clean, scalable backend architecture with strict service boundaries

---

## 2. High-Level System Overview (Request Flow)

1. Client sends request to **NGINX (API Gateway)**
2. NGINX routes request to the appropriate private backend service
3. Core Service handles business logic and database writes
4. Redis is used for caching and booking slot locks
5. Meilisearch handles fast search queries
6. RabbitMQ queues async jobs
7. Worker Service processes background tasks
8. Realtime Service pushes events via Socket.IO
9. Response flows back through NGINX to the client

---

## 3. Backend Architecture (Strict 3-Service Rule)

Exactly **three deployable backend services**:

### 1. Core / Auth Service
- Authentication & authorization (JWT, RBAC)
- Influencer, Brand, Admin profiles
- Gig management (single & group gigs)
- Availability rules and overrides
- Booking lifecycle
- Payment processing
- MongoDB persistence
- Redis caching & slot locking
- Meilisearch indexing

### 2. Realtime Service
- Socket.IO server
- Realtime chat (brand ↔ influencer)
- Realtime notifications
- Redis pub/sub for horizontal scaling

### 3. Worker Service
- RabbitMQ consumers
- Async background jobs:
  - Notifications
  - Payment webhooks handling
  - Search index sync
  - Email / system events

No additional backend services are allowed.

---

## 4. Infrastructure & Datastores

- **API Gateway:** NGINX
- **Database:** MongoDB
- **Cache & Locks:** Redis
- **Message Queue:** RabbitMQ
- **Search Engine:** Meilisearch
- **Process Manager:** PM2
- **CI/CD:** GitHub Actions
- **Monorepo Package Manager:** pnpm

---

## 5. API Gateway / Routing

- All external traffic flows through **NGINX**
- Backend services are **private** (localhost only)
- NGINX handles:
  - HTTPS termination
  - Reverse proxy routing
  - Path-based service forwarding

Example routing:
- `/api/*` → Core Service
- `/socket/*` → Realtime Service

Direct access to backend services is forbidden.

---

## 6. Project Folder Structure

```txt
noillin/
├── apps/
│   ├── core-api/        # Core/Auth Service
│   ├── realtime/        # Socket.IO Service
│   └── worker/          # Background Jobs Service
├── packages/
│   ├── config/          # Shared configs
│   ├── logger/          # Logging utilities
│   └── utils/           # Shared helpers
├── infra/
│   ├── nginx/           # NGINX config
│   └── scripts/         # Deployment scripts
├── .github/
│   └── workflows/       # GitHub Actions CI/CD
├── pnpm-workspace.yaml
├── package.json
└── README.md
````

---

## 7. Prerequisites

* Node.js (>= 20)
* pnpm (via Corepack)
* MongoDB
* Redis
* RabbitMQ
* Meilisearch
* NGINX

---

## 8. Install Dependencies

```bash
corepack enable
corepack prepare pnpm@latest --activate
pnpm install
```

---

## 9. Environment Variables

Each service maintains its own `.env`.

### Core Service (`apps/core-api/.env`)

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/noillin
JWT_SECRET=supersecret
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://localhost
MEILI_HOST=http://localhost:7700
MEILI_API_KEY=masterKey
```

### Realtime Service (`apps/realtime/.env`)

```env
PORT=4000
REDIS_URL=redis://localhost:6379
```

### Worker Service (`apps/worker/.env`)

```env
RABBITMQ_URL=amqp://localhost
MONGO_URI=mongodb://localhost:27017/noillin
REDIS_URL=redis://localhost:6379
```

---

## 10. Running Locally

Start required services:

* MongoDB
* Redis
* RabbitMQ
* Meilisearch

Run backend services:

```bash
pnpm -r dev
```

Start NGINX:

```bash
sudo nginx -c /path/to/nginx.conf
```

---

## 11. Deployment Overview (CI/CD)

* Monorepo CI using **GitHub Actions**
* Workflow steps:

  * Install dependencies using pnpm
  * Lint, type-check, and build services
  * SSH into server
  * Pull latest code
  * Install production dependencies
  * Restart services using PM2

Each service is deployed independently but within the same repository.

---

## 12. System Rules & Constraints (Do Not Break)

* Exactly **3 backend services**
* No direct public access to backend services
* All traffic must pass through NGINX
* Booking is confirmed **only after payment success**
* Redis must be used for booking slot locking
* RabbitMQ must handle async workloads
* MongoDB is the single source of truth
* pnpm workspace structure must remain intact

---

## 13. Scale Assumptions

* Initial scale: thousands of users
* Redis pub/sub enables realtime horizontal scaling
* Worker Service scales independently
* Stateless backend services behind NGINX
* Search queries offloaded to Meilisearch

---

## 14. Future Improvements

* Rate limiting at NGINX
* JWT validation at gateway
* Admin analytics dashboard
* Webhook-based payment retries
* Advanced availability optimization for group gigs
* Read replicas for MongoDB

---

## 15. Design Philosophy

* Explicit boundaries over microservice sprawl
* Predictable request flow
* Payment-first booking integrity
* Realtime where it matters, async where it scales
* Infrastructure-aware backend design
* Production-first decisions over shortcuts

```
```
