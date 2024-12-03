import { Link } from "react-router-dom";
import ProductCard from "../components/Product-Card";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import toast from "react-hot-toast";
import { Skeleton } from "../components/Loader";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartSlice";
import { CartItemsType } from "../types/types";

const Home = () => {
  const dispatch = useDispatch();

  const { data, isLoading, isError } = useLatestProductsQuery("");

  const addToCartHandler = (cartItem: CartItemsType) => {
    if (cartItem.stock < 1) toast.error("Out of Stock");
    else {
      dispatch(addToCart(cartItem));
      toast.success("Added to Cart");
    }
  };

  if (isError) toast.error("Cannot Fetch the Products");

  return (
    <div className="home">
      <section></section>

      <h1>
        Latest Products
        <Link to={"/search"} className="find-more">
          More
        </Link>
      </h1>

      <main>
        {isLoading ? (
          <Skeleton width="50vw" />
        ) : (
          data?.products.map((product) => (
            <ProductCard
              key={product._id}
              productId={product._id}
              name={product.name}
              price={product.price}
              stock={product.stock}
              addToCartHandler={addToCartHandler}
              photos={product.photos}
            />
          ))
        )}
      </main>
    </div>
  );
};

export default Home;
