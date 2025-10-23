<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🏠 SecretLease - Premium Off-Market Rental Platform

> **Full-stack application** for accessing exclusive off-market rental listings in New York and Los Angeles with up to 40% savings below market rates.

**🔥 NOW WITH COMPLETE BACKEND & DATABASE INTEGRATION! 🔥**

## ✨ Features

### User Features
- **🔍 Advanced Search** - Filter properties by city, budget, and preferences
- **🏞️ Property Listings** - Browse 800+ exclusive off-market rentals
- **🔒 Secure Authentication** - User accounts with role-based access
- **💳 Multiple Payment Methods** - PayPal, Bitcoin, and USDT support
- **❤️ Favorites System** - Bookmark your favorite properties
- **📱 Responsive Design** - Works perfectly on all devices
- **🔔 Toast Notifications** - Real-time feedback for user actions
- **🖼️ Property Details** - Full property modals with images, amenities, and contact info

### Admin Features
- **📊 Analytics Dashboard** - Revenue, users, and conversion metrics
- **👥 User Management** - View and manage all registered users
- **💰 Transaction Control** - Approve/reject payments manually
- **⚙️ Settings Panel** - Configure pricing and payment addresses
- **📈 Real-time Stats** - Live updates on platform performance

### Enhanced UI/UX
- **🎨 Beautiful Animations** - Smooth transitions using Framer Motion
- **🌈 Gradient Effects** - Modern gradient backgrounds and text
- **📸 Property Images** - Real photos from Unsplash
- **💠 Loading States** - Engaging loading animations with floating icons
- **🎯 Interactive Cards** - Hover effects and smooth interactions
- **🔄 Sorting & Filtering** - Price and date sorting options
- **⭐ Testimonials** - Auto-rotating user reviews
- **📊 Statistics Counter** - Animated stats on landing page

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (v5.0 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn**

### Full-Stack Installation

#### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start MongoDB (if not running)
# Windows: mongod service should be running
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Seed database with sample data
npm run seed

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

#### 2. Frontend Setup

```bash
# In the root directory
npm install

# Create environment file
cp .env.example .env

# Start frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

### Quick Start (Frontend Only - Mock Data)

If you want to run without backend:

```bash
npm install
npm run dev
```

The app will use mock data instead of the API.

## 👤 Default Accounts

### Admin Account
- **Email:** admin@secretlease.com
- **Password:** admin123
- Access to admin panel, user management, and transaction approvals

### Test User Accounts
- **Email:** john@example.com / **Password:** password (Paid user)
- **Email:** sarah@example.com / **Password:** password (Free user)
- **Email:** peter@example.com / **Password:** password (Pending approval)

## 📦 Project Structure

```
secretlease-admin-panel/
├── server/              # Backend API
│   ├── src/
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API endpoints
│   │   ├── middleware/   # Auth middleware
│   │   ├── utils/        # Database seeder
│   │   └── index.ts      # Server entry
│   ├── .env             # Environment config
│   └── package.json
├── components/         # React components
│   ├── AdminPanel.tsx
│   ├── ResultsView.tsx
│   ├── PropertyModal.tsx
│   └── ...
├── services/           # API integration
│   └── api.ts
├── data/               # Mock data (fallback)
├── App.tsx
├── types.ts
└── index.css
```

## 🎨 Technologies Used

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js & Express** - RESTful API server
- **MongoDB & Mongoose** - NoSQL database
- **JWT** - Secure authentication
- **bcryptjs** - Password encryption
- **TypeScript** - Type-safe backend
- **cors** - Cross-origin resource sharing

## 🌐 Features Breakdown

### Landing Page
- Hero section with gradient text
- Animated statistics grid (800+ listings, 35% savings, etc.)
- City selection (NY/LA) with emoji icons
- Budget slider with real-time price display
- Auto-rotating testimonials with 5-star ratings
- Smooth entry animations

### Search & Results
- Animated loading screen with floating icons
- Property cards with real images from Unsplash
- Sorting options (newest, price low-to-high, high-to-low)
- Favorite/bookmark functionality with heart icon
- Hover effects with image zoom
- Blur effect for locked content
- Staggered card animations on load

### Property Details Modal
- Full-screen modal with backdrop blur
- Image gallery (expandable)
- Property stats (beds, baths, square feet)
- Amenities list with icons
- Contact information (email, phone)
- Schedule viewing button
- Share and favorite buttons

### Admin Dashboard
- Revenue and user statistics
- Pending approval notifications
- User table with role badges
- Transaction management with approve button
- Settings panel for pricing and payment addresses
- Real-time conversion rate calculation

### Notifications
- Toast notifications for all user actions
- Success, error, warning, and info types
- Auto-dismiss after 5 seconds
- Smooth slide-in animation
- Manual dismiss option

## 🛠️ Customization

### Update Payment Addresses
Login as admin and navigate to Settings tab to update:
- PayPal email
- Bitcoin address
- USDT (TRC20) address
- Membership price (USD)

### Add More Listings
Edit `data/mockData.ts` to add more properties or modify existing ones.

### Customize Styling
Edit `index.css` for custom animations and `tailwind.config.js` for theme changes.

## 💾 API Documentation

Full API documentation is available in [`server/README.md`](server/README.md)

### Quick API Reference

**Base URL:** `http://localhost:5000/api`

**Authentication:**
```
Authorization: Bearer <your-jwt-token>
```

**Key Endpoints:**
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /listings/search?city=NY&maxBudget=2000` - Search listings
- `POST /transactions` - Create transaction
- `PUT /transactions/:id/approve` - Approve payment (Admin)
- `GET /admin/stats` - Get dashboard stats (Admin)
- `GET /users/favorites` - Get user favorites

## 🐛 Known Issues

None at the moment! All features are working as expected.

## 📦 Future Enhancements

- ~~Real backend integration~~ ✅ **DONE!**
- ~~MongoDB database~~ ✅ **DONE!**
- ~~JWT Authentication~~ ✅ **DONE!**
- ~~RESTful API~~ ✅ **DONE!**
- Stripe payment integration
- Email verification
- Property comparison feature
- Advanced filters (amenities, property type)
- Map view with property locations
- Saved searches
- Email notifications
- Real-time chat with landlords

## 📝 License

This project is for demonstration purposes.

## 👏 Credits

- Property images from [Unsplash](https://unsplash.com)
- Icons from [Lucide](https://lucide.dev)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)

---

**Made with ❤️ by AI Studio**

View this app in AI Studio: https://ai.studio/apps/temp/2
