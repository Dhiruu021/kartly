# KARTLY — Handcrafted Objects for Slow Homes

**Kartly** is a complete, full-stack e-commerce platform designed and built to closely mirror the Scandinavian minimalist aesthetic, bento-grid layout, and interaction patterns of the reference shop ([kvist](https://demo.codeandchill.store/kvist/shop?c=seating)).

Built with Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Node.js, Express, and MongoDB with Mongoose.

---

## 📸 Reference Design & Brand Identity

- **Brand Wordmark:** KARTLY
- **Design Philosophy:** Nordic calm, tactile materials (solid oak, wool bouclé, pleated linen, wheel-thrown clay).
- **Design Tokens:**
  - **Canvas Background:** `#f2efe9` (warm stone)
  - **Card/Tile:** `#fbfaf7` (paper/ceramic off-white)
  - **Ink:** `#1c1b18` (deep charcoal black)
  - **Line/Border:** `#e2ddd2` (subtle divider)
  - **Accent:** `#2f47d0` (cobalt blue)
  - **Pastel Tints:**
    - `sage`: `#dbe4d3`
    - `butter`: `#f1e7c6`
    - `sand`: `#ebe2d4`
    - `blush`: `#efded7`
    - `sky`: `#dbe3ee`
    - `stone`: `#e5e2db`
  - **Bento Tile Corner Radius:** `1.75rem` (`28px`)
  - **Typography:** `Bricolage Grotesque` (display), `Geist` (body/sans), `Geist Mono` (tabular numbers & badges)

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19, TypeScript
- **Styling:** Tailwind CSS with custom design tokens & responsive breakpoints
- **Icons:** Lucide React
- **State Management:** React Context API (`AuthContext`, `CartContext`, `WishlistContext`)

### Backend
- **Runtime:** Node.js (v22+)
- **Server:** Express.js REST API
- **Language:** TypeScript (NodeNext ESM)
- **Database:** MongoDB & Mongoose
- **Zero-Config Database Fallback:** Automatic In-Memory MongoDB Server (`mongodb-memory-server`) for instant local dev & tests without external setup
- **Authentication:** JWT with HTTP-only cookies, bcrypt password hashing, role-based access control (`customer` & `admin`)
- **Validation:** Zod schemas
- **Security:** CORS credentials, rate limiting, atomic stock deductions

---

## 📁 Repository Structure

```
online store/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection & environment configuration
│   │   ├── controllers/     # Auth, Products, Categories, Orders, Coupons, Wishlist, Admin
│   │   ├── middleware/      # Authentication, Validation (Zod), Error Handler
│   │   ├── models/          # User, Product, Category, Order, Coupon, Wishlist, Review
│   │   ├── routes/          # REST API route declarations
│   │   ├── seed/            # Seed script and initial catalog definitions
│   │   ├── tests/           # Integration tests suite
│   │   ├── app.ts           # Express application setup
│   │   └── server.ts        # Server entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx                # Root layout with fonts & context providers
│   │   │   ├── page.tsx                  # Home Page (Hero Bento & Category Showcase)
│   │   │   ├── shop/page.tsx             # Shop Page with ?c=seating filtering & sorting
│   │   │   ├── products/[slug]/page.tsx  # Product Detail Page (PDP with finishes)
│   │   │   ├── cart/page.tsx             # Dedicated Shopping Bag Page
│   │   │   ├── checkout/page.tsx         # Secure Multi-Step Checkout Page
│   │   │   ├── checkout/success/page.tsx # Order Confirmation & Tracking Page
│   │   │   ├── account/page.tsx          # Customer Account & Order History Portal
│   │   │   ├── login/page.tsx            # Sign In with Instant Demo Buttons
│   │   │   ├── register/page.tsx         # Account Registration
│   │   │   └── admin/                    # Complete Protected Admin Dashboard
│   │   │       ├── page.tsx              # Overview (Revenue, Pipeline, Low Stock)
│   │   │       ├── products/page.tsx     # Inventory CRUD & Stock management
│   │   │       ├── categories/page.tsx   # Category CRUD & Tint assignment
│   │   │       ├── orders/page.tsx       # Order fulfillment & tracking management
│   │   │       ├── coupons/page.tsx      # Coupon codes & promotion management
│   │   │       └── customers/page.tsx    # Customer directory & lifetime spend
│   │   ├── components/
│   │   │   ├── layout/       # AnnouncementBar, Header, Footer, SearchModal
│   │   │   ├── shop/         # CategoryFilterBar, ProductCard, FilterDrawer, SortDropdown
│   │   │   ├── cart/         # CartDrawer with shipping progress & coupon input
│   │   │   └── admin/        # AdminLayout with responsive sidebar
│   │   ├── context/          # AuthContext, CartContext, WishlistContext
│   │   ├── lib/              # API Client, TypeScript Types, Utils
│   │   └── styles/           # globals.css with design tokens
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or later (v22 recommended)
- **npm**: v9.0.0 or later

### 2. Backend Setup

```bash
cd backend

# Install dependencies (already completed)
npm install

# (Optional) Configure environment
# If MONGODB_URI is left blank, Kartly automatically initializes
# an in-memory MongoDB instance for instant, zero-setup operation.
# To use MongoDB Atlas, paste your connection URI into .env:
# MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/kartly?retryWrites=true&w=majority

# Run database tests to verify integrity:
npm test

# Start the backend server:
npm run dev
```

The backend API will be running at: `http://localhost:5000/api`

### 3. Frontend Setup

In a new terminal window:

```bash
cd frontend

# Install dependencies (already completed)
npm install

# Start the Next.js development server:
npm run dev
```

Open your browser to: `http://localhost:3000`

---

## 🔑 Official Store Administrator Account

The store comes configured with an official Administrator account:

| Role | Email | Password | Access |
|---|---|---|---|
| **Store Owner & Admin** | `********` | `********` | Full Admin Dashboard (`/admin`), Product/Category CRUD, Order status updates, Coupon management, Customer metrics |

> Customers can register with their own name, email, and password at `/register` or check out as a guest.

---

## 🏷️ Active Discount Coupons

Test coupon codes during checkout or inside the shopping bag:
- `KARTLY10`: 10% discount on orders over ₹999 (up to ₹1,000)
- `SLOW15`: 15% discount on orders over ₹1,999 (up to ₹2,000)
- `WELCOME200`: ₹200 fixed instant discount on orders over ₹1,499

---

## 🛍️ Implemented User Journeys & Pages

1. **Home Page (`/`)**:
   - Hero bento grid with featured piece showcase (`Bolle Lounge Chair` & `Linne Table Lamp`).
   - Category navigation tiles with matching pastel background tints.
   - Bestseller carousel and brand philosophy values (48-hour studio dispatch, FSC® certified oak, 30-day calm returns).

2. **Shop Page (`/shop` and `/shop?c=seating`)**:
   - Dynamic URL-synchronized category filtering (`?c=seating`, `lighting`, `tables`, `textiles`, `ceramics`).
   - Horizontal category pill strip with live product counts and tint indicators.
   - Interactive Filter Drawer with real-time price slider, in-stock availability switch, and one-click "Clear All".
   - Sorting dropdown: Featured, Newest, Price: low to high, Price: high to low, Rating, Name A-Z.
   - Product cards with color finish swatches, badge pills, and hover quick-add.

3. **Product Detail Page (`/products/[slug]`)**:
   - High-resolution gallery with thumbnail switcher.
   - Real color finish selector updating active swatch indicator.
   - Stock availability status ("In stock · Ready to dispatch in 48 hours" or low stock warnings).
   - Quantity selector (- / +) and Add to Bag button with smooth state feedback.
   - Comprehensive specifications: dimensions, materials, care instructions.
   - Dynamic related products recommendation from the same category.

4. **Slide-over Shopping Bag & Dedicated Cart (`/cart`)**:
   - Free shipping progress bar dynamically updating with threshold ($150).
   - Real-time line item quantity updates and removals.
   - Authoritative promo code verification.
   - Seamless synchronization with `localStorage` and customer session.

5. **Checkout Experience (`/checkout`)**:
   - Contact details and shipping address validation with automatic user autofill.
   - Sandbox / Demo payment selection (Simulated Card & Pay on Delivery).
   - Authoritative backend recalculation of item prices, discounts, shipping fees, and inventory verification.
   - Atomic stock deduction preventing overselling.
   - Order confirmation page (`/checkout/success?orderNumber=...`) with tracking timeline.

6. **Customer Portal (`/account`)**:
   - Customer profile details.
   - Live order history with statuses (`paid`, `packing`, `shipped`, `delivered`).
   - Shipping destination address book manager.
   - Persistent wishlist with "Move to Bag" capability.

7. **Admin Dashboard (`/admin`)**:
   - **Overview (`/admin`)**: Live revenue aggregation, order pipeline counts, low stock alerts, recent orders.
   - **Products (`/admin/products`)**: Add object, edit object, delete, adjust stock, manage variants and badges.
   - **Categories (`/admin/categories`)**: Create/edit categories, configure slug and pastel tint background.
   - **Orders (`/admin/orders`)**: Search orders, change fulfillment status, attach carrier tracking number.
   - **Coupons (`/admin/coupons`)**: Create promo codes, configure percentage or dollar off, set usage limits.
   - **Customers (`/admin/customers`)**: Shopper directory with order frequency and lifetime spend.

---

## 🧪 Testing

The backend includes automated integration tests verifying database seeding, category filtering, search queries, coupon calculations, and atomic stock deductions:

```bash
cd backend
npm test
```

Test Results:
```
# Subtest: Kartly Backend API Suite
  ok 1 - Setup in-memory DB and seed catalog
  ok 2 - GET /api/products returns products list and priceRange
  ok 3 - Product filtering by category works correctly
  ok 4 - Coupon validation logic
  ok 5 - Stock deduction on order placement
  ok 6 - Teardown
1..6
# tests 7 | pass 7 | fail 0
```

---

## ☁️ Future Cloud / AWS Migration Architecture

The codebase is architected with clear abstraction boundaries:
1. **Compute:** The Express REST API can be containerized using the provided Docker-ready ESM structure on **AWS ECS (Fargate)** or **AWS App Runner**. The Next.js frontend can be deployed to **Vercel** or **AWS Amplify Hosting**.
2. **Database:** Switch from local/memory MongoDB to **MongoDB Atlas** or **Amazon DocumentDB** by setting `MONGODB_URI` in AWS Systems Manager / Secrets Manager.
3. **Asset Storage:** Product images can be moved to **Amazon S3** behind an **Amazon CloudFront** distribution.
4. **Secrets:** In production, use **AWS Secrets Manager** to inject `JWT_SECRET`, `COOKIE_SECRET`, and `MONGODB_URI`.

---

## 📄 License
MIT © 2026 Kartly Team.
