# ⚙️ Configuration Checklist

Follow this checklist to get your Skyweb backend up and running!

## ✅ Prerequisites

- [ ] Node.js installed (v14+)
- [ ] npm installed
- [ ] Code editor (VS Code recommended)
- [ ] Terminal/Command Prompt access

## 📋 Step-by-Step Configuration

### 1. MongoDB Setup

Choose ONE option:

#### Option A: Local MongoDB ⚡ (Fastest for development)
- [ ] Install MongoDB Community Edition
- [ ] Start MongoDB service
- [ ] Use connection string: `mongodb://localhost:27017/skyweb`

#### Option B: MongoDB Atlas ☁️ (Recommended for production)
- [ ] Go to https://www.mongodb.com/cloud/atlas
- [ ] Create free account
- [ ] Create a new cluster (free tier: M0)
- [ ] Click "Connect" → "Connect your application"
- [ ] Copy connection string
- [ ] Replace `<password>` with your password
- [ ] Replace database name with `skyweb`
- [ ] Add your IP to whitelist (0.0.0.0/0 for development)

**Your connection string should look like:**
```
mongodb+srv://username:password@cluster.mongodb.net/skyweb?retryWrites=true&w=majority
```

### 2. Cloudinary Setup 📸

- [ ] Go to https://cloudinary.com
- [ ] Sign up for free account
- [ ] Go to Dashboard
- [ ] Copy the following values:
  - [ ] **Cloud Name**: (found at top of dashboard)
  - [ ] **API Key**: (found in "Account Details" section)
  - [ ] **API Secret**: (click "Reveal" to see it)

### 3. Environment Variables Configuration

- [ ] Navigate to `backend/` folder
- [ ] Locate `.env.example` file
- [ ] Create a new file named `.env` (copy from .env.example)
- [ ] Fill in the following values:

```env
# Server Configuration
PORT=5000                    # ✅ Keep as is
NODE_ENV=development         # ✅ Keep as is

# MongoDB Configuration
MONGODB_URI=________________ # 📝 PASTE YOUR MONGODB CONNECTION STRING

# JWT Configuration
JWT_SECRET=_________________ # 📝 GENERATE A RANDOM STRING (see below)
JWT_EXPIRE=7d               # ✅ Keep as is

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=______ # 📝 PASTE YOUR CLOUDINARY CLOUD NAME
CLOUDINARY_API_KEY=_________ # 📝 PASTE YOUR CLOUDINARY API KEY
CLOUDINARY_API_SECRET=______ # 📝 PASTE YOUR CLOUDINARY API SECRET

# Admin Default Credentials
ADMIN_EMAIL=admin@skyweb.com # ✅ Keep as is (or change if you prefer)
ADMIN_PASSWORD=Admin@123     # ✅ Keep as is (change after first login)

# Frontend URL
FRONTEND_URL=http://localhost:3000 # ✅ Keep as is
```

### 3.1 SMTP (Email) — Applicant confirmation mails

To send confirmation emails via Gmail when a student applies, add these to your `.env`:

```env
# SMTP / Gmail
SMTP_USER=yourgmail@gmail.com        # Sender Gmail address
SMTP_PASS=rryz hzvz gefl zfyl smptp  # Gmail App Password (paste exactly)
SMTP_HOST=smtp.gmail.com             # Optional (defaults to smtp.gmail.com)
SMTP_PORT=465                        # Optional (465 for SSL, or 587 for TLS)
SMTP_SECURE=true                     # true for 465, false for 587
SMTP_FROM_NAME=SkyWeb Careers        # Optional display name
SMTP_FROM_EMAIL=yourgmail@gmail.com  # Optional (defaults to SMTP_USER)
SMTP_LOGO_URL=https://www.skywebdev.xyz/favicon.png # Optional logo in emails
```

Notes:
- Use a Gmail App Password (not your normal password). Enable 2-Step Verification in your Google Account, then create an App Password.
- If you prefer port 587, set `SMTP_PORT=587` and `SMTP_SECURE=false`.

### 4. Generate JWT Secret

Choose ONE method to generate a secure JWT secret:

