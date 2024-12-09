import { Navigate, useParams } from "react-router-dom";
import { useProductDetailQuery } from "../redux/api/productAPI";
import { Skeleton } from "../components/Loader";
import { CarouselButtonType, MyntraCarousel, Slider } from "6pp";
import { useState } from "react";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import RatingsComponent from "../components/Ratings";
import { CartItemsType } from "../types/types";
import toast from "react-hot-toast";
import { addToCart } from "../redux/reducer/cartSlice";
import { useDispatch } from "react-redux";

const ProductDetails = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { data, isLoading, isError } = useProductDetailQuery(
    params.id as string
  );

  const [carouselOpen, setCarouselOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleDecrement = () => {
    if (quantity <= 0) return toast.error("Min Quantity reached");
    setQuantity((prev) => prev - 1);
  };

  const handleIncrement = () => {
    if (data?.product.stock === quantity)
      return toast.error("Max Quantity reached");
    setQuantity((prev) => prev + 1);
  };

  const addToCartHandler = (cartItem: CartItemsType) => {
    if (cartItem.stock < 1) toast.error("Out of Stock");
    else {
      dispatch(addToCart(cartItem));
      toast.success("Added to Cart");
    }
  };

  if (isError) return <Navigate to={"*"} />;

  return (
    <div className="product-details">
      {isLoading ? (
        <ProductLoader />
      ) : (
        <>
          <main>
            <section>
              <Slider
                showThumbnails
                showNav={false}
                images={data?.product.photos.map((photo) => photo.url) || []}
                onClick={() => setCarouselOpen(true)}
                objectFit="contain"
              />
              {carouselOpen && (
                <MyntraCarousel
                  images={data?.product.photos.map((photo) => photo.url) || []}
                  setIsOpen={setCarouselOpen}
                  NextButton={NextButton}
                  PrevButton={PrevButton}
                  objectFit="contain"
                />
              )}
            </section>
            <section>
              <code>{data?.product.category}</code>
              <h1>{data?.product.name}</h1>
              <RatingsComponent value={data?.product.ratings || 0} />
              <h3>₹{data?.product.price}</h3>
              <article>
                <div>
                  <button onClick={handleDecrement}>-</button>
                  <span>{quantity}</span>
                  <button onClick={handleIncrement}>+</button>
                </div>
                <button
                  onClick={() =>
                    addToCartHandler({
                      name: data?.product.name as string,
                      photo: data?.product.photos[0].url as string,
                      price: data?.product.price as number,
                      productId: data?.product._id as string,
                      quantity,
                      stock: data?.product.stock as number,
                    })
                  }
                >
                  Add To Cart
                </button>
              </article>
              <p>{data?.product.description}</p>
            </section>
          </main>
        </>
      )}
    </div>
  );
};

const NextButton: CarouselButtonType = ({ onClick }) => {
  return (
    <button onClick={onClick} className="carousel-btn">
      <FaArrowRightLong />
    </button>
  );
};

const PrevButton: CarouselButtonType = ({ onClick }) => {
  return (
    <button onClick={onClick} className="carousel-btn">
      <FaArrowLeftLong />
    </button>
  );
};

const ProductLoader = () => {
  return (
    <div
      style={{
        display: "flex",
        gap: "2rem",
        border: "1px solid #f1f1f1",
        height: "80vh",
      }}
    >
      <section style={{ width: "100%", height: "100%" }}>
        <Skeleton
          width="100%"
          containerHeight="100%"
          height="100%"
          length={1}
        />
      </section>
      <section
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "4rem",
          padding: "2rem",
        }}
      >
        <Skeleton width="40%" length={3} />
        <Skeleton width="50%" length={4} />
        <Skeleton width="100%" length={2} />
        <Skeleton width="100%" length={10} />
      </section>
    </div>
  );
};

export default ProductDetails;
