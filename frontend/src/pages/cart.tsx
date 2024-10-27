import { useState, useEffect } from "react";
import { VscError } from "react-icons/vsc";
import CartItem from "../components/Cart-Item";
import { Link } from "react-router-dom";

const cartItems = [
  {
    productId: "asdfsdf",
    name: "Macbook Pro",
    price: 100000,
    quantity: 3,
    stock: 232,
    photo: "https://m.media-amazon.com/images/I/71ItMeqpN3L._AC_UY218_.jpg",
  },
];
const subTotal = 4000;
const tax = Math.round(subTotal * 0.18);
const shippingCharges = 200;
const discount = 200;
const total = subTotal + tax + shippingCharges;

const Cart = () => {
  const [coupon, setCoupon] = useState<string>("");
  const [isValidCoupon, setIsValidCoupon] = useState<boolean>(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (Math.random() > 0.5) setIsValidCoupon(true);
      else setIsValidCoupon(false);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
      setIsValidCoupon(false);
    };
  }, [coupon]);

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((cartitem, index) => (
            <CartItem key={index} cartItem={cartitem} />
          ))
        ) : (
          <h1>No Items Added</h1>
        )}
      </main>
      <aside>
        <p>Subtotal: ₹{subTotal}</p>
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
