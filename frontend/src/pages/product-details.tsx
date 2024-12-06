import { useParams } from "react-router-dom";
import { useProductDetailQuery } from "../redux/api/productAPI";
import { Skeleton } from "../components/Loader";
import { CarouselButtonType, MyntraCarousel, Slider } from "6pp";
import { useState } from "react";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import RatingsComponent from "../components/Ratings";

const ProductDetails = () => {
  const params = useParams();

  const { data, isLoading, isError, error } = useProductDetailQuery(
    params.id as string
  );

  const [carouselOpen, setCarouselOpen] = useState(false);

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
              <h1>{data?.product.name}</h1>
              <code>{data?.product.category}</code>
              <RatingsComponent value={data?.product.ratings || 0} />
              <h3>₹{data?.product.price}</h3>
              <article>
                <div>
                  <button>-</button>
                  <span>0</span>
                  <button>+</button>
                </div>
                <button>Add To Cart</button>
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
