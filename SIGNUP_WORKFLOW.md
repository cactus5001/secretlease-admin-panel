# Enhanced Signup and Approval Workflow

## Overview
The signup process has been completely redesigned to require payment verification before users can access property listings. Users must submit payment details during signup, and admin approval is required before they can view unblurred content.

## User Signup Flow

### 1. Registration Form
When signing up, users must provide:
- **Email & Password** - Standard authentication credentials
- **Payment Method** - Choose from:
  - PayPal
  - Bitcoin (BTC)
  - USDT (TRC20)
- **Payment Details** - Based on selected method:
  - **PayPal**: Email/username used to send payment
  - **BTC/USDT**: Wallet address payment was sent from
  - **Transaction Hash**: Required for all methods to verify payment

### 2. Payment Instructions
The signup form displays payment addresses dynamically:
- **PayPal**: Admin's PayPal email
- **BTC**: Bitcoin wallet address
- **USDT**: TRC20 wallet address

Users should send payment BEFORE completing signup, then enter the transaction details.

### 3. Pending Approval Status
After signup submission:
- User account is created with `isApproved: false`
- User can login but sees "Pending Approval" screen
- Content remains blurred until admin approves
- User receives message: "Registration submitted successfully. Please wait for admin approval."

## Admin Approval Process

### 1. Access Pending Signups
Navigate to **Admin Panel → Pending Signups** tab
- Shows badge with count of pending users
- Dashboard displays "Pending Signups" stat card

### 2. Review Payment Details
For each pending signup, admin can see:
- User email
- Signup date/time
- Payment method used
- Payment email (PayPal) or Wallet address (BTC/USDT)
- Transaction hash for verification

### 3. Approve or Reject

**Approve & Activate:**
- Marks user as approved (`isApproved: true`)
- Sets payment status (`hasPaid: true`)
- User can now login and access all content
- Content is no longer blurred

**Reject:**
- Permanently deletes the user account
- User cannot login anymore
- Use this for fake payments or suspicious accounts

## Technical Implementation

### Database Schema (Prisma)
```prisma
model User {
  id               String   @id @default(uuid())
  email            String   @unique
  password         String
  role             String   @default("user")
  isApproved       Boolean  @default(false)
  hasPaid          Boolean  @default(false)
  paymentMethod    String?
  paymentEmail     String?
  walletAddress    String?
  transactionHash  String?
  favorites        String[]
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}
```

### API Endpoints

**User Registration:**
```
POST /api/auth/register
Body: {
  email: string
  password: string
  paymentMethod: "paypal" | "btc" | "usdt"
  paymentEmail?: string       // Required for PayPal
  walletAddress?: string      // Required for BTC/USDT
  transactionHash: string     // Always required
}
```

**Get Pending Signups (Admin only):**
```
GET /api/admin/pending-signups
Headers: { Authorization: "Bearer <admin_token>" }
```

**Approve User (Admin only):**
```
POST /api/admin/approve-user/:userId
Headers: { Authorization: "Bearer <admin_token>" }
```

**Reject User (Admin only):**
```
POST /api/admin/reject-user/:userId
Headers: { Authorization: "Bearer <admin_token>" }
```

### Frontend Logic

**Content Blur Check:**
```typescript
const isBlurred = currentUser?.role !== 'admin' && 
                  (!currentUser?.hasPaid || currentUser?.isApproved === false);
```

**Login Flow:**
```typescript
if (user.role === 'admin') {
  // Admin → Full access to admin panel
  setView('admin');
} else if (user.isApproved !== false && user.hasPaid) {
  // Approved paid user → Can view listings
  setView('results');
} else {
  // Pending approval → Show pending screen
  setView('pendingApproval');
}
```

## Testing the Workflow

### Test Signup
```powershell
# Create test user
$body = @{
  email='testuser@example.com'
  password='test123'
  paymentMethod='btc'
  walletAddress='bc1qtest1234567890'
  transactionHash='abc123def456'
} | ConvertTo-Json

Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/register' `
  -Method Post -Body $body -ContentType 'application/json'
```

### Test Admin Approval
```powershell
# Login as admin
$loginBody = @{email='admin@secretlease.com';password='admin123'} | ConvertTo-Json
$loginResponse = Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/login' `
  -Method Post -Body $loginBody -ContentType 'application/json'
$token = $loginResponse.data.token

# Get pending signups
Invoke-RestMethod -Uri 'http://localhost:5000/api/admin/pending-signups' `
  -Headers @{Authorization="Bearer $token"}

# Approve user
Invoke-RestMethod -Uri "http://localhost:5000/api/admin/approve-user/<userId>" `
  -Method Post -Headers @{Authorization="Bearer $token"}
```

## Benefits

1. **Payment Verification**: Ensures all users have paid before accessing content
2. **Fraud Prevention**: Admin can verify transaction hashes before approval
3. **Manual Control**: Admin has full control over who gets access
4. **Clear User Experience**: Users know their status (pending vs approved)
5. **Audit Trail**: All payment details stored for verification
6. **Flexible Payment Options**: Supports PayPal and crypto payments

## Admin Panel Features

**Dashboard Stats:**
- Total Users
- Paid Users
- Pending Signups (highlighted when > 0)
- Conversion Rate

**Pending Signups Tab:**
- Visual indicator with badge count
- Detailed payment information
- One-click approve/reject buttons
- Chronological sorting (newest first)

## Security Considerations

1. **Password Hashing**: All passwords hashed with bcrypt
2. **JWT Authentication**: Secure token-based auth
3. **Role-Based Access**: Admin-only endpoints protected
4. **Payment Verification**: Transaction hashes required
5. **Data Validation**: Express-validator ensures data integrity
