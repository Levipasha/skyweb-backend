# Skyweb API Documentation

Complete API reference for Skyweb backend.

## Table of Contents

1. [Authentication](#authentication)
2. [Team Management](#team-management)
3. [Project Management](#project-management)
4. [Error Handling](#error-handling)
5. [Status Codes](#status-codes)

---

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer {your_jwt_token}
```

### Register Admin

Create a new admin account.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "securePassword123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "admin": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Admin Name",
      "email": "admin@example.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Note:** The first admin created automatically gets `super-admin` role.

---

### Login

Authenticate admin and receive JWT token.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "admin": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Admin Name",
      "email": "admin@example.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Get Current Admin

Get currently logged in admin details.

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Admin Name",
    "email": "admin@example.com",
    "role": "admin",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Update Password

Update admin password.

**Endpoint:** `PUT /api/auth/update-password`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Password updated successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## Team Management

### Get All Team Members

Retrieve all team members with optional filtering.

**Endpoint:** `GET /api/teams`

**Query Parameters:**
- `isActive` (boolean): Filter by active status
- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Items per page (default: 100)

**Example:**
```
GET /api/teams?isActive=true&page=1&limit=10
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "role": "Frontend Developer",
      "bio": "Experienced frontend developer...",
      "image": {
        "url": "https://res.cloudinary.com/.../image.jpg",
        "publicId": "skyweb/team/xyz123"
      },
      "skills": ["React", "JavaScript", "CSS"],
      "social": {
        "email": "john@example.com",
        "linkedin": "https://linkedin.com/in/johndoe",
        "github": "https://github.com/johndoe"
      },
      "order": 1,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Get Single Team Member

Get details of a specific team member.

**Endpoint:** `GET /api/teams/:id`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "role": "Frontend Developer",
    "bio": "Experienced frontend developer...",
    "image": {
      "url": "https://res.cloudinary.com/.../image.jpg",
      "publicId": "skyweb/team/xyz123"
    },
    "skills": ["React", "JavaScript", "CSS"],
    "social": {
      "email": "john@example.com",
      "linkedin": "https://linkedin.com/in/johndoe"
    },
    "order": 1,
    "isActive": true
  }
}
```

---

### Create Team Member

Create a new team member (Admin only).

**Endpoint:** `POST /api/teams`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:**
- `name` (string, required): Member name
- `role` (string, required): Member role
- `bio` (string, required): Member biography
- `skills` (JSON string, required): Array of skills
- `social` (JSON string, required): Social links object
- `image` (file, required): Profile image
- `order` (number, optional): Display order
- `isActive` (boolean, optional): Active status

**Example (JavaScript/Fetch):**
```javascript
const formData = new FormData();
formData.append('name', 'John Doe');
formData.append('role', 'Frontend Developer');
formData.append('bio', 'Experienced developer...');
formData.append('skills', JSON.stringify(['React', 'JavaScript', 'CSS']));
formData.append('social', JSON.stringify({
  email: 'john@example.com',
  linkedin: 'https://linkedin.com/in/johndoe',
  github: 'https://github.com/johndoe'
}));
formData.append('image', imageFile);
formData.append('order', '1');
formData.append('isActive', 'true');

fetch('http://localhost:5000/api/teams', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  },
  body: formData
});
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "role": "Frontend Developer",
    "bio": "Experienced developer...",
    "image": {
      "url": "https://res.cloudinary.com/.../image.jpg",
      "publicId": "skyweb/team/xyz123"
    },
    "skills": ["React", "JavaScript", "CSS"],
    "social": {
      "email": "john@example.com",
      "linkedin": "https://linkedin.com/in/johndoe"
    },
    "order": 1,
    "isActive": true
  }
}
```

---

### Update Team Member

Update existing team member (Admin only).

**Endpoint:** `PUT /api/teams/:id`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:** (All fields optional except updating at least one)
- `name` (string): Member name
- `role` (string): Member role
- `bio` (string): Member biography
- `skills` (JSON string): Array of skills
- `social` (JSON string): Social links
- `image` (file): New profile image
- `order` (number): Display order
- `isActive` (boolean): Active status

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe Updated",
    // ... updated fields
  }
}
```

