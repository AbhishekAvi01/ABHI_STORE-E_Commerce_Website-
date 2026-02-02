# MERN Store - Troubleshooting Guide

## Problem: Products not showing on Home Page & Admin Panel not loading data

### Quick Fix Steps (Follow in order):

#### Step 1: Start Backend Server
```bash
cd backend
npm run dev
```
**Expected Output:**
```
Server running on port 5000
MongoDB Connected: ...
```

#### Step 2: Seed Database with Products
```bash
# In a NEW terminal (while backend is running):
cd backend
node seed.js
```
**Expected Output:**
```
MongoDB Connected for seeding...
Sample products inserted successfully!
Seeding completed!
```

#### Step 3: Start Frontend Server
```bash
cd frontend
npm run dev
```
**Expected Output:**
```
VITE v5.4.21  ready in XXX ms
Local:   http://localhost:5173/
```

#### Step 4: Test the App
1. **Home Page**: Open http://localhost:5173/ - Should show products
2. **Admin Panel**:
   - Go to Home → Login (or Sign up first)
   - Use admin account to login
   - Go to `/admin/userlist`, `/admin/productlist`, `/admin/orderlist`
   - Should load user data, products, orders

---

### If Still Not Working:

#### Issue: "Cannot read properties of undefined (reading 'payload')"
- **Fix**: Clear browser localStorage
  ```javascript
  // Open browser console and run:
  localStorage.clear()
  ```
- Then refresh the page and try login again

#### Issue: Admin Panel shows 404 errors
- **Fix**: Make sure you're logged in as admin
- Only admin users can access `/admin/*` routes
- Check `.env` for JWT_SECRET and MONGO_URI

#### Issue: Products still not showing
- **Check Backend**:
  ```bash
  # Open MongoDB Compass or use mongosh:
  use mystore
  db.products.find()
  ```
  Should return products. If empty, run `node seed.js` again

#### Issue: "Failed to load orders/users/products"
- **Check Console**: Open browser DevTools → Console tab
- **Check if backend is running**: Visit http://localhost:5000 (should say "API is running...")
- **Check if `.env.local` is correct**:
  ```
  # VITE_API_URL=http://localhost:5000
  ```
  Should be COMMENTED for local development

---

### Environment Variables Required

#### Backend (.env):
```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mystore
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
```

#### Frontend (.env.local):
```
# VITE_API_URL=http://localhost:5000
```
(Keep commented for local dev)

---

### Expected Behavior After Fixes:

✅ **Home Page**: Displays 10+ products from database  
✅ **Login/Signup**: Creates user account and logs in  
✅ **Admin Panel**:
  - `/admin/userlist` - Shows all users
  - `/admin/productlist` - Shows all products
  - `/admin/orderlist` - Shows all orders  
✅ **Cart & Checkout**: Full workflow working  
✅ **Order History**: User can view their orders  

---

### Still Having Issues?

1. **Clear Everything & Restart**:
   ```bash
   # Close all terminals
   # Delete node_modules in both frontend and backend
   # Run npm install in both
   # Restart servers
   ```

2. **Check Database Connection**:
   ```bash
   # In backend terminal, you should see:
   # "MongoDB Connected: codingadda.g2l945s.mongodb.net"
   ```

3. **Check Network Tab** in Browser DevTools:
   - API calls to `/api/*` should return 200 status
   - Check Response tab for actual data

