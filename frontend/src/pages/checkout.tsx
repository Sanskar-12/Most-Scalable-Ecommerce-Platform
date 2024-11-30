import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FormEvent, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { CartState, RootState } from "../types/reducer-types";
import { MessageResponseType, NewOrderRequestType } from "../types/api-types";
import { useNewOrderMutation } from "../redux/api/orderAPI";
import { resetCart } from "../redux/reducer/cartSlice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const {
    cartItems,
    total,
    discount,
    shippingCharges,
    shippingInfo,
    subtotal,
    tax,
  } = useSelector((state: CartState) => state.cartSlice);
  const { user } = useSelector((state: RootState) => state.userSlice);

  const [newOrder] = useNewOrderMutation();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    setIsProcessing(true);

    const order: NewOrderRequestType = {
      shippingInfo,
      orderItems: cartItems,
      shippingCharges,
      discount,
      subtotal,
      tax,
      total,
      user: user?._id as string,
    };

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin },
      redirect: "if_required",
    });

    if (error) {
      setIsProcessing(false);
      return toast.error(error.message || "Something Went Wrong");
    }

    if (paymentIntent.status === "succeeded") {
      console.log("Placed Order");
      const res = await newOrder(order);
      dispatch(resetCart());
      if ("data" in res) {
        toast.success(res.data?.message as string);
        console.log(res.data);
        navigate("/orders");
      } else {
        const error = res.error as FetchBaseQueryError;
        const message = (error.data as MessageResponseType).message;
        toast.error(message);
      }
    }
    setIsProcessing(false);
  };

  return (
    <div className="checkout-container">
      <form onSubmit={submitHandler}>
        <PaymentElement />
        <button type="submit" disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Pay"}
        </button>
      </form>
    </div>
  );
};

const Checkout = () => {
  const location = useLocation();

  console.log(location);

  const clientSecret: string | undefined = location.state;

  if (!clientSecret) return <Navigate to={"/shipping"} />;

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
      }}
    >
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;
