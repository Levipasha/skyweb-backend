# Skyweb Backend API

Backend API for Skyweb website with admin panel for managing team members and projects. Built with Node.js, Express, MongoDB, and Cloudinary.

## 🚀 Features

- **Authentication System**: JWT-based authentication for admin users
- **Team Management**: Full CRUD operations for team members
- **Project Management**: Full CRUD operations for projects
- **Image Upload**: Cloudinary integration for image storage
- **Security**: Helmet, CORS, rate limiting, and JWT protection
- **Validation**: Input validation and error handling
- **MongoDB**: NoSQL database for flexible data storage

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas account)
- Cloudinary account

## 🛠️ Installation

1. **Clone the repository and navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   
   Open `.env` and update the following:

   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/skyweb
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skyweb

   # JWT Secret (use a strong random string)
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   JWT_EXPIRE=7d

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Admin Default Credentials
   ADMIN_EMAIL=admin@skyweb.com
   ADMIN_PASSWORD=Admin@123

   # Frontend URL
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start the server**

   Development mode (with auto-reload):
   ```bash
   npm run dev
   ```

   Production mode:
   ```bash
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### 1. Register Admin
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "password123"
}
```

#### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "admin": {
      "id": "...",
      "name": "Admin Name",
      "email": "admin@example.com",
      "role": "admin"
    },
    "token": "jwt_token_here"
  }
}
```

#### 3. Get Current Admin
```http
GET /api/auth/me
Authorization: Bearer {token}
```

#### 4. Update Password
```http
PUT /api/auth/update-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

### Team Endpoints

#### 1. Get All Team Members
```http
GET /api/teams
GET /api/teams?isActive=true
GET /api/teams?page=1&limit=10
```

#### 2. Get Single Team Member
```http
GET /api/teams/:id
```

#### 3. Create Team Member (Protected)
```http
POST /api/teams
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "name": "John Doe",
  "role": "Frontend Developer",
  "bio": "Experienced developer...",
  "skills": ["React", "JavaScript", "CSS"],
  "social": {
    "email": "john@example.com",
    "linkedin": "https://linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe"
  },
  "image": [file],
  "order": 1,
  "isActive": true
}
```

#### 4. Update Team Member (Protected)
```http
PUT /api/teams/:id
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "name": "John Doe Updated",
  "role": "Senior Frontend Developer",
  "image": [file] // Optional
}
```

#### 5. Delete Team Member (Protected)
```http
DELETE /api/teams/:id
Authorization: Bearer {token}
```

### Project Endpoints

#### 1. Get All Projects
```http
GET /api/projects
GET /api/projects?status=completed
GET /api/projects?category=website
GET /api/projects?isActive=true&page=1&limit=10
```

#### 2. Get Projects by Status
```http
GET /api/projects/status/completed
GET /api/projects/status/ongoing
GET /api/projects/status/upcoming
```

#### 3. Get Single Project
```http
GET /api/projects/:id
```

#### 4. Create Project (Protected)
```http
POST /api/projects
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "title": "E-commerce Website",
  "description": "Modern e-commerce platform...",
  "tags": ["React", "Node.js", "MongoDB"],
  "projectUrl": "https://example.com",
  "status": "completed",
  "category": "e-commerce",
  "image": [file],
  "order": 1,
  "isActive": true
}
```

#### 5. Update Project (Protected)
```http
PUT /api/projects/:id
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "title": "Updated Project Title",
  "status": "ongoing",
  "image": [file] // Optional
}
```

#### 6. Delete Project (Protected)
```http
DELETE /api/projects/:id
Authorization: Bearer {token}
```

## 🗂️ Project Structure

```
backend/
├── config/
│   └── cloudinary.js         # Cloudinary configuration
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── teamController.js     # Team CRUD operations
│   └── projectController.js  # Project CRUD operations
├── middleware/
│   ├── auth.js               # JWT authentication
│   └── upload.js             # Multer file upload
├── models/
│   ├── Admin.js              # Admin model
│   ├── Team.js               # Team member model
│   └── Project.js            # Project model
├── routes/
│   ├── auth.js               # Auth routes
│   ├── team.js               # Team routes
│   └── project.js            # Project routes
├── utils/
│   └── dataUri.js            # Buffer to data URI converter
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore file
├── package.json              # Dependencies and scripts
├── server.js                 # Application entry point
└── README.md                 # Documentation
```

## 🔒 Security Features

- **Helmet**: Sets various HTTP headers for security
- **CORS**: Cross-Origin Resource Sharing configured
- **Rate Limiting**: Prevents brute force attacks
- **JWT**: Secure token-based authentication
- **Password Hashing**: bcrypt for password encryption
- **Input Validation**: Server-side validation for all inputs

## 🌐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port | No (default: 5000) |
| NODE_ENV | Environment (development/production) | No |
| MONGODB_URI | MongoDB connection string | Yes |
| JWT_SECRET | Secret key for JWT | Yes |
| JWT_EXPIRE | Token expiration time | No (default: 7d) |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name | Yes |
| CLOUDINARY_API_KEY | Cloudinary API key | Yes |
| CLOUDINARY_API_SECRET | Cloudinary API secret | Yes |
| FRONTEND_URL | Frontend URL for CORS | No (default: http://localhost:3000) |

## 🧪 Testing with Postman/Thunder Client

1. **Import the API collection** (if available)
2. **Set up environment variables** in your API client
3. **Start with authentication**:
   - Register an admin
   - Login to get JWT token
   - Use token in Authorization header for protected routes

## 🚀 Deployment

### Deploy to Heroku

1. Install Heroku CLI
2. Login to Heroku: `heroku login`
3. Create new app: `heroku create skyweb-api`
4. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set CLOUDINARY_CLOUD_NAME=your_cloud_name
   # ... set all other variables
   ```
5. Deploy: `git push heroku main`

### Deploy to Railway/Render

1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically on push

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "count": 10, // for list endpoints
  "total": 50  // for paginated endpoints
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message here"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the ISC License.

## 👥 Contact

For questions or support, contact the Skyweb team at admin@skyweb.com

## 🔄 Changelog

### Version 1.0.0
- Initial release
- Authentication system
- Team management
- Project management
- Cloudinary integration

