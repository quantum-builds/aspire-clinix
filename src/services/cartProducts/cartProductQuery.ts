import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { Response } from "@/types/common";
import { TCartProduct } from "@/types/products";
import { getAMedia } from "../s3/s3Query";
import axios from "axios";

export async function getCartProducts(patientId?: string) {
  // noStore();

  try {
    const response = await axiosInstance.get(
      ENDPOINTS.cartProduct.getAll(patientId)
    );
    const responseData: Response<TCartProduct[]> = response.data;
    console.log("repponse data is ", responseData);
    const cartProdcuts: TCartProduct[] = responseData.data;

    const uploads = await Promise.all(
      cartProdcuts.map(async (cartProduct) => {
        if (cartProduct.product.imageUrl) {
          const imageResponse = await getAMedia(cartProduct.product.imageUrl);
          return imageResponse;
        }
      })
    );

    cartProdcuts.forEach((cartProduct, index) => {
      cartProduct.product.file = uploads[index];
    });

    responseData.data = cartProdcuts;
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    } else {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error in fetching cart products: ", errorMessage);

      return { errorMessage };
    }
  }
}
