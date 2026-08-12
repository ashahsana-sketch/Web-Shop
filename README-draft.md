# Web-Shop

## Description

Web-Shop is an inventory management dashboard for a product catalogue. It displays products in a paginated table with brand, category, stock status, and price, alongside summary cards that give an at-a-glance overview of stock levels (in stock, low stock, out of stock).

It's built for internal/admin-style use — managing and tracking a global product catalogue across categories — rather than as a customer-facing storefront. The project exists as a starter/practice codebase for exploring a Next.js frontend paired with a mocked backend API.

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- [React](https://react.dev) 19
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com) 4
- [lucide-react](https://lucide.dev) (icons)
- [json-server](https://github.com/typicode/json-server/tree/v0.17.4) (mock REST API)
- [concurrently](https://www.npmjs.com/package/concurrently) (runs frontend + mock API together)
- [ESLint](https://eslint.org)

## Features

- Product inventory table (title, thumbnail, SKU, brand, category, stock, price)
- Stock status indicator per product (In Stock / Low Stock / Out of Stock)
- Summary cards showing total, in-stock, low-stock, and out-of-stock product counts
- Pagination with page numbers, ellipses for large ranges, and prev/next controls, driven by URL query params
- Search and category/stock filter bar UI (not yet wired to filtering logic)
- Delete/edit action buttons on each product row (UI only, not yet wired to backend actions)
- Mock backend API (json-server) with:
  - Product and category endpoints
  - Product creation with required-field validation and auto-generated SKU/ID
  - Pagination, sorting, and filtering query support

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd Web-Shop
```

Install dependencies:

```bash
npm install
```

Run the frontend and mock API together:

```bash
npm run dev:full
```

Or run them separately:

```bash
npm run dev          # Next.js frontend only
npm run mock-server   # json-server mock API only
```

## Environment Variables

This project does not currently include a `.env.example` file or require environment variables. The mock API base URL is hardcoded in the source (`http://localhost:4000`).

## Usage

1. Start the app with `npm run dev:full`.
2. Open [http://localhost:3000](http://localhost:3000) to view the inventory dashboard.
3. The mock API runs at [http://localhost:4000](http://localhost:4000) and can be queried directly (e.g. `GET /products`, `GET /categories`).
4. Use the pagination controls at the bottom of the product table to browse pages.

## Project Structure

```
Web-Shop/
├── app/                 # Next.js App Router: pages, layout, global styles, types
│   └── components/      # Page-specific components (Header, Pagination, SearchBar, SummaryCard)
├── components/          # Shared components (ProductCard)
├── server/              # Mock backend: json-server database and middleware
├── public/              # Static assets
```

## Roadmap

- [ ] Wire up search and filter controls to the product list
- [ ] Implement product create/edit/delete actions
- [ ] Replace mock API (json-server) with a real backend
- [ ] Add authentication / access control

## Contributors

- David — [GitHub profile placeholder]
- Sana — [GitHub profile placeholder]
- Kibruu — [GitHub profile placeholder]
- Isabelle — [GitHub profile placeholder]

## License

[License placeholder — to be determined]

## Screenshots / Demo

_Screenshots and a live demo link will be added once the project is further along._


