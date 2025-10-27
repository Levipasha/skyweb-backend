# Skyweb Backend Setup Guide

Complete step-by-step guide to set up the Skyweb backend API.

## 📋 Prerequisites Checklist

Before starting, make sure you have:

- [ ] Node.js installed (v14 or higher) - [Download](https://nodejs.org/)
- [ ] MongoDB installed locally OR MongoDB Atlas account - [Get MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [ ] Cloudinary account - [Sign up for Cloudinary](https://cloudinary.com/users/register/free)
- [ ] Code editor (VS Code recommended)
- [ ] Terminal/Command Prompt
- [ ] API testing tool (Postman, Thunder Client, or similar)

## 🚀 Step-by-Step Setup

### Step 1: Install Dependencies

Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

This will install all required packages including Express, MongoDB, Cloudinary, etc.

### Step 2: MongoDB Setup

#### Option A: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service:
   - **Windows:** MongoDB should start automatically
   - **Mac:** `brew services start mongodb-community`
   - **Linux:** `sudo systemctl start mongod`

3. Your connection string will be:
   ```
   mongodb://localhost:27017/skyweb
   ```

#### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Click "Connect" → "Connect your application"
4. Copy your connection string (looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/skyweb?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Replace `myFirstDatabase` with `skyweb`

### Step 3: Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com/users/register/free)
2. Go to Dashboard
3. Copy these values:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### Step 4: Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` in your code editor

3. Fill in the values:

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration (use one of the options)
   MONGODB_URI=mongodb://localhost:27017/skyweb
   # OR
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skyweb

   # JWT Secret (generate a random string)
   JWT_SECRET=your_super_secret_random_string_here_make_it_long_and_secure

   # JWT Expiration
   JWT_EXPIRE=7d

   # Cloudinary Configuration (from Step 3)
   CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   CLOUDINARY_API_KEY=your_api_key_here
   CLOUDINARY_API_SECRET=your_api_secret_here

   # Admin Default Credentials
   ADMIN_EMAIL=admin@skyweb.com
   ADMIN_PASSWORD=Admin@123

   # Frontend URL
   FRONTEND_URL=http://localhost:3000
   ```

4. **Important:** For JWT_SECRET, use a long random string. You can generate one using:
   ```bash
   # On Mac/Linux
   openssl rand -base64 32
   
   # Or use an online generator
   # https://randomkeygen.com/
   ```

### Step 5: Create First Admin User

Run the seed script to create your first admin:

```bash
node scripts/seedAdmin.js
```

You should see output like:
```
✅ Connected to MongoDB
✅ Admin created successfully!
==================================
Email: admin@skyweb.com
Password: Admin@123
Role: super-admin
==================================
⚠️  Please change your password after first login!
```

### Step 6: Start the Server

Start the development server:

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
📍 Environment: development
```

### Step 7: Test the API

#### Using cURL:

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@skyweb.com","password":"Admin@123"}'
```

#### Using Postman/Thunder Client:

1. Create a new request
2. Set method to `POST`
3. URL: `http://localhost:5000/api/auth/login`
4. Body (JSON):
   ```json
   {
     "email": "admin@skyweb.com",
     "password": "Admin@123"
   }
   ```
5. Send request
6. You should receive a token in the response

## 🔧 Common Issues and Solutions

### Issue: MongoDB Connection Failed

**Error:** `MongooseServerSelectionError`

**Solutions:**
1. Make sure MongoDB is running:
   ```bash
   # Mac
   brew services list
   
   # Linux
   sudo systemctl status mongod
   
   # Windows - Check Services app
   ```

2. Check your connection string in `.env`
3. For Atlas, make sure your IP is whitelisted

### Issue: Cloudinary Upload Failed

**Error:** `Failed to upload image to Cloudinary`

**Solutions:**
1. Verify your Cloudinary credentials in `.env`
2. Make sure there are no spaces in your credentials
3. Check your Cloudinary account is active

### Issue: JWT Token Invalid

**Error:** `Invalid token`

**Solutions:**
1. Make sure JWT_SECRET is set in `.env`
2. Check token format: `Bearer {token}`
3. Token might be expired - login again

### Issue: Port Already in Use

**Error:** `Port 5000 is already in use`

**Solutions:**
1. Change PORT in `.env` to another value (e.g., 5001)
2. Or kill the process using port 5000:
   ```bash
   # Mac/Linux
   lsof -ti:5000 | xargs kill
   
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

## 📝 Next Steps

After successful setup:

1. **Change Admin Password**
   - Use the update password endpoint
   - Set a strong, unique password

2. **Test All Endpoints**
   - Use the API documentation
   - Test team and project CRUD operations

3. **Connect Frontend**
   - Update frontend API URL
   - Implement authentication
   - Test image uploads

4. **Deploy Backend** (Optional)
   - Choose a platform (Heroku, Railway, Render, etc.)
   - Set environment variables
   - Deploy and test

## 🔐 Security Checklist

Before deploying to production:

- [ ] Change default admin credentials
- [ ] Use strong JWT_SECRET (at least 32 characters)
- [ ] Set NODE_ENV to "production"
- [ ] Enable HTTPS
- [ ] Set proper CORS origins (not *)
- [ ] Review rate limiting settings
- [ ] Keep dependencies updated
- [ ] Never commit `.env` file to git
- [ ] Use environment variables for all secrets

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [JWT Documentation](https://jwt.io/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

## 🆘 Getting Help

If you encounter issues:

1. Check this guide again
2. Review error messages carefully
3. Check the main README.md
4. Review API_DOCUMENTATION.md
5. Contact the development team

## 🎉 Success!

If you've completed all steps and the server is running, congratulations! 🎊

You now have a fully functional Skyweb backend API ready for development and testing.

