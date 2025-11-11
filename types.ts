export interface Photo {
  id: string;
  url: string; // Using object URL for local previews
  file: File;
  caption: string;
  date: string;
}

export type ProductType = 'album' | 'magnets' | 'frame' | 'ornaments' | 'giftcard';

export interface ProductOption {
  name: string;
  price: number;
}

export interface ProductOptions {
  sizes?: ProductOption[];
  covers?: ProductOption[];
  pages?: ProductOption[];
  frame?: {
    price: number;
  };
  tiers?: {
    qty: number;
    price: number;
  }[];
}


export interface Product {
  id: string;
  type: ProductType;
  name: string;
  tagline: string;
  details: { title: string; points: string[] }[];
  priceText: string;
  basePrice?: number;
  options?: ProductOptions;
}

export interface GiftCardDetails {
  amount: number;
  occasion: string;
  recipientName: string;
  recipientEmail: string;
  message: string;
}

export interface SelectedOptions {
    size?: string;
    cover?: string;
    pages?: number;
    hasFrame?: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  price: number; // Final calculated price for this item
  description?: string; // e.g., "21x21 cm, Pasta Dura, 80 Pags."
  photos?: Photo[];
  giftCardDetails?: GiftCardDetails;
  selectedOptions?: SelectedOptions;
}

export type AppView = 'STOREFRONT' | 'PRODUCT_CUSTOMIZER' | 'CART' | 'CHECKOUT';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}