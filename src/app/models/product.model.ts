export interface ProductsResponse {
  totalProducts: number;
  products: Product[];
}

export interface Product {
  "product-id": string;
  "product-code": string;
  alt: string;
  category: string;
  price: string;
  image: string;

  images?: ProductImages;

  offer?: string;
  "is-out-of-stock"?: boolean;

  "seo-information": ProductSeoInformation;
}

export interface ProductImages {
  hover?: string;
}

export interface ProductSeoInformation {
  "seo-information": SeoInformation;
}

export interface SeoInformation {
  "meta-title": string;
  "meta-description": string;
  keywords: string;
}