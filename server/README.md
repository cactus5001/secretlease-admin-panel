# 🏗️ SecretLease Backend Setup Guide

Complete guide to setting up the backend API server with MongoDB.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v5.0 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment

Create a `.env` file in the `server` directory:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/secretlease
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
# MongoDB should be running as a service
# Or start manually:
mongod
```

**macOS (via Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### 4. Seed the Database

Populate the database with sample data:

```bash
npm run seed
```

This will create:
- 800 property listings
- 4 user accounts (including admin)
- Sample transactions
- Admin configuration

### 5. Start the Server

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

The server will run on `http://localhost:5000`

## 📁 Project Structure

```
server/
├── src/
│   ├── models/           # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Listing.ts
│   │   ├── Transaction.ts
│   │   └── AdminConfig.ts
│   ├── routes/           # API endpoints
│   │   ├── auth.ts       # Authentication
│   │   ├── listings.ts   # Property listings
│   │   ├── transactions.ts
│   │   ├── admin.ts      # Admin operations
│   │   └── users.ts      # User profile & favorites
│   ├── middleware/       # Express middleware
│   │   └── auth.ts       # JWT authentication
│   ├── utils/            # Utilities
│   │   └── seed.ts       # Database seeder
│   └── index.ts          # Server entry point
├── .env                  # Environment variables
├── package.json
└── tsconfig.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Listings
- `GET /api/listings/search?city=NY&maxBudget=2000&sortBy=price-low`
- `GET /api/listings/:id`
- `POST /api/listings` (Admin only)
- `PUT /api/listings/:id` (Admin only)
- `DELETE /api/listings/:id` (Admin only)

### Transactions
- `POST /api/transactions` (Authenticated)
- `GET /api/transactions` (Authenticated)
- `GET /api/transactions/:id` (Authenticated)
- `PUT /api/transactions/:id/approve` (Admin only)
- `PUT /api/transactions/:id/reject` (Admin only)

### Admin
- `GET /api/admin/stats` (Admin only)
- `GET /api/admin/config` (Admin only)
- `PUT /api/admin/config` (Admin only)
- `GET /api/admin/users` (Admin only)

### Users
- `GET /api/users/me` (Authenticated)
- `GET /api/users/favorites` (Authenticated)
- `POST /api/users/favorites/:listingId` (Authenticated)
- `DELETE /api/users/favorites/:listingId` (Authenticated)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Request Headers
```
Authorization: Bearer <your-jwt-token>
```

### Getting a Token
1. Register: `POST /api/auth/register`
2. Login: `POST /api/auth/login`
3. Token is returned in the response

## 📊 Test Accounts

After seeding, you can use these accounts:

| Email | Password | Role | Status |
|-------|----------|------|--------|
| admin@secretlease.com | admin123 | Admin | Paid |
| john@example.com | password | User | Paid |
| sarah@example.com | password | User | Free |
| peter@example.com | password | User | Pending |

## 🛠️ Development

### Run Tests
```bash
npm test
```

### Type Checking
```bash
npx tsc --noEmit
```

### Database Management

**View database:**
```bash
mongosh secretlease
```

**Reset database:**
```bash
npm run seed
```

**Backup database:**
```bash
mongodump --db secretlease --out ./backup
```

**Restore database:**
```bash
mongorestore --db secretlease ./backup/secretlease
```

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Error: "MongoServerError: Authentication failed"**
- Ensure MongoDB is running without authentication or configure credentials

**Error: "connect ECONNREFUSED"**
- Check if MongoDB is running: `mongosh`
- Verify connection string in `.env`

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <process-id> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### TypeScript Errors

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Deployment

### Environment Variables

Update these for production:
- Change `JWT_SECRET` to a strong random string
- Set `NODE_ENV=production`
- Use a hosted MongoDB (e.g., MongoDB Atlas)
- Update `CLIENT_URL` to your frontend URL

### MongoDB Atlas (Cloud Database)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### Deploy to Heroku

```bash
heroku create secretlease-api
heroku config:set MONGODB_URI=<your-mongodb-uri>
heroku config:set JWT_SECRET=<your-secret>
git push heroku main
```

## 📝 Notes

- The server supports CORS for frontend integration
- All timestamps are in ISO format
- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Verify all dependencies are installed
3. Ensure MongoDB is running
4. Check server logs for errors

---

**Happy Coding! 🎉**
