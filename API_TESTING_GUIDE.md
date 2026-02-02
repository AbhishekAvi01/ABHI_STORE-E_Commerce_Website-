# 🧪 API ENDPOINT TESTING GUIDE

## 📌 Quick Test All Endpoints

### Prerequisites
- Backend running: `npm run dev` in `/backend`
- Frontend running: `npm run dev` in `/frontend`
- Database seeded: `node seed.js` in `/backend`

---

## 🚀 Test with CURL or Postman

### 1. Get All Products (PUBLIC - No Auth)
```bash
curl http://localhost:5000/api/products
```
**Expected:** JSON array of 10 products
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Laptop",
    "price": 59999,
    "image": "...",
    "category": "Electronics",
    "countInStock": 5
  },
  ...
]
```

### 2. Search Products
```bash
curl "http://localhost:5000/api/products?search=laptop"
```
**Expected:** Filtered products matching search

### 3. Filter by Category
```bash
curl "http://localhost:5000/api/products?category=Electronics"
```
**Expected:** Only electronics products

### 4. Sort by Price
```bash
curl "http://localhost:5000/api/products?sort=price_asc"
```
**Expected:** Products sorted low to high

---

## 🔐 AUTHENTICATION TESTS

### 1. Register New User
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "123456"
  }'
```
**Expected:** User created with token
```json
{
  "_id": "...",
  "name": "Test User",
  "email": "test@example.com",
  "isAdmin": false,
  "token": "eyJhbGc..."
}
```

### 2. Login User
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123456"
  }'
```
**Expected:** Returns user data with token

### 3. Get User Profile (Protected)
```bash
# Replace TOKEN with your actual token from login
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer TOKEN"
```
**Expected:** User profile data

---

## 🛒 ORDER TESTS

### 1. Create Order (Requires Auth)
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "orderItems": [
      {
        "_id": "PRODUCT_ID",
        "name": "Product Name",
        "price": 999,
        "qty": 1,
        "image": "..."
      }
    ],
    "shippingAddress": {
      "address": "123 Main St",
      "city": "New York",
      "postalCode": "10001",
      "country": "USA"
    },
    "paymentMethod": "PayPal",
    "itemsPrice": 999,
    "shippingPrice": 100,
    "totalPrice": 1099
  }'
```
**Expected:** Order created with ID
```json
{
  "_id": "ORDER_ID",
  "user": "USER_ID",
  "orderItems": [...],
  "shippingAddress": {...},
  "paymentMethod": "PayPal",
  "itemsPrice": 999,
  "shippingPrice": 100,
  "totalPrice": 1099,
  "isPaid": false,
  "isDelivered": false,
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

### 2. Get My Orders (Requires Auth)
```bash
curl http://localhost:5000/api/orders/myorders \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected:** Array of user's orders

### 3. Get All Orders (Admin Only)
```bash
curl http://localhost:5000/api/orders \
  -H "Authorization: Bearer ADMIN_TOKEN"
```
**Expected:** All orders (only if user is admin)

### 4. Get Single Order
```bash
curl http://localhost:5000/api/orders/ORDER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```
**Expected:** Single order details

### 5. Mark Order Delivered (Admin Only)
```bash
curl -X PUT http://localhost:5000/api/orders/ORDER_ID/deliver \
  -H "Authorization: Bearer ADMIN_TOKEN"
```
**Expected:** Order updated with `isDelivered: true`

---

## 👥 USER MANAGEMENT (Admin Only)

### 1. Get All Users
```bash
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer ADMIN_TOKEN"
```
**Expected:** Array of all users

### 2. Delete User
```bash
curl -X DELETE http://localhost:5000/api/users/USER_ID \
  -H "Authorization: Bearer ADMIN_TOKEN"
```
**Expected:** User deleted

---

## 📦 PRODUCT MANAGEMENT (Admin Only)

### 1. Create Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "name": "New Product",
    "price": 499,
    "image": "https://via.placeholder.com/400",
    "category": "Electronics",
    "countInStock": 10,
    "description": "Product description"
  }'
```
**Expected:** Product created

### 2. Update Product
```bash
curl -X PUT http://localhost:5000/api/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "name": "Updated Name",
    "price": 599
  }'
```
**Expected:** Product updated

### 3. Delete Product
```bash
curl -X DELETE http://localhost:5000/api/products/PRODUCT_ID \
  -H "Authorization: Bearer ADMIN_TOKEN"
```
**Expected:** Product deleted

### 4. Upload Image (Cloudinary)
```bash
curl -X POST http://localhost:5000/api/upload \
  -F "image=@/path/to/image.jpg" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```
**Expected:** Image URL
```json
{
  "image": "https://res.cloudinary.com/..."
}
```

---

## 🧪 TESTING CHECKLIST

### Public Endpoints (No Auth)
- [ ] ✅ GET /api/products → Returns all products
- [ ] ✅ GET /api/products?search=X → Filters by search
- [ ] ✅ GET /api/products?category=X → Filters by category
- [ ] ✅ GET /api/products?sort=X → Sorts results
- [ ] ✅ GET /api/products/:id → Gets single product

### Auth Endpoints
- [ ] ✅ POST /api/users → Register (returns token)
- [ ] ✅ POST /api/users/login → Login (returns token)
- [ ] ✅ GET /api/users/profile → Get profile (with token)
- [ ] ✅ Token format: "Authorization: Bearer TOKEN"

### Order Endpoints
- [ ] ✅ POST /api/orders → Create order (needs auth)
- [ ] ✅ GET /api/orders/myorders → Get user orders (needs auth)
- [ ] ✅ GET /api/orders/:id → Get order details (needs auth)
- [ ] ✅ GET /api/orders → Get all orders (admin only)
- [ ] ✅ PUT /api/orders/:id/deliver → Mark delivered (admin only)

### User Management (Admin)
- [ ] ✅ GET /api/users → Get all users (admin only)
- [ ] ✅ DELETE /api/users/:id → Delete user (admin only)

### Product Management (Admin)
- [ ] ✅ POST /api/products → Create product (admin only)
- [ ] ✅ PUT /api/products/:id → Update product (admin only)
- [ ] ✅ DELETE /api/products/:id → Delete product (admin only)
- [ ] ✅ POST /api/upload → Upload image (admin only)

---

## 🔍 DEBUGGING TIPS

### 1. Check Backend Logs
Open terminal running backend, you should see:
```
GET /api/products
POST /api/users/login
GET /api/orders/myorders
```

### 2. Use Browser DevTools
**Network Tab (F12 → Network):**
- See all requests/responses
- Check status codes (200 = good, 404 = not found, 401 = not authorized)
- Check response body for errors

**Console Tab (F12 → Console):**
- See API logs like: `🔍 Fetching from: /products`
- See errors: `❌ Error: Network Error`

### 3. Common Response Codes

| Code | Meaning | Fix |
|------|---------|-----|
| **200** | Success ✅ | Good! |
| **201** | Created ✅ | Good! |
| **400** | Bad Request | Check request format |
| **401** | Unauthorized | Add auth token |
| **403** | Forbidden | Not admin or wrong user |
| **404** | Not Found | Wrong URL or resource deleted |
| **500** | Server Error | Backend crashed, check logs |

---

## 🎯 Test Sequence (Recommended)

1. **Test public endpoints first** (no auth needed)
   ```bash
   curl http://localhost:5000/api/products
   ```

2. **Test auth flow**
   ```bash
   # Register
   curl -X POST http://localhost:5000/api/users ...
   
   # Login and get token
   curl -X POST http://localhost:5000/api/users/login ...
   ```

3. **Test protected endpoints** (with token)
   ```bash
   curl http://localhost:5000/api/orders/myorders \
     -H "Authorization: Bearer TOKEN_FROM_LOGIN"
   ```

4. **Test admin endpoints** (with admin token)
   ```bash
   curl http://localhost:5000/api/orders \
     -H "Authorization: Bearer ADMIN_TOKEN"
   ```

---

## 💡 Pro Tips

### Save Token for Reuse
```bash
# After login, save token
TOKEN=$(curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"123456"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# Use it in requests
curl http://localhost:5000/api/orders \
  -H "Authorization: Bearer $TOKEN"
```

### Use Postman for Easier Testing
1. Download Postman
2. Create collection with all endpoints
3. Set Authorization type to "Bearer Token"
4. Save token as variable
5. Easy one-click testing

### Enable CORS for Frontend Testing
Already configured in `backend/server.js`:
```javascript
const cors = require('cors');
app.use(cors());
```

---

**All endpoints working? You're all set!** 🚀
