# Technical Decisions

## Frontend
- React + TypeScript selected for modern UI development and strong typing.
- Vite chosen for a fast development experience.
- Leaflet used for map rendering because it is lightweight and integrates well with React.
- React Router handles page navigation between admin and driver views.
- Minimal custom styling keeps the UI clean and responsive without a heavy CSS framework.

## Backend
- Node.js + Express provides a lightweight mock API that supports realistic CRUD operations.
- In-memory storage allows the frontend to interact with mutable data without persistence complexity.
- CORS is enabled to allow the frontend to request resources from the backend during development.

## Tradeoffs
- This implementation focuses on UI workflows and component architecture rather than a production backend.
- The backend does not persist data to disk; it is intentionally in-memory to meet the session-level persistence requirement.
