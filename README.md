# Sentiment Classifier Project

**Author:** Juan Camilo Ortiz Gonzalez - 2023921.

A distributed **sentiment‑analysis** application that demonstrates parallel processing with **Ray**, microservice deployment on **AWS**, and a React ⚛️ client for interactive inference.

> **Course**: *Infraestructuras Paralelas y Distribuidas*

---

## Current Status

| Component                                     | Path                     | Status              |
| --------------------------------------------- | ------------------------ | ------------------- |
| React client                                  | `client/`                | ✅ In course |
| API gateway (FastAPI)                         | `api/`                   | ⏳ Planned           |
| Text‑preprocessing microservice               | `preprocessing_service/` | ⏳ Planned           |
| Sentiment‑classifier microservice (Ray Serve) | `classifier_service/`    | ⏳ Planned           |
| Orchestration                                 | `docker-compose.yml`     | ⏳ Planned           |
| Technical report & slides                     | `report/`                | ⏳ Planned           |

*(This README will evolve as each component lands.)*

---

## Architecture Overview

* **Client** (now): React app that lets users submit text and view the predicted sentiment.
* **API** (planned): FastAPI gateway that orchestrates the workflow.
* **Pre‑processing service** (planned): Cleans and tokenises text in parallel via `@ray.remote` tasks.
* **Classifier service** (planned): Loads a model and serves predictions via `@ray.serve`.

---

## Repository Layout (target)

```
sentiment-classifier-project/
├── client/                # React app (vite)
├── api/                   # FastAPI gateway
├── preprocessing_service/ # Text cleaning tasks (Ray)
├── classifier_service/    # Sentiment inference (Ray Serve)
├── docker-compose.yml     # Orchestrates all services
├── report/                # Report + slides
└── README.md
```

---

## Quick Start – Client Only

> Requires **Node.js ≥ 18** and **pnpm**.

```bash
# 1. install dependencies
cd client
pnpm install # (if you haven't installed pnpm, use `npm i -g pnpm`)

# 2. run in dev mode (Vite)
pnpm run dev   # default: http://localhost:5173
```

### Build a production bundle

```bash
pnpm run build        # outputs static files to client/dist
pnpm run preview      # serve the build locally for a quick smoke test
```

---

## Containerising the Client

Each component ships its own `Dockerfile`.

Example for the client to build & run:

```bash
docker build -t sentiment-client ./client
docker run -p 3000:3000 sentiment-client
```

---

## Planned: Full‑Stack with Docker Compose

A single `docker-compose.yml` at the repo root will:

1. Build images for **client**, **api**, **preprocessing\_service**, and **classifier\_service**.
2. Bring them up on a shared Docker network so that internal hostnames (`api`, `preprocessing_service`, etc.) resolve automatically.
```bash
docker compose up --build #not available yet
```
