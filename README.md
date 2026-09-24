# ShopEase — End-to-End MERN Stack E-Commerce Platform

A fully integrated MERN application: React (Vite) frontend + Node/Express/MongoDB backend,
built to satisfy the assignment brief end-to-end.

## Project Structure
```
mern-ecommerce/
├── ecommerce-backend/    # Express + MongoDB API
└── ecommerce-frontend/   # React (Vite) client
```

## Requirement Coverage

### Backend Integration
| Requirement | Implementation |
|---|---|
| JWT auth + bcrypt password hashing | `controllers/authentication.js`, `models/user.js` (pre-save hash hook), `middleware/authMiddleware.js` |
| CRUD APIs: Products, Orders, User Profiles | `productController.js`, `orderController.js`, `userProfile.js` + matching routes |
| Filtering, sorting, searching | `GET /api/products?keyword=&category=&brand=&minPrice=&maxPrice=&sort=` (text index + query builder) |
| RapidMiner-based recommendations | `controllers/analyticsController.js` — see note below |
| Role-based access control (admin/user) | `authorize("admin")` middleware, applied to product/order/user management routes |
| Scalable folder architecture | `/config /models /controllers /routes /middleware` — matches the brief's recommended layout |

**On the RapidMiner integration:** RapidMiner is a desktop/GUI data-mining tool used *offline* to
train models (e.g., FP-Growth / Association Rule Mining) on historical order data — it isn't
something an Express server calls live over HTTP. The standard, correct integration pattern (and
what's implemented here) is:
1. `GET /api/analytics/export-orders` (admin only) exports order line items as a CSV shaped for RapidMiner's FP-Growth operator.
2. You run that CSV through a RapidMiner process and export the resulting rules to `ecommerce-backend/data/associationRules.json`.
3. The recommendation endpoints load that file and blend it with a content-based score (shared category/tags/brand) and each user's browsing history, so **recommendations work out of the box** even before you've generated real rules — swap in the RapidMiner output whenever it's ready, no code changes required.

Recommendation endpoints:
- `GET /api/analytics/recommendations/:productId` — "customers also bought" (product page)
- `GET /api/analytics/recommendations/for-me` — personalized, based on browsing history (auth required)

### Frontend Integration
| Requirement | Implementation |
|---|---|
| Listing, detail view, filter, search (Router + Axios) | `pages/Home.jsx`, `pages/ProductDetail.jsx`, `api/axiosInstance.js` |
| Global state (cart, login) via Redux Toolkit | `redux/slices/cartSlice.js`, `redux/slices/authSlice.js`, `redux/store.js` |
| Responsive UI | Tailwind CSS throughout |
| Contact form with validation | `pages/Contact.jsx` |
| Login/Logout synced with backend | `redux/thunks/authThunks.js`, JWT persisted in `localStorage`, attached via Axios interceptor |
| Deployable to Netlify/Vercel/Render | Standard Vite build (`npm run build` → `dist/`); see Deployment below |

### Full-Stack Integration
- Frontend calls the backend exclusively through `src/api/axiosInstance.js`, which reads `VITE_API_BASE_URL` from env and auto-attaches the JWT.
- 401 responses clear the stored session automatically (token expiry handling).
- Loading and error states are handled in every Redux slice (`loading`, `error`) and reflected in the UI.

## Getting Started

### 1. Backend
```bash
cd ecommerce-backend
npm install
cp .env.example .env      # then edit MONGO_URI / JWT_SECRET
npm run seed               # optional: creates demo admin/user + sample products
npm run dev                 # starts on http://localhost:5000
```
Demo accounts created by `npm run seed`:
- Admin: `admin@example.com` / `admin123`
- User: `user@example.com` / `user1234`

### 2. Frontend
```bash
cd ecommerce-frontend
npm install
cp .env.example .env       # VITE_API_BASE_URL=http://localhost:5000/api
npm run dev                 # starts on http://localhost:5173
```

Both `npm run build` (frontend) and `node --check` on every backend file have been verified to pass.

## API Reference (summary)
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me                        (auth)

GET    /api/users/profile                  (auth)
PUT    /api/users/profile                  (auth)
PUT    /api/users/change-password          (auth)
GET    /api/users                          (admin)
DELETE /api/users/:id                      (admin)

GET    /api/products?keyword=&category=&brand=&minPrice=&maxPrice=&sort=&page=&limit=
GET    /api/products/:id
GET    /api/products/categories/list
POST   /api/products                       (admin)
PUT    /api/products/:id                   (admin)
DELETE /api/products/:id                   (admin)

POST   /api/orders                         (auth)
GET    /api/orders/my-orders               (auth)
GET    /api/orders/:id                     (auth, owner or admin)
GET    /api/orders                         (admin)
PUT    /api/orders/:id/status              (admin)
PUT    /api/orders/:id/cancel              (auth, owner or admin)

GET    /api/analytics/recommendations/:productId
GET    /api/analytics/recommendations/for-me   (auth)
GET    /api/analytics/export-orders            (admin)
POST   /api/contact                           (public, validated and stored)
```

## Deployment
- **Backend** → Render/Railway: set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` env vars, deploy `ecommerce-backend` with build command `npm install` and start command `npm start`.
- **Frontend** → Netlify/Vercel: set `VITE_API_BASE_URL` to your deployed backend's `/api` URL, build command `npm run build`, publish directory `dist`.
- **Database** → MongoDB Atlas free tier works well for both dev and production.

## Notes / Assumptions
- The contact form validates client-side and shows a success message; wiring it to an email
  service (e.g., Nodemailer/SendGrid) was left as a follow-up since no contact endpoint was
  specified in the backend requirements — happy to add `POST /api/contact` if you want it wired end-to-end.
- Checkout computes item/shipping/total prices **server-side** from the authoritative product
  price and stock (never trusts client-submitted prices), and decrements stock on order creation.
