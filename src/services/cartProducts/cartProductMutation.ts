import { axiosInstance, ENDPOINTS } from "@/config/api-config";
import { Response, TPurchasedProduct } from "@/types/common";
import { loadStripe } from "@stripe/stripe-js";
import { useMutation } from "@tanstack/react-query";
import Stripe from "stripe";

export const useEditCartProduct = () => {
  return useMutation({
    mutationFn: async ({
      productId,
      quantity,
      patientId,
    }: {
      productId: string;
      quantity: number;
      patientId: string;
    }) => {
      const response = await axiosInstance.post(
        ENDPOINTS.cartProduct.addToCart,
        { productId, quantity, patientId }
      );
      return response.data;
    },
  });
};

export const useDeleteCartProduct = () => {
  return useMutation({
    mutationFn: async ({
      patientId,
      productId,
    }: {
      patientId: string;
      productId: string;
    }) => {
      const response = await axiosInstance.delete(
        ENDPOINTS.cartProduct.deletecartProduct(patientId, productId)
      );

      return response.data;
    },
  });
};

export const useBuyProducts = () => {
  return useMutation({
    mutationFn: async ({ products }: { products: TPurchasedProduct }) => {
      const response = await axiosInstance.post(ENDPOINTS.stripe.buyProducts, {
        products,
      });

      const responseData: Response<Stripe.Response<Stripe.Checkout.Session>> =
        response.data;

      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
      );

      // console.log("Stripe is ", stripe);
      if (!stripe) {
        throw new Error("Stripe failed to initialize.");
      }
      // console.log(response);
      // console.log(responseData.data);
      await stripe.redirectToCheckout({
        sessionId: responseData.data.id,
      });
    },
  });
};
