import { FaPlus } from "react-icons/fa";
import { server } from "../redux/store";

interface ProductCardProps {
  productId: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  addToCartHandler: (productId: string) => void;
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
        <button onClick={() => addToCartHandler(productId)}>
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
