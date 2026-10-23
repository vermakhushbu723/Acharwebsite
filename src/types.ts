export type Variant = {
  _id: string;
  label: string;
  netQuantity: string;
  price: number;
  mrp: number | null;
  inStock: boolean;
  lowStock: boolean;
  maxQty: number;
};

export type Product = {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: { name: string; slug: string } | null;
  spiceLevel: '' | 'mild' | 'medium' | 'hot';
  tasteNotes: string[];
  ingredients: string;
  allergens: string;
  dietaryNotes: string;
  storageInstructions: string;
  shelfLife: string;
  servingIdeas: string;
  images: { url: string; alt: string }[];
  accentColor: string;
  isBestseller: boolean;
  seo: { title: string; description: string };
  variants: Variant[];
  fromPrice: number | null;
  inStock: boolean;
};

export type Category = { _id: string; name: string; slug: string; description: string; productCount: number };

export type PublicSettings = {
  announcement: string;
  business: {
    name: string;
    tagline: string;
    supportPhone: string;
    whatsapp: string;
    supportEmail: string;
    supportHours: string;
    address: string;
    fssaiNumber: string;
    instagram: string;
    facebook: string;
  };
  shipping: { flatRate: number; freeShippingThreshold: number; processingTime: string; deliveryEstimate: string };
  cod: { enabled: boolean; fee: number; maxOrderValue: number };
  onlinePayment: boolean;
};

export type CartLine = {
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  variantLabel: string;
  price: number; // display only; server recalculates
  accentColor: string;
  image?: string;
  quantity: number;
  maxQty: number;
};

export type QuoteIssue = { productId: string; variantId: string; type: 'unavailable' | 'stock'; available?: number; message: string };

export type Quote = {
  lines: {
    product: string;
    variantId: string;
    name: string;
    slug: string;
    variantLabel: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }[];
  issues: QuoteIssue[];
  pricing: { subtotal: number; shipping: number; codFee: number; discount: number; total: number };
  serviceable: boolean | null;
  codAvailable: boolean;
  freeShippingThreshold: number;
};

export type OrderStatus =
  | 'pending_payment'
  | 'placed'
  | 'confirmed'
  | 'packing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PublicOrder = {
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  statusHistory: { status: OrderStatus; at: string; note: string }[];
  items: { name: string; slug: string; variantLabel: string; unitPrice: number; quantity: number; lineTotal: number }[];
  customer: { name: string; phone: string };
  address: { line1: string; line2: string; landmark: string; city: string; state: string; pincode: string };
  pricing: { subtotal: number; shipping: number; codFee: number; discount: number; total: number };
  payment: { method: 'cod' | 'razorpay'; status: 'pending' | 'paid' | 'failed' | 'refunded' };
  tracking: { courier?: string; awb?: string; url?: string } | null;
};

export type RazorpayPayload = {
  keyId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  name: string;
  prefill: { name: string; contact: string; email?: string };
};
