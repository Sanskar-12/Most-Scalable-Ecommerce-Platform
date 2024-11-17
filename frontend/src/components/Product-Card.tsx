import { FaPlus } from "react-icons/fa";
import { server } from "../redux/store";
import { CartItemsType } from "../types/types";

interface ProductCardProps {
  productId: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  addToCartHandler: (cartItem: CartItemsType) => void;
}

const ProductCard = ({
  productId,
  photo,
  name,
  price,
  stock,
  addToCartHandler,
}: ProductCardProps) => {
  return (
    <div className="product-card">
      <img src={`${server}/${photo}`} alt={name} />
      <p>{name}</p>
      <span>₹{price}</span>
      <div>
        <button
          onClick={() =>
            addToCartHandler({
              name,
              photo,
              price,
              quantity: 1,
              productId,
              stock,
            })
          }
        >
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
