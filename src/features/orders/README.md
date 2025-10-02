## Orders Feature

This module encapsulates order domain logic separate from the shop listing/catalog and cart modules.

### Responsibilities

- Server actions to read and manage orders
- Queries to fetch orders and order details
- Schemas (Zod) to validate inputs for order operations
- UI components: lightweight order list/detail rendering

### Data model

- Uses Prisma models `Order`, `OrderItem` with `OrderStatus`.
- Payment is handled by Stripe via checkout sessions. Webhooks finalize orders and clear the cart.

### Flow overview (Next.js App Router + Prisma + Server Actions)

1. User adds items to cart.
2. User proceeds to Stripe Checkout; a session is created from cart line items.
3. Stripe sends `checkout.session.completed` webhook upon successful payment.
4. Webhook builds an order from the user cart, marks it PAID, and clears the cart.
5. Success page reads the order by `session_id` and shows a receipt.

### Should I use a backend service or server actions?

- You can use Next.js server actions and API routes for this scope. They run on the server, can access Prisma directly, and are suitable for CRUD and checkout orchestration.
- Keep webhook handling in an API route (`route.ts`) to receive Stripe events (server actions are not suitable for external webhooks).
- For larger systems/microservices, you might offload to a separate backend, but for a typical store this repo size, Next API routes + server actions are sufficient.

### Files

- `actions/` server actions
- `queries/` selective reads composed for pages
- `schemas/` Zod validation
- `components/` presentational items for orders