#### Method 1: Online Generator
- [ ] Visit https://randomkeygen.com/
- [ ] Copy a "Fort Knox Password" (long random string)
- [ ] Paste into `JWT_SECRET` in `.env`

#### Method 2: Command Line (Mac/Linux)
```bash
openssl rand -base64 32
```
- [ ] Copy the output
- [ ] Paste into `JWT_SECRET` in `.env`

#### Method 3: Manual
- [ ] Create a random string (minimum 32 characters)
- [ ] Mix letters, numbers, and special characters
- [ ] Example: `MySuper$ecure!JWT@Secret#Key2024&Random`

### 5. Install Dependencies

- [ ] Open terminal in `backend/` folder
- [ ] Run: `npm install`
- [ ] Wait for installation to complete

### 6. Create First Admin User

- [ ] In terminal, run: `npm run seed:admin`
- [ ] You should see success message with admin credentials
- [ ] Note down the email and password

### 7. Start the Server

- [ ] In terminal, run: `npm run dev`
- [ ] You should see:
  ```
  ✅ MongoDB connected successfully
  🚀 Server running on port 5000
  📍 Environment: development
  ```

### 8. Test the API

- [ ] Test health endpoint:
  ```bash
  curl http://localhost:5000/api/health
  ```
  
- [ ] OR open browser and visit: `http://localhost:5000/api/health`
  
- [ ] You should see:
  ```json
  {
    "success": true,
    "message": "Server is running",
    "timestamp": "..."
  }
  ```

### 9. Test Login

- [ ] Test login endpoint:
  ```bash
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@skyweb.com","password":"Admin@123"}'
  ```

- [ ] You should receive a response with token:
  ```json
  {
    "success": true,
    "data": {
      "admin": { ... },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

### 10. Import Postman Collection (Optional but Recommended)

- [ ] Open Postman (or download from https://www.postman.com/)
- [ ] Click "Import"
- [ ] Select `backend/POSTMAN_COLLECTION.json`
- [ ] Collection is imported with all endpoints
- [ ] Update `baseUrl` variable if needed
- [ ] Test all endpoints!

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] Health endpoint returns success
- [ ] Login endpoint works and returns token
- [ ] Can create a team member (test with Postman)
- [ ] Can create a project (test with Postman)
- [ ] Images upload to Cloudinary successfully

## 🎯 You're Done!

If all checkboxes are checked, your backend is fully configured and ready to use! 🎉

## 🆘 Common Issues

### Issue: MongoDB Connection Failed

**Error message:** `MongoServerError: Authentication failed`

**Solutions:**
- [ ] Check username and password in connection string
- [ ] Ensure database user is created in MongoDB Atlas
- [ ] Check IP whitelist in MongoDB Atlas

---

**Error message:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solutions:**
- [ ] Ensure MongoDB service is running (for local MongoDB)
- [ ] Check if connection string is correct
- [ ] For local: Try `mongodb://127.0.0.1:27017/skyweb`

### Issue: Cloudinary Upload Fails

**Solutions:**
- [ ] Verify all three Cloudinary credentials are correct
- [ ] Check for extra spaces in `.env` file
- [ ] Ensure Cloudinary account is activated
- [ ] Check file size (must be under 5MB)

### Issue: Port Already in Use

**Error message:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions:**
- [ ] Change `PORT` in `.env` to `5001` or another port
- [ ] Or kill the process using port 5000

### Issue: JWT Token Invalid

**Solutions:**
- [ ] Check `JWT_SECRET` is set in `.env`
- [ ] Ensure token format is `Bearer {token}`
- [ ] Try logging in again to get fresh token

## 📞 Need More Help?

Check these documents:
- `README.md` - Overview and documentation
- `SETUP_GUIDE.md` - Detailed setup instructions
- `API_DOCUMENTATION.md` - API reference
- `QUICK_START.md` - Quick start guide

## 🎊 Success!

Once everything is working:
1. Change admin password (use update password endpoint)
2. Connect your frontend
3. Build admin panel
4. Deploy to production

Happy coding! 🚀

