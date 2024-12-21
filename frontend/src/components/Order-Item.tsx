import { Link } from "react-router-dom";
import { OrderItemType } from "../types/types";

interface OrderItemProps {
  orderItem: OrderItemType;
}

const OrderItem = ({ orderItem }: OrderItemProps) => {
  const { photo, productId, name, price, quantity } = orderItem;

  return (
    <div className="cart-item">
      <img src={photo} alt={name} />
      <article>
        <Link to={`/product/${productId}`}>{name}</Link>
        <span>₹{price}</span>
      </article>

      <div>
        <p>
          ₹{price} X {quantity} = ₹{price * quantity}
        </p>
      </div>
    </div>
  );
};

export default OrderItem;
