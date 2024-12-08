import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CartItemsType } from "../types/types";

interface CartItemProps {
  cartItem: CartItemsType;
  incrementHandler: (cartItem: CartItemsType) => void;
  decrementHandler: (cartItem: CartItemsType) => void;
  removeHandler: (productId: string) => void;
}

const CartItem = ({
  cartItem,
  incrementHandler,
  decrementHandler,
  removeHandler,
}: CartItemProps) => {
  const { photo, productId, name, price, quantity } = cartItem;

  return (
    <div className="cart-item">
      <img src={photo} alt={name} />
      <article>
        <Link to={`/product/${productId}`}>{name}</Link>
        <span>₹{price}</span>
      </article>

      <div>
        <button onClick={() => decrementHandler(cartItem)}>-</button>
        <p>{quantity}</p>
        <button onClick={() => incrementHandler(cartItem)}>+</button>
      </div>

      <button onClick={() => removeHandler(productId)}>
        <FaTrash />
      </button>
    </div>
  );
};

export default CartItem;
