# State Management

The application uses a simple API-driven state approach.

## Frontend
- `api.ts` defines fetch wrappers for all backend resources.
- Each page uses local React state and effects to load lists and forms.
- Form state is managed through controlled components.
- Data refresh is triggered after successful mutations and on manual reload.
- The driver interface simulates live GPS updates and uses local state for map position.

## Backend
- The Node.js backend stores data in module-level arrays.
- Sample datasets are created at startup for hubs, terminals, products, drivers, vehicles, and orders.
- Mutations update the in-memory state and return the current object.
- Allocation conflict checks are enforced when assigning vehicles for a given date.
