export interface Product {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  full_description: string;
  price: number;
  features: string[];
  cta_text: string;
  is_free: boolean;
  image_url: string;
  gallery_images: string[];
  badge: string;
  original_price_label: string;
  original_price_display: string;
  price_display: string;
  price_microcopy: string;
  is_featured: boolean;
  image_type: string;
  sort_order: number;
  is_out_of_stock: boolean; // Nuevo campo
}

export interface AdminOrder {
  id: string;
  created_at: string;
  status: string;
  amount: number;
  product_id: string;
  mp_preference_id?: string;
  user_email?: string;
  first_name?: string;
  last_name?: string;
}

export interface PromptItem {
    id: string;
    image_url: string;
    prompt: string;
    model_info: string;
    created_at: string;
}