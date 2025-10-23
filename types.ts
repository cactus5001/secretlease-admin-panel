export type ViewState = 'landing' | 'searching' | 'results' | 'auth' | 'payment' | 'success' | 'pendingApproval' | 'admin';
export type City = 'NY' | 'LA' | '';
export type UserRole = 'user' | 'admin';

export interface RentalListing {
  id: string;
  city: 'NY' | 'LA';
  title: string;
  area: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  type: string;
  postedAgo: string;
  address: string;
  imageUrl?: string;
  description?: string;
  amenities?: string[];
  contact?: string;
}

export interface UserAccount {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  isApproved?: boolean;  // Admin approval status
  hasPaid: boolean;
  paymentMethod?: 'paypal' | 'btc' | 'usdt';
  paymentEmail?: string;  // PayPal email/username
  walletAddress?: string;  // BTC/USDT wallet address
  transactionHash?: string;  // Transaction hash for verification
  joinedDate: string;
}

export interface Transaction {
  id: string;
  userId: string;
  userEmail: string;
  amount: number;
  method: 'paypal' | 'btc' | 'usdt';
  date: string;
  status: 'completed' | 'pending';
}

export interface AdminConfig {
  paypalEmail: string;
  btcAddress: string;
  usdtAddress: string;
  priceUsd: number;
}