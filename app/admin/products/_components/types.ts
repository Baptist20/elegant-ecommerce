export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  price: number;
  stock: number;
  colors: string[];
  images: string[];
}

export interface ProductDraft {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  price: string;
  stock: string;
  colors: string;
}

export interface CategoryOption {
  id: string;
  name: string;
}
