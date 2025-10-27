# ⚡ Quick Start Guide

Get Skyweb backend running in 5 minutes!

## 📦 Installation

```bash
cd backend
npm install
```

## ⚙️ Configuration

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` with your credentials:**
   - MongoDB connection string
   - Cloudinary credentials (cloud name, API key, API secret)
   - JWT secret (use a long random string)

## 🗄️ Database Setup

**Option 1: Local MongoDB**
```bash
# Make sure MongoDB is running locally
# Default connection: mongodb://localhost:27017/skyweb
```

**Option 2: MongoDB Atlas**
```bash
# Update MONGODB_URI in .env with your Atlas connection string
```

## 👤 Create Admin

```bash
npm run seed:admin
```

This creates an admin with:
- Email: `admin@skyweb.com`
- Password: `Admin@123`

## 🚀 Start Server

```bash
npm run dev
```

Server will start at `http://localhost:5000`

## ✅ Test API

**Test health endpoint:**
```bash
curl http://localhost:5000/api/health
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@skyweb.com","password":"Admin@123"}'
```

## 📱 Import Postman Collection

1. Open Postman
2. Import `POSTMAN_COLLECTION.json`
3. Update `baseUrl` variable if needed
4. Use "Login" request to get token
5. Token is automatically saved for other requests

## 🎯 Next Steps

1. ✅ Backend is running
2. 🔐 Change admin password (use update password endpoint)
3. 📸 Test image upload with team/project creation
4. 🔗 Connect your frontend
5. 📚 Read full API documentation in `API_DOCUMENTATION.md`

## 🆘 Troubleshooting

**MongoDB connection error?**
- Check if MongoDB is running
- Verify connection string in `.env`

**Cloudinary upload fails?**
- Verify Cloudinary credentials in `.env`
- Make sure your account is active

**Port already in use?**
- Change PORT in `.env` to another value

Need more help? Check `SETUP_GUIDE.md` for detailed instructions.

## 📚 Documentation

- `README.md` - Complete documentation
- `SETUP_GUIDE.md` - Detailed setup instructions
- `API_DOCUMENTATION.md` - API reference
- `POSTMAN_COLLECTION.json` - API testing collection

---

**🎉 You're all set! Happy coding!**

