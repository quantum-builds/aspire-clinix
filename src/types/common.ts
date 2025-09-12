export interface Response<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface PaginationNumbers {
  total: number;
  totalPages: number;
}

export interface PurchasedProduct {
  cartId: string;
  products: {
    productId: string;
    quantity: number;
  }[];
}
