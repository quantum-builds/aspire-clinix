export type TProduct = {
  id: string;
  name: string;
  productId: string;
  price: number;
  stock: number;
  ratings: number;
  imageUrl: string;
  file?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TCartProduct = {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;

  product: TProduct;
};

export type TProductResponse = {
  products: TProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