---

### Delete Team Member

Delete a team member (Admin only).

**Endpoint:** `DELETE /api/teams/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {},
  "message": "Team member deleted successfully"
}
```

**Note:** This also deletes the associated image from Cloudinary.

---

## Project Management

### Get All Projects

Retrieve all projects with optional filtering.

**Endpoint:** `GET /api/projects`

**Query Parameters:**
- `status` (string): Filter by status (completed/ongoing/upcoming)
- `category` (string): Filter by category (website/app/e-commerce/dashboard/other)
- `isActive` (boolean): Filter by active status
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 100)

**Example:**
```
GET /api/projects?status=completed&category=e-commerce&page=1&limit=10
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 10,
  "total": 25,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "E-commerce Platform",
      "description": "Modern e-commerce platform...",
      "image": {
        "url": "https://res.cloudinary.com/.../project.jpg",
        "publicId": "skyweb/projects/abc456"
      },
      "tags": ["React", "Node.js", "MongoDB"],
      "projectUrl": "https://example.com",
      "status": "completed",
      "category": "e-commerce",
      "order": 1,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Get Projects by Status

Get projects filtered by specific status.

**Endpoint:** `GET /api/projects/status/:status`

**Parameters:**
- `status`: completed | ongoing | upcoming

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page

**Example:**
```
GET /api/projects/status/completed?page=1&limit=10
```

---

### Get Single Project

Get details of a specific project.

**Endpoint:** `GET /api/projects/:id`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "E-commerce Platform",
    "description": "Modern e-commerce platform...",
    "image": {
      "url": "https://res.cloudinary.com/.../project.jpg",
      "publicId": "skyweb/projects/abc456"
    },
    "tags": ["React", "Node.js", "MongoDB"],
    "projectUrl": "https://example.com",
    "status": "completed",
    "category": "e-commerce",
    "order": 1,
    "isActive": true
  }
}
```

---

### Create Project

Create a new project (Admin only).

**Endpoint:** `POST /api/projects`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:**
- `title` (string, required): Project title
- `description` (string, required): Project description
- `tags` (JSON string, required): Array of tags
- `image` (file, required): Project image
- `projectUrl` (string, optional): Project URL
- `status` (string, optional): completed/ongoing/upcoming (default: ongoing)
- `category` (string, optional): Project category (default: other)
- `order` (number, optional): Display order
- `isActive` (boolean, optional): Active status

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "E-commerce Platform",
    "description": "Modern e-commerce platform...",
    "image": {
      "url": "https://res.cloudinary.com/.../project.jpg",
      "publicId": "skyweb/projects/abc456"
    },
    "tags": ["React", "Node.js", "MongoDB"],
    "projectUrl": "https://example.com",
    "status": "completed",
    "category": "e-commerce"
  }
}
```

---

### Update Project

Update existing project (Admin only).

**Endpoint:** `PUT /api/projects/:id`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:** (All fields optional)
- `title` (string): Project title
- `description` (string): Project description
- `tags` (JSON string): Array of tags
- `image` (file): New project image
- `projectUrl` (string): Project URL
- `status` (string): Project status
- `category` (string): Project category
- `order` (number): Display order
- `isActive` (boolean): Active status

---

### Delete Project

Delete a project (Admin only).

**Endpoint:** `DELETE /api/projects/:id`

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {},
  "message": "Project deleted successfully"
}
```

---

## Error Handling

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

### Common Errors

**400 Bad Request**
```json
{
  "success": false,
  "error": "Please provide all required fields"
}
```

**401 Unauthorized**
```json
{
  "success": false,
  "error": "Not authorized to access this route. Please login."
}
```

**404 Not Found**
```json
{
  "success": false,
  "error": "Team member not found"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "error": "Server error"
}
```

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

---

## Rate Limiting

- **Window:** 15 minutes
- **Max Requests:** 100 per IP
- **Applies to:** All `/api/*` endpoints

When rate limit is exceeded:
```json
{
  "success": false,
  "error": "Too many requests from this IP, please try again later."
}
```

