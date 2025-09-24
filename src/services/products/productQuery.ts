import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { TProduct, TProductResponse } from "@/types/products";
import { Response } from "@/types/common";
import { getAMedia } from "../s3/s3Query";
import axios from "axios";

export async function getProducts(
  page?: number,
  search?: string,
  limit?: number
) {
  try {
    const response = await axiosInstance.get(
      ENDPOINTS.products.getAll(search, page, limit)
    );
    const responseData: Response<TProductResponse> = response.data;
    console.log("repponse data is ", responseData);
    const products: TProduct[] = responseData.data.products;

    const uploads = await Promise.all(
      products.map(async (product) => {
        if (product.imageUrl) {
          const imageResponse = await getAMedia(product.imageUrl);
          return imageResponse;
        }
      })
    );

    products.forEach((product, index) => {
      product.file = uploads[index];
    });

    responseData.data.products = products;
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching resources: ", errorMessage);

      return { errorMessage };
    }
  }
}
