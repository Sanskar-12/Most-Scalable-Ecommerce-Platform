import { FaPlus } from "react-icons/fa";
import { CartItemsType } from "../types/types";

interface ProductCardProps {
  productId: string;
  photos: {
    public_id: string;
    url: string;
  }[];
  name: string;
  price: number;
  stock: number;
  addToCartHandler: (cartItem: CartItemsType) => void;
}

const ProductCard = ({
  productId,
  photos,
  name,
  price,
  stock,
  addToCartHandler,
}: ProductCardProps) => {
  console.log(photos);

  return (
    <div className="product-card">
      <img src={photos[0]?.url} alt={name} />
      <p>{name}</p>
      <span>₹{price}</span>
      <div>
        <button
          onClick={() =>
            addToCartHandler({
              name,
              photos: photos,
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
