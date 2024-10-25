import { FaPlus } from "react-icons/fa";

interface ProductCardProps {
  productId: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  addToCartHandler: () => void;
}

const server = "sdfsdfsdf";

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
      <img src={photo} alt={name} />
      <p>{name}</p>
      <span>₹{price}</span>
      <div>
        <button onClick={()=>addToCartHandler()}>
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
