# ![Property Hub](https://i.ibb.co/R967xSJ/Property-Hub-Logo-White.png) Property Hub

Welcome to **Property Hub**, your trusted partner in real estate. Whether you're looking to buy, sell, or rent properties, our platform is designed to help you achieve your goals with ease. Built using modern web technologies, Property Hub provides a seamless experience for users to manage their real estate needs.

---

## 📚 Introduction

### ALX Africa

<p align="center">
  <img src="https://i.ibb.co/1qkhfxL/331711958-123294657170334-4784535244227879753-n.png" alt="ALX Africa Logo">
</p>

ALX Africa is an innovative education platform that offers intensive training programs in software engineering and other technology-related fields. Through a project-based and peer learning approach, ALX Africa prepares students for careers in the tech industry by providing them with practical skills and industry-relevant knowledge.

For more information about ALX Africa, please visit this [link](https://www.alxafrica.com/).

### Holberton School

<p align="center">
  <img src="https://i.ibb.co/CzCNThD/unnamed-2.png" alt="Holberton School Logo">
</p>

Holberton School is a project-based alternative to college for the next generation of software engineers. Through a peer-learning curriculum and hands-on projects, Holberton School empowers students to become highly skilled and adaptive engineers who can solve complex real-world problems. Holberton's graduates are equipped to excel in a fast-paced and constantly evolving tech industry.

For more information about Holberton School, please visit this [link](https://www.holbertonschool.com/).

---

## 📌 Table of Contents

- [Property Hub](#-property-hub)
  - [📚 Introduction](#-introduction)
    - [ALX Africa](#alx-africa)
    - [Holberton School](#holberton-school)
  - [📌 Table of Contents](#-table-of-contents)
  - [📄 Project Overview](#-project-overview)
  - [🛠️ Getting Started](#️-getting-started)
  - [👥 Team Members](#-team-members)
  - [📜 API Overview](#-api-overview)
  - [🔐 Authentication](#-authentication)
  - [📖 API Endpoints](#-api-endpoints)
    - [Users API](#users-api)
    - [Properties API](#properties-api)
    - [Agents API](#agents-api)
    - [Admin API](#admin-api)
    - [Transactions API](#transactions-api)
  - [🚨 Validation and Error Handling](#-validation-and-error-handling)
  - [📦 Testing](#-testing)
  - [📝 License](#-license)

---

## 📄 Project Overview

**Property Hub** is a comprehensive real estate web application. It allows users to search for properties based on various criteria, create listings, and manage user profiles. The project is divided into two main parts: the **frontend** (client-side) built with React.js and the **backend** (server-side) built with Node.js, Express.js, and MongoDB.

The backend API is designed to manage the core real estate functionalities: managing users, properties, agents, and transactions. The API also includes JWT-based authentication and Google OAuth integration.

---

## 🛠️ Tech Stack & Dependencies

**Property Hub** leverages a modern and scalable tech stack to ensure optimal performance and seamless user experience. Below is a breakdown of the key technologies and tools used:

### 🚀 Backend:
- **Node.js** - JavaScript runtime built on Chrome's V8 engine, used to build a fast and scalable backend.
- **Express.js** - Web framework for Node.js, simplifying the process of building APIs.
- **MongoDB** - NoSQL database providing a flexible, scalable solution for storing property listings, user data, and more.
- **JWT (JSON Web Tokens)** - Secure authentication method used for user verification.
- **Passport.js** - Middleware for authentication, integrated with Google OAuth for seamless user sign-in and sign-up.
  
### 🌐 Frontend:
- **React.js** - A popular JavaScript library for building dynamic and responsive user interfaces.
- **Redux** - State management tool to handle complex application states in a predictable way.
- **HTML5** - The backbone for structuring the web pages of the client-side.
- **CSS3** - Modern stylesheets for responsive and visually engaging UI designs.
- **JavaScript (ES6+)** - Core scripting language for adding interactivity to web pages.

### 📦 DevOps & Utilities:
- **Vite** - Next-generation frontend tooling to serve and build faster React apps.
- **Mongoose** - Elegant MongoDB object modeling for Node.js.
- **Jest** - Testing framework used for ensuring the correctness of our codebase.
- **Supertest** - Library for testing Node.js HTTP servers.
- **ESLint** - Linter tool to maintain code quality and consistency.
  
### ⚙️ Miscellaneous:
- **Git** - Version control system for tracking changes and collaborating on code.
- **Postman** - API client used to test, debug, and document our API endpoints.
- **dotenv** - Environment variable manager to handle sensitive configurations securely.
  
By combining these technologies, **Property Hub** ensures a high-performance, reliable, and user-friendly experience that supports complex real estate operations like property management, agent interactions, and user authentication.


---

## 🛠️ Getting Started

To get a local copy of **Property Hub** up and running, follow these simple steps.

### ⚙️ Prerequisites

Before you begin, make sure you have the following installed on your machine:

- **Node.js** (v14.x or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.x or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - Version control system to clone the repository.

---

### ⚙️ Installation

Follow these steps to install and set up the project locally:

1. **Clone the repository**:

    Open your terminal and run the following command:

    ```bash
    git clone https://github.com/Imranelaf/alx-final-project
    cd alx-final-project
    ```

2. **Install backend dependencies**:

    Navigate to the `server` folder and install the necessary packages:

    ```bash
    cd server
    npm install
    ```

3. **Install frontend dependencies**:

    Navigate to the client folder and install the necessary packages:

    ```bash
    cd ../client
    npm install
    ```
---

### 🔑 Environment Variables

To run this project, you will need to set up the following environment variables in your project.

#### Backend Environment Variables

Create a `.env` file in the `server` directory and add the following:

```bash
# Server Configuration
PORT=5000

# Database Configuration
MONGODB_URI="<mongodb-uri>"

# JWT Configuration
JWT_SECRET="<your-jwt-secret>"
JWT_COOKIE_NAME="propertyHubAuthToken"
JWT_EXPIRES_IN="3d"
JWT_ISSUER="propertyHub"
JWT_AUDIENCE="propertyHubApp"

# Google OAuth Configuration
GOOGLE_OAUTH_CLIENT_ID="<google-oauth-client-id>"
GOOGLE_OAUTH_CLIENT_SECRET="<google-oauth-client-secret>"
GOOGLE_OAUTH_SIGNUP_REDIRECT_URI="<google-signup-redirect-uri>"
GOOGLE_OAUTH_SIGNIN_REDIRECT_URI="<google-signin-redirect-uri>"

# Client Configuration (Frontend)
CLIENT_URI="<frontend-client-uri>"

# Node Environment
NODE_ENV="development"
```

#### Frontend Environment Variables

Create a `.env` file in the `client` directory and add the following:

```bash
# API Configuration
VITE_API_URL="<backend-server-uri>"

# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME="<cloudinary-cloud-name>"
VITE_CLOUDINARY_UPLOAD_PRESET="<cloudinary-upload-preset>"

# JWT Configuration
VITE_JWT_COOKIE_NAME="propertyHubAuthToken"
```

---

## 📜 API Documentation

## 🔐 Authentication

The authentication system in **Property Hub** includes routes for both local authentication and Google OAuth. These routes allow users, admins, and agents to register, log in, and manage authentication sessions using JWT tokens.

### Authentication Endpoints

#### Google OAuth Authentication

| Method | Endpoint                           | Description                                              |
|--------|------------------------------------|----------------------------------------------------------|
| GET    | `/api/auth/google/signup`          | Initiates the Google OAuth sign-up process.               |
| GET    | `/api/auth/google/signin`          | Initiates the Google OAuth sign-in process.               |
| GET    | `/api/auth/google/signup/callback` | Callback for handling Google OAuth sign-up and token generation. |
| GET    | `/api/auth/google/signin/callback` | Callback for handling Google OAuth sign-in and token generation. |

- **Google OAuth Signup**: After the user authenticates with Google, they will be redirected to the `/signup/success` or `/signup/failure` URL, depending on the result.
- **Google OAuth Signin**: After signing in with Google, users are redirected to `/signin/success` or `/signin/failure`.

#### Local Authentication (Users)

| Method | Endpoint                 | Description                             |
|--------|--------------------------|-----------------------------------------|
| POST   | `/api/auth/signup`        | Registers a new user account.           |
| POST   | `/api/auth/signin`        | Logs in a user and returns a JWT token. |
| POST   | `/api/auth/logout`        | Logs out the current user and clears the JWT cookie. |
| GET    | `/api/auth/check-username/:username` | Checks if a username is available. |
| GET    | `/api/auth/check-email/:email`       | Checks if an email is already registered. |

#### Admin Authentication

| Method | Endpoint                  | Description                             |
|--------|---------------------------|-----------------------------------------|
| POST   | `/api/auth/admins/signup`  | Registers a new admin account (Super Admin only). |
| POST   | `/api/auth/admins/login`   | Logs in an admin and returns a JWT token. |

- **Admin Signup**: Admins are created only by a super admin. JWT tokens are issued upon successful registration.
- **Admin Login**: Admins log in using their credentials and receive a JWT token to authenticate future requests.

#### Agent Authentication

| Method | Endpoint                 | Description                             |
|--------|--------------------------|-----------------------------------------|
| POST   | `/api/auth/agents/signup` | Registers a new agent account.          |
| POST   | `/api/auth/agents/login`  | Logs in an agent and returns a JWT token. |

- **Agent Signup**: Any user can register as an agent, and a JWT token is issued upon successful registration.
- **Agent Login**: Agents log in using their credentials and receive a JWT token to authenticate future requests.

### Token-Based Authentication (JWT)

**JWT (JSON Web Token)** is used for securing endpoints. Upon successful login or sign-up, a JWT token is issued and stored as a cookie on the client side. This token must be included in subsequent requests to authenticate the user.

**Cookie Name**: The JWT token is stored in a cookie named `propertyHubAuthToken`.

### Example Requests

#### 1. **User Signup (Local)**

```bash
POST /api/auth/signup

{
  "firstName": "Abdessamad",
  "lastName": "Haddouche",
  "username": "abdessamad",
  "email": "abdessamad.hadd@gmail.com",
  "password": "Password123"
}
```
Response

```bash
{
    "success": true,
    "message": "User registered successfully.",
    "data": {
        "firstName": "Abdessamad",
        "lastName": "Haddouche",
        "username": "abdessamad",
        "email": "abdessamadhadd@gmail.com",
        "avatar": "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651_640.png",
    }
}
```

#### 2. **User Login (Local)**

```bash
POST /api/auth/signin

{
  "email": "abdessamadhadd@gmail.com",
  "password": "Password123"
}
```
Response

```bash
{
  "success": true,
  "message": "User logged in successfully!",
  "data": {
    "firstName": "Abdessamad",
    "lastName": "Haddouche",
    "username": "abdessamad",
    "email": "abdessamadhadd@gmail.com",
    "avatar": "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651_640.png"
  }
}
```

#### 3. **Admin Signup**

```bash
POST /api/auth/admins/signup

{
  "firstName": "Abdessamad",
  "lastName": "Haddouche",
  "username": "adminsuper",
  "email": "abdessamad.super@gmail.com",
  "phoneNumber": "+1234567890",
  "password": "AdminPass123"
}
```
Response

```bash
{
  "success": true,
  "message": "Admin created successfully.",
  "data": {
    "firstName": "Abdessamad",
    "lastName": "Haddouche",
    "username": "adminsuper",
    "email": "abdessamad.super@gmail.com"
    "phoneNumber": "+1234567890",
  }
}
```

#### 4. **Admin Login**

```bash
POST /api/auth/admins/login

{
  "email": "abdessamad.super@gmail.com",
  "password": "AdminPass123"
}

```
Response

```bash
{
  "success": true,
  "message": "Admin logged in successfully!",
  "data": {
    "firstName": "Abdessamad",
    "lastName": "Haddouche",
    "username": "adminsuper",
    "email": "abdessamad.super@gmail.com",
    "phoneNumber": "+1234567890",
  }
}
```

#### 5. **Agent Signup**

```bash
POST /api/auth/agents/signup

{
  "firstName": "Agent",
  "lastName": "Smith",
  "username": "agentsmith",
  "email": "agentsmith@example.com",
  "phoneNumber": "+1234567891",
  "agency": "Real Estate Co.",
  "licenseNumber": "12345678",
  "password": "AgentPass123"
}

```
Response

```bash
{
  "success": true,
  "message": "Agent created successfully.",
  "data": {
    "username": "agentsmith",
    "email": "agentsmith@example.com",
    "_id": "605c72df0e3a2c10f8052d18"
  }
}
```

#### 6. **Agent Login**

```bash
POST /api/auth/agents/login

{
  "email": "agentsmith@example.com",
  "password": "AgentPass123"
}
```
Response

```bash
{
  "success": true,
  "message": "Agent logged in successfully!",
  "data": {
    "username": "agentsmith",
    "email": "agentsmith@example.com",
    "_id": "605c72df0e3a2c10f8052d18"
  }
}
```

#### 7. **User Logout**

```bash
POST /api/auth/logout
```
Response

```bash
{
  "success": true,
  "message": "User logged out successfully."
}
```

#### 8. **Check if Username is Available**

```bash
GET /api/auth/check-username/johndoe
```
Response

```bash
{
  "success": true,
  "available": false
}
```

#### 9. **Check if Email is Registered**

```bash
GET /api/auth/check-email/johndoe@example.com
```
Response

```bash
{
  "success": true,
  "available": false
}
```

---

### 👤 User Management

The User Management API allows for managing user profiles, updating information, and handling user-specific property listings. This section includes endpoints for retrieving user data, updating profiles, and adding/removing properties associated with users.

### User Management Endpoints

| Method | Endpoint                          | Description                                                |
|--------|-----------------------------------|------------------------------------------------------------|
| GET    | `/api/users`                      | Retrieves a list of users based on filters (public access). |
| GET    | `/api/users/:id`                  | Retrieves a specific user by their ID (public access).      |
| PUT    | `/api/users/:id`                  | Updates user information (admin or user-only).              |
| DELETE | `/api/users/:id`                  | Deletes a user (admin or user-only).                        |
| POST   | `/api/users/:userId/add-property` | Adds a property to the user's list (admin or user-only).    |
| PUT    | `/api/users/:userId/remove-property` | Removes a property from the user's list (admin or user-only). |

### User Management Actions

- **Get All Users**: Fetches a list of all users with optional filtering capabilities.
- **Get User by ID**: Retrieves detailed information for a specific user by their unique ID.
- **Update User**: Allows a user or an admin to update profile information, such as email or username.
- **Delete User**: Deletes a user account, either by the user themselves or by an admin.
- **Add Property to User**: Allows the user to add a property to their list of owned or managed properties.
- **Remove Property from User**: Removes a property from the user's list of owned or managed properties.

### Example Requests

#### 1. **Get Users by Filter**

```bash
GET /api/users
```
Response

```bash
{
  "success": true,
  "data": [
    {
      "_id": "67110e193f6922174bc674a4",
      "firstName": "Abdessamad",
      "lastName": "Haddouche",
      "username": "abdessamad",
      "email": "abdessamadhadd@gmail.com",
      "avatar": "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651_640.png"
    },
    {
      "_id": "67110e193f6922174bc674a5",
      "firstName": "Imrane",
      "lastName": "ALI LAFKIH",
      "username": "irmanelaf",
      "email": "imranelaf@gmail.com",
      "avatar": "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651_640.png"
    }
  ]
}
```

```bash
GET /api/users?firstName=Abdessamad
```
Response

```bash
{
  "success": true,
  "data": [
    {
      "_id": "67110e193f6922174bc674a4",
      "firstName": "Abdessamad",
      "lastName": "Haddouche",
      "username": "abdessamad",
      "email": "abdessamadhadd@gmail.com",
      "avatar": "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651_640.png"
    }
  ]
}
```

```bash
GET /api/users?email=abdessamadhadd@gmail.com&accountStatus=active
```
Response

```bash
{
  "success": true,
  "data": [
    {
      "_id": "67110e193f6922174bc674a4",
      "firstName": "Abdessamad",
      "lastName": "Haddouche",
      "username": "abdessamad",
      "email": "abdessamadhadd@gmail.com",
      "avatar": "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651_640.png",
      "accountStatus": "active"
    }
  ]
}
```

#### 2. **Get User by ID**

```bash
GET /api/users/67110e193f6922174bc674a4
```
Response

```bash
{
  "success": true,
  "data": {
    "_id": "67110e193f6922174bc674a4",
    "firstName": "Abdessamad",
    "lastName": "Haddouche",
    "username": "abdessamad",
    "email": "abdessamadhadd@gmail.com",
    "avatar": "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651_640.png"
  }
}
```

#### 3. **Update User**

```bash
PUT /api/users/67110e193f6922174bc674a4

{
  "firstName": "Abdessamad",
  "lastName": "Haddouche",
  "username": "abdessamad",
  "email": "newemail@gmail.com"
}
```

Response

```bash
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "_id": "67110e193f6922174bc674a4",
    "firstName": "Abdessamad",
    "lastName": "Haddouche",
    "username": "abdessamad",
    "email": "newemail@gmail.com"
  }
}
```

#### 4. **Delete User**

```bash
DELETE /api/users/67110e193f6922174bc674a4
```
Response

```bash
{
  "success": true,
  "message": "User deleted successfully"
}
```

#### 5. **Add Property to User**

```bash
POST /api/users/67110e193f6922174bc674a4/add-property

{
  "propertyId": "5f5a8c7e3c6d281f8e8a7a3c"
}
```

Response

```bash
{
  "success": true,
  "message": "Property added to user's list",
  "data": {
    "propertyId": "5f5a8c7e3c6d281f8e8a7a3c",
    "userId": "67110e193f6922174bc674a4"
  }
}
```

#### 6. **Remove Property from User**

```bash
PUT /api/users/67110e193f6922174bc674a4/remove-property

{
  "propertyId": "5f5a8c7e3c6d281f8e8a7a3c"
}
```
Response

```bash
{
  "success": true,
  "message": "Property removed from user's list",
  "data": {
    "propertyId": "5f5a8c7e3c6d281f8e8a7a3c",
    "userId": "67110e193f6922174bc674a4"
  }
}
```

---

### 🏘️ Property Management

The **Property Management** API enables authenticated users, agents, and admins to create, update, and manage properties. This section covers how users can create new properties, update existing ones, and manage property-related details such as images and amenities.

### Property Management Endpoints

| Method | Endpoint                         | Description                                                          |
|--------|----------------------------------|----------------------------------------------------------------------|
| POST   | `/api/properties`                | Creates a new property (authenticated users only).                    |
| GET    | `/api/properties/:id`            | Retrieves a specific property by its ID (public access).              |
| PUT    | `/api/properties/:id`            | Updates a property (admin, agent, or property owner only).            |
| DELETE | `/api/properties/:id`            | Deletes a property (admin or property owner only).                    |
| GET    | `/api/properties`                | Retrieves properties, with optional filters (public access).          |
| PUT    | `/api/properties/:id/images`     | Adds an image to a property (admin, agent, or property owner only).   |
| PUT    | `/api/properties/:id/images/remove` | Removes an image from a property (admin, agent, or property owner only). |
| PUT    | `/api/properties/:id/amenities`  | Adds an amenity to a property (admin, agent, or property owner only). |
| PUT    | `/api/properties/:id/amenities/remove` | Removes an amenity from a property (admin, agent, or property owner only). |

### Property Management Actions

- **Create Property**: Authenticated users (with appropriate roles) can create new property listings by submitting the required details, such as property location, price, and description.
- **Get Property by ID**: Retrieves the details of a property using its unique ID.
- **Update Property**: Allows admins, agents, or property owners to modify the details of a property they own or manage.
- **Delete Property**: Admins or property owners can delete a property from the system.
- **Get Properties by Filter**: Retrieves a list of properties based on optional filters such as location, price range, or property type.
- **Add Property Image**: Uploads an image to an existing property listing.
- **Remove Property Image**: Removes an image from a property listing.
- **Add Property Amenity**: Adds an amenity (e.g., pool, gym) to a property.
- **Remove Property Amenity**: Removes an amenity from a property.

### Example Requests

#### 1. **Create a Property By Filter**

```bash
POST /api/properties

{
  "title": "Modern Apartment",
  "description": "A modern apartment located in the heart of the city.",
  "propertyType": "Apartment",
  "price": 250000,
  "phoneNumber": 212626532403,
  "size": 1200,
  "bedrooms": 3,
  "bathrooms": 2,
  "rooms": 5,
  "offerType": "Sale",
  "wifi": true,
  "petFriendly": false,
  "parking": true,
  "yearBuilt": 2015,
  "availableFrom": "2023-10-01",
  "address": {
    "street": "123 Main St",
    "city": "Nador",
    "state": "Oriental",
    "zipCode": "62700",
    "country": "Morocco"
  },
  "coordinates": {
    "lat": 33.5731,
    "lng": -7.5898
  },
  "agentId": "671305e3bfbb0b7b2ffa0cbb",
  "userId": "672211ff6a1a5418f1fe815e"
}
```
Response

```bash
{
  "success": true,
  "message": "Property created successfully.",
  "data": {
    "_id": "67112c113279b4c07ffa6ce5",
    "title": "Modern Apartment",
    "description": "A modern apartment located in the heart of the city.",
    "price": 250000,
    "size": 1200,
    "bedrooms": 3,
    "bathrooms": 2,
    "offerType": "Sale",
    "wifi": true,
    "petFriendly": false,
    "parking": true,
    "yearBuilt": 2015,
    "availableFrom": "2023-10-01",
    "address": {
      "street": "123 Main St",
      "city": "Casablanca",
      "state": "Casablanca-Settat",
      "zipCode": "20000",
      "country": "Morocco"
    },
    "coordinates": {
      "lat": 33.5731,
      "lng": -7.5898
    }
  }
}
```

```bash
GET /api/properties?propertyType=Apartment&price[gte]=100000&price[lte]=300000
```
Response

```bash
{
  "success": true,
  "data": [
    {
      "_id": "605c72df0e3a2c10f8052d18",
      "title": "Modern Apartment",
      "description": "A modern apartment located in the heart of the city.",
      "price": 250000,
      "size": 1200,
      "bedrooms": 3,
      "bathrooms": 2,
      "propertyType": "Apartment",
      "offerType": "Sale"
    }
  ]
}
```

#### 2. **Get Property by ID**

```bash
GET /api/properties/67112c113279b4c07ffa6ce5
```
Response

```bash
{
  "success": true,
  "data": {
    "_id": "67112c113279b4c07ffa6ce5",
    "title": "Modern Apartment",
    "description": "A modern apartment located in the heart of the city.",
    "price": 250000,
    "size": 1200,
    "bedrooms": 3,
    "bathrooms": 2,
    "offerType": "Sale",
    "wifi": true,
    "petFriendly": false,
    "parking": true,
    "yearBuilt": 2015,
    "availableFrom": "2023-10-01",
    "address": {
      "street": "123 Main St",
      "city": "Casablanca",
      "state": "Casablanca-Settat",
      "zipCode": "20000",
      "country": "Morocco"
    },
    "coordinates": {
      "lat": 33.5731,
      "lng": -7.5898
    }
  }
}
```

#### 3. **Update Property**

```bash
PUT /api/properties/67112c113279b4c07ffa6ce5

{
  "price": 260000,
  "description": "Updated modern apartment with new interiors."
}
```
Response

```bash
{
  "success": true,
  "message": "Property updated successfully.",
  "data": {
    "_id": "67112c113279b4c07ffa6ce5",
    "title": "Modern Apartment",
    "description": "Updated modern apartment with new interiors.",
    "price": 260000
  }
}
```

#### 4. **Delete Property**

```bash
DELETE /api/properties/67112c113279b4c07ffa6ce5
```
Response

```bash
{
    "success": true,
    "message": "Property deleted and references updated successfully!"
}
```

#### 5. **Add Image to Property**

```bash
PUT /api/properties/605c72df0e3a2c10f8052d18/images

{
  "imageUrl": "https://example.com/images/apartment1.jpg"
}
```
Response

```bash
{
  "success": true,
  "message": "Image added successfully.",
  "data": {
    "imageUrl": "https://example.com/images/apartment1.jpg",
    "propertyId": "605c72df0e3a2c10f8052d18"
  }
}
```

#### 6. **Remove Image from Property**

```bash
PUT /api/properties/605c72df0e3a2c10f8052d18/images/remove

{
  "imageUrl": "https://example.com/images/apartment1.jpg"
}
```

Response

```bash
{
  "success": true,
  "message": "Image removed successfully.",
  "data": {
    "imageUrl": "https://example.com/images/apartment1.jpg",
    "propertyId": "605c72df0e3a2c10f8052d18"
  }
}
```

#### 7. **Add Amenity to Property**

```bash
PUT /api/properties/605c72df0e3a2c10f8052d18/amenities

{
  "amenity": "Gym"
}
```
Response

```bash
{
  "success": true,
  "message": "Amenity added successfully.",
  "data": {
    "amenity": "Gym",
    "propertyId": "605c72df0e3a2c10f8052d18"
  }
}
```

#### 8. **Remove Amenity from Property**

```bash
PUT /api/properties/605c72df0e3a2c10f8052d18/amenities/remove

{
  "amenity": "Gym"
}
```
Response

```bash
{
  "success": true,
  "message": "Amenity removed successfully.",
  "data": {
    "amenity": "Gym",
    "propertyId": "605c72df0e3a2c10f8052d18"
  }
}
```

#### 9. **Remove Property from User**

```bash
PUT /api/properties/605c72df0e3a2c10f8052d18/amenities/remove

{
  "amenity": "Gym"
}
```
Response

```bash
{
  "success": true,
  "message": "Amenity removed successfully.",
  "data": {
    "amenity": "Gym",
    "propertyId": "605c72df0e3a2c10f8052d18"
  }
}
```

---

### 👨‍💼 Agent Management

The **Agent Management** API allows for managing real estate agents on the platform. Admins have control over agent approval and status updates, while agents can manage their own profiles. This section covers how admins can approve or reject agents and how agents can update their profiles.

### Agent Management Endpoints

| Method | Endpoint                       | Description                                                          |
|--------|--------------------------------|----------------------------------------------------------------------|
| GET    | `/api/agents`                  | Retrieves a list of agents based on filters (public access).          |
| GET    | `/api/agents/:id`              | Retrieves a specific agent by their ID (public access).               |
| PATCH  | `/api/agents/:id/status`       | Updates the status of an agent (admin-only).                          |
| PUT    | `/api/agents/:id`              | Updates agent information (admin or agent-only).                      |
| DELETE | `/api/agents/:id`              | Deletes an agent (admin or agent-only).                               |

### Agent Management Actions

- **Get All Agents**: Fetches a list of agents based on optional filters like name, status, or experience level.
- **Get Agent by ID**: Retrieves detailed information about a specific agent by their unique ID.
- **Update Agent Status**: Admins can approve or reject agent applications by updating the agent's status.
- **Update Agent Profile**: Agents can update their personal information, or admins can make changes on their behalf.
- **Delete Agent**: Agents can delete their accounts, or admins can remove agents from the system.

### Example Requests

#### 1. **Get All Agents**

```bash
GET /api/agents
```
Response

```bash
{
  "success": true,
  "data": [
    {
      "_id": "67110e193f6922174bc674a4",
      "firstName": "Agent",
      "lastName": "Smith",
      "email": "agentsmith@example.com",
      "agency": "Real Estate Co.",
      "licenseNumber": "12345678",
      "agentStatus": "Pending"
    },
    {
      "_id": "67110e193f6922174bc674a5",
      "firstName": "John",
      "lastName": "Doe",
      "email": "johndoe@example.com",
      "agency": "Property Experts",
      "licenseNumber": "98765432",
      "agentStatus": "Approved"
    }
  ]
}
```

#### 2. **Get Agent by ID**

```bash
GET /api/agents/67110e193f6922174bc674a5

```

Response

```bash
{
  "success": true,
  "data": {
    "_id": "67110e193f6922174bc674a5",
    "firstName": "John",
    "lastName": "Doe",
    "email": "johndoe@example.com",
    "agency": "Property Experts",
    "licenseNumber": "98765432",
    "agentStatus": "active"
  }
}
```

#### 3. **Update Agent Status (Admin Only)**

```bash

PATCH /api/agents/67110e193f6922174bc674a5/status

{
  "agentStatus": "active"
}
```
Response

```bash
{
  "success": true,
  "message": "Agent status updated successfully.",
  "data": {
    "_id": "67110e193f6922174bc674a5",
    "agentStatus": "active"
  }
}
```

#### 4. **Update Agent Profile**

```bash
PUT /api/agents/67110e193f6922174bc674a5

{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "janedoe@example.com"
}
```

Response

```bash
{
  "success": true,
  "message": "Agent profile updated successfully.",
  "data": {
    "_id": "67110e193f6922174bc674a5",
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "janedoe@example.com"
  }
}
```

#### 5. **Delete Agent**

```bash
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "janedoe@example.com"
}
```

```bash
{
  "success": true,
  "message": "Agent deleted successfully."
}
```

---

### 🛠️ Admin Management

The **Admin Management** API allows super admins to manage other admins within the system. Admins can update their own profiles, and super admins have the authority to update or delete other admins. This section covers how to retrieve, update, and delete admins.

### Admin Management Endpoints

| Method | Endpoint                | Description                                                     |
|--------|-------------------------|-----------------------------------------------------------------|
| GET    | `/api/admin`            | Retrieves a list of all admins (admin-only access).              |
| GET    | `/api/admin/:id`        | Retrieves a specific admin by their ID (admin-only access).      |
| PUT    | `/api/admin/:id`        | Updates admin information (admin or super admin-only).           |
| DELETE | `/api/admin/:id`        | Deletes an admin (super admin-only).                             |

### Admin Management Actions

- **Get All Admins**: Fetches a list of all admins with admin-only access.
- **Get Admin by ID**: Retrieves detailed information for a specific admin by their unique ID (admin-only access).
- **Update Admin Information**: Allows admins to update their personal information, or super admins to update other admins.
- **Delete Admin**: Allows super admins to delete other admin accounts from the system.

#### 1. **Get All Admins**

```bash
GET /api/admin
```
Response

```bash
{
  "success": true,
  "data": [
    {
      "_id": "605c72df0e3a2c10f8052d19",
      "firstName": "Abdessamad",
      "lastName": "Haddouche",
      "email": "abdessamad.hadd@gmail.com"
    },
    {
      "_id": "605c72df0e3a2c10f8052d20",
      "firstName": "Imrane",
      "lastName": "Ali Lafkih",
      "email": "imranelaf@gmail.com"
    }
  ]
}
```

#### 2. **Get Admin by ID**

```bash
GET /api/admins/605c72df0e3a2c10f8052d19
```
Response

```bash
{
  "success": true,
  "data": [
    {
      "_id": "605c72df0e3a2c10f8052d19",
      "firstName": "Abdessamad",
      "lastName": "Haddouche",
      "email": "abdessamad.hadd@gmail.com"
    },
    {
      "_id": "605c72df0e3a2c10f8052d20",
      "firstName": "Imrane",
      "lastName": "Ali Lafkih",
      "email": "imranelaf@gmail.com"
    }
  ]
}
```

#### 3. **Update Admin Information**

```bash
PUT /api/admin/605c72df0e3a2c10f8052d19

{
  "email": "abdessamadroot@gmail.com",
  "firstName": "abdes"
}
```

Response

```bash
{
  "success": true,
  "message": "Admin information updated successfully",
  "data": {
    "_id": "605c72df0e3a2c10f8052d19",
    "email": "abdessamadroot@gmail.com",
    "firstName": "abdes"
  }
}
```

#### 4. **Delete Admin**

```bash
DELETE /api/admin/605c72df0e3a2c10f8052d19
```

Response

```bash
{
  "success": true,
  "message": "Admin deleted successfully"
}
```

---

## 🗂️ Database Schema

This section provides a brief overview of the main MongoDB schema models used in **Property Hub**.

### 🏘️ Property Model

The **Property** model represents real estate properties on the platform. It includes details such as:

- `title`, `description`, and `propertyType` – basic information about the property.
- `price`, `size`, `bedrooms`, `bathrooms`, `rooms` – essential property details.
- `address` – nested object containing street, city, state, and country.
- `offerType` – indicates if the property is for sale or rent.
- `amenities` and `images` – optional features and media associated with the property.
- `coordinates` – latitude and longitude for geolocation.

This model ensures that each property has the necessary attributes for filtering and viewing.

---

### 👤 User Model

The **User** model manages platform users' information. It includes:

- `firstName`, `lastName`, and `username` – personal details for identification.
- `email` and `password` – used for authentication and login.
- `avatar` – profile picture, with a default placeholder image.
- `properties` – references properties owned or managed by the user.
- `role` – defines user permissions, defaulting to a regular user role.

Users can register, log in, and manage their real estate listings.

---

### 👨‍💼 Agent Model

The **Agent** model extends from the user model and represents real estate agents. It includes:

- `agency`, `licenseNumber` – unique to agents, identifying the agency they work for and their legal license.
- `bio` – a short description about the agent.
- `properties` – a reference to properties managed by the agent.
- `rating` and `reviewsCount` – used to track agent ratings based on customer reviews.
- `agentStatus` – tracks if an agent is active, pending, or rejected by the platform admins.

Agents have additional permissions and responsibilities compared to regular users.

---

### 👨‍💼 Admin Model

The **Admin** model manages platform administrators, who have control over users, agents, and platform settings. It includes:

- `role` – distinguishes between regular `admin` and `super-admin` with higher permissions.
- `permissions` – defines actions each admin can perform, such as managing users, agents, and admins.
- `joinedAt` – the date the admin was added to the system.

Admins oversee platform operations and can assign roles to other users or agents.

---

### ❓ FAQ Model

The **FAQ** model stores frequently asked questions related to platform usage and general inquiries. It includes:

- `question` – the text of the question.
- `answer` – the corresponding response.
- `category` – to group similar FAQs under a specific topic.
  
This model helps users find answers quickly without needing additional support.

---

## 🧪 Testing

---

## 👥 Contributors

We are grateful for the dedication and hard work of everyone who contributed to the development of **Property Hub**.

- **Abdessamad Haddouche** - *Full Stack Developer* - [GitHub](https://github.com/yourgithubusername)
- **Imrane Ali Lafkih** - *Backend Developer* - [GitHub](https://github.com/yourgithubusername)

If you'd like to contribute, please check the [contribution guidelines](CONTRIBUTING.md) and feel free to submit a pull request!

---

## 🤝 Contributing

We welcome contributions to make Property Hub even better! If you have suggestions or improvements, please create a pull request or open an issue.

### Steps to Contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature-name`).
5. Open a Pull Request.

---

## 🙏 Acknowledgements

All work contained in this project was completed as part of the curriculum for **ALX Africa**. ALX Africa is an innovative education platform that offers intensive training programs in software engineering and other technology-related fields. Through a project-based and peer learning approach, ALX Africa prepares students for careers in the tech industry by providing them with practical skills and industry-relevant knowledge.

For more information about ALX Africa, please visit this [link](https://www.alxafrica.com/).


## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---