# Quick Start Guide - MERN Store

## 🚀 Get Running in 2 Minutes

### Terminal 1: Backend
```bash
cd backend
npm install
npm run dev
```
✅ Running on: `http://localhost:5000`

### Terminal 2: Frontend
```bash
cd frontend
npm install
npm run dev
```
✅ Running on: `http://localhost:5173`

### Access
- **Store:** http://localhost:5173
- **API:** http://localhost:5000/api

---

## 📋 Test Account

**Demo Admin User:**
- Email: `admin@example.com`
- Password: `admin123`

**Demo Customer:**
- Email: `user@example.com`
- Password: `user123`

---

## 🎯 Common Tasks

### Create First Admin
1. Register at http://localhost:5173/login
2. Go to MongoDB Compass
3. Edit user: `{ "isAdmin": true }`
4. Refresh and access `/admin/userlist`

### Create Sample Product
1. Go to `/admin/productlist`
2. Click "+ Create New Product"
3. Click "EDIT" on sample product
4. Fill details and upload image
5. Click "Update Product"

### Test Checkout
1. Add products to cart
2. Click "Checkout Now"
3. Login (auto-redirects to shipping)
4. Enter shipping details
5. Choose payment method
6. Review and place order

---

## 📁 Project Structure

```
MERN Store/
├── backend/
│   ├── controllers/          (Business logic)
│   ├── models/              (Database schemas)
│   ├── routes/              (API endpoints)
│   ├── middleware/          (Auth checks)
│   └── server.js            (Main server)
├── frontend/
│   ├── src/
│   │   ├── pages/           (React pages)
│   │   ├── components/      (Reusable UI)
│   │   ├── slices/          (Redux state)
│   │   ├── utils/           (Axios API)
│   │   └── App.jsx          (Router)
│   └── package.json
├── DEPLOYMENT.md            (Full guide)
├── FIXES_SUMMARY.md         (All fixes)
└── VERIFICATION.md          (Quality report)
```

---

## ⚙️ Environment Setup

Create `.env` in root directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
NODE_ENV=development
JWT_SECRET=your_secret_here
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

---

## 🔑 Key Features

| Feature | Status |
|---------|--------|
| User Registration | ✅ |
| User Login | ✅ |
| Product Listing | ✅ |
| Shopping Cart | ✅ |
| Checkout (4-step) | ✅ |
| Order History | ✅ |
| Admin Dashboard | ✅ |
| Product CRUD | ✅ |
| Image Upload | ✅ |
| User Management | ✅ |
| Order Tracking | ✅ |

---

## 🐛 Troubleshooting

**Backend won't start?**
- Check MongoDB connection
- Kill port 5000: `lsof -ti:5000 | xargs kill -9`

**Frontend can't reach backend?**
- Backend must run on port 5000
- Check vite.config.js proxy

**Login not working?**
- Check user exists in MongoDB
- Verify password (hashed)
- Check JWT_SECRET is set

**Admin features not visible?**
- Set `isAdmin: true` in MongoDB
- Logout and login again
- Check network tab for 401 errors

---

## 📚 API Endpoints

### Users
```
POST   /api/users              Register
POST   /api/users/login        Login
GET    /api/users/profile      Your profile
GET    /api/users              All users (admin)
DELETE /api/users/:id          Delete user (admin)
```

### Products
```
GET    /api/products           All products
GET    /api/products/:id       One product
POST   /api/products           Create (admin)
PUT    /api/products/:id       Update (admin)
DELETE /api/products/:id       Delete (admin)
```

### Orders
```
POST   /api/orders             Create order
GET    /api/orders/myorders    Your orders
GET    /api/orders             All orders (admin)
GET    /api/orders/:id         Order details
PUT    /api/orders/:id/deliver Mark delivered (admin)
```

---

## 🔒 Security Features

✅ JWT Tokens (30-day expiration)
✅ Password Hashing (bcryptjs)
✅ Protected Routes (Frontend + Backend)
✅ Admin Authorization Checks
✅ Input Validation
✅ CORS Enabled
✅ Error Middleware
✅ No Hardcoded Secrets

---

## 📊 Database Schema

**User**
- name, email, password (hashed), isAdmin, timestamps

**Product**
- name, price, image, brand, category, description, countInStock, timestamps

**Order**
- user (ref), orderItems (array), shippingAddress, paymentMethod
- totalPrice, isPaid, isDelivered, timestamps

---

## 🎨 UI Features

- Responsive design (mobile-first)
- Tailwind CSS styling
- Loading states
- Error toasts (react-hot-toast)
- Cart persistence (localStorage)
- Admin dropdown menu
- Smooth transitions

---

## 📝 Files Modified (14 Total)

**Backend (6):**
✓ server.js - Error middleware
✓ orderController.js - Error wrapper
✓ userController.js - Validation
✓ productController.js - Error handler
✓ orderRoutes.js - Fixed route order
✓ productRoutes.js - Fixed imports

**Frontend (8):**
✓ PlaceOrderScreen.jsx - axios
✓ LoginScreen.jsx - Redirect
✓ CartScreen.jsx - Auth check
✓ ShippingScreen.jsx - Redux
✓ ProductEditScreen.jsx - Upload
✓ ProfileScreen.jsx - Date safety
✓ ProductListScreen.jsx - Validation
✓ UserListScreen.jsx - Validation

---

## 🚀 Deployment

### To Vercel/Netlify (Frontend)
```bash
npm run build
# Upload dist/ folder
```

### To Heroku (Backend)
```bash
git push heroku main
# Set environment variables in dashboard
```

### To MongoDB Atlas
1. Create cluster
2. Add IP whitelist
3. Create database user
4. Copy connection string to .env

---

## ✨ Next Steps

1. **Test Everything** - Use quick test account
2. **Review Code** - Start with FIXES_SUMMARY.md
3. **Try Admin** - Create product, upload image
4. **Test Checkout** - Full 4-step flow
5. **Check Errors** - Intentional mistakes (wrong password, etc.)
6. **Deploy** - Follow DEPLOYMENT.md

---

## 🎓 Review Checklist

- [ ] Code runs without errors
- [ ] Can register and login
- [ ] Can browse and add products
- [ ] Can checkout (4-step)
- [ ] Can view order history
- [ ] Admin can manage products
- [ ] Admin can view orders
- [ ] Error handling works
- [ ] Images upload properly
- [ ] Mobile view works

---

## 💬 Need Help?

1. Check DEPLOYMENT.md for full setup
2. Check FIXES_SUMMARY.md for all issues
3. Check VERIFICATION.md for quality report
4. Review console for error messages
5. Check MongoDB for data integrity

---

**🎉 Ready to review! All systems go!**
