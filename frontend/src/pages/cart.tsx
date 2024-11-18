import { useState, useEffect } from "react";
import { VscError } from "react-icons/vsc";
import CartItem from "../components/Cart-Item";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartState } from "../types/reducer-types";
import { CartItemsType } from "../types/types";
import toast from "react-hot-toast";
import {
  addToCart,
  calculatePrice,
  discountApplied,
  removeFromCart,
} from "../redux/reducer/cartSlice";
import axios from "axios";

const Cart = () => {
  const dispatch = useDispatch();
  const {
    cartItems,
    discount,
    shippingCharges,
    shippingInfo,
    subtotal,
    tax,
    total,
  } = useSelector((state: CartState) => state.cartSlice);

  const [coupon, setCoupon] = useState<string>("");
  const [isValidCoupon, setIsValidCoupon] = useState<boolean>(false);

  const incrementHandler = (cartItem: CartItemsType) => {
    if (cartItem.quantity >= cartItem.stock) {
      return toast.error("Max Stock reached");
    }
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  };
  const decrementHandler = (cartItem: CartItemsType) => {
    if (cartItem.quantity <= 1) {
      return toast.error("Min Stock reached");
    }
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
  };
  const removeHandler = (produtId: string) => {
    dispatch(removeFromCart(produtId));
    toast.success("Removed from cart");
  };

  useEffect(() => {
    const { token: cancelToken, cancel } = axios.CancelToken.source();
    const timeoutId = setTimeout(() => {
      axios
        .get(
          `${
            import.meta.env.VITE_SERVER
          }/api/v1/payment/discount?coupon=${coupon}`,
          {
            cancelToken,
          }
        )
        .then((res) => {
          dispatch(discountApplied(res.data.discount));
          setIsValidCoupon(true);
          dispatch(calculatePrice());
        })
        .catch((err) => {
          console.log(err.response.data.error);
          dispatch(discountApplied(0));
          setIsValidCoupon(false);
          dispatch(calculatePrice());
        });
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      cancel();
      setIsValidCoupon(false);
    };
  }, [coupon, dispatch]);

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems, dispatch]);

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((cartitem, index) => (
            <CartItem
              key={index}
              cartItem={cartitem}
              incrementHandler={incrementHandler}
              decrementHandler={decrementHandler}
              removeHandler={removeHandler}
            />
          ))
        ) : (
          <h1>No Items Added</h1>
        )}
      </main>
      <aside>
        <p>Subtotal: ₹{subtotal}</p>
        <p>Shipping Charges: ₹{shippingCharges}</p>
        <p>Tax: ₹{tax}</p>
        <p>
          Discount: <em className="red"> - ₹{discount}</em>
        </p>
        <p>
          <b>Total: ₹{total}</b>
        </p>
        <input
          type="text"
          placeholder="Coupon Code"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
        />
        {coupon &&
          (isValidCoupon ? (
            <span className="green">
              ₹{discount} off using the <code>{coupon}</code>
            </span>
          ) : (
            <span className="red">
              Invlaid Coupon <VscError />
            </span>
          ))}

        {cartItems.length > 0 && <Link to={"/shipping"}>Checkout</Link>}
      </aside>
    </div>
  );
};

export default Cart;
