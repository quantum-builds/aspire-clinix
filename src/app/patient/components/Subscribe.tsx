"use client";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PaymentStatus } from "@/constants/PaymentStatus";

type Props = {
  priceId: string;
  price: string;
  description: string;
};

const SubscribeComponent = ({ priceId, price, description }: Props) => {
  const searchParams = useSearchParams();

  // Check for session_id in the URL and verify payment status
  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      checkPaymentStatus(sessionId);
    }
  }, [searchParams]);

  const checkPaymentStatus = useCallback(async (sessionId: string) => {
    try {
      const response = await axios.get("/api/stripe/status", {
        params: { session_id: sessionId },
      });
      const { action } = response.data;

      if (action === PaymentStatus.PAID) {
        toast.success("Payment successful!");
      } else {
        toast.error("Payment unsuccessful. Please try again.");
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      toast.error("An error occurred while checking payment status.");
    }
  }, []);

  const handleSubmit = async () => {
    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
    );
    if (!stripe) {
      toast.error("Stripe failed to initialize.");
      return;
    }
    try {
      const response = await axios.post("/api/stripe/checkout", {
        priceId: priceId,
        price: price,
        description: description,
      });
      const data = response.data;
      await stripe.redirectToCheckout({
        sessionId: data.result.id,
      });
    } catch (error) {
      toast.error("Checkout failed. Please try again.");
    }
  };

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      Click the button below to get {description}
      <button className="bg-black cursor-pointer" onClick={handleSubmit}>
        Upgrade for {price}
      </button>
    </div>
  );
};

export default SubscribeComponent;
