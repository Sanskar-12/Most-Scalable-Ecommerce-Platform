import { Navigate, useParams } from "react-router-dom";
import {
  useAddOrUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetAllReviewsQuery,
  useProductDetailQuery,
} from "../redux/api/productAPI";
import { Skeleton } from "../components/Loader";
import { CarouselButtonType, MyntraCarousel, Slider, useRating } from "6pp";
import { FormEvent, useRef, useState } from "react";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import RatingsComponent from "../components/Ratings";
import { CartItemsType, Review, User } from "../types/types";
import toast from "react-hot-toast";
import { addToCart } from "../redux/reducer/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit } from "react-icons/fi";
import { FaRegStar, FaStar, FaTrash } from "react-icons/fa";
import { RootState } from "../types/reducer-types";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponseType } from "../types/api-types";

const ProductDetails = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const reviewDialogRef = useRef<HTMLDialogElement>(null);

  const { user } = useSelector((state: RootState) => state.userSlice);

  const { data, isLoading, isError } = useProductDetailQuery(
    params.id as string
  );

  const { data: reviewData, isLoading: reviewLoading } = useGetAllReviewsQuery(
    params.id as string
  );

  const [addOrUpdateReview] = useAddOrUpdateReviewMutation();
  const [deleteReviewApi] = useDeleteReviewMutation();

  const [carouselOpen, setCarouselOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState("");

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

  const showModal = () => {
    reviewDialogRef.current?.showModal();
  };

  const {
    Ratings: RatingsEditable,
    rating,
    setRating,
  } = useRating({
    IconFilled: <FaStar />,
    IconOutline: <FaRegStar />,
    value: 0,
    selectable: true,
    styles: {
      fontSize: "1.75rem",
      color: "coral",
      justifyContent: "flex-start",
      gap: "1px",
    },
  });

  const closeModal = () => {
    reviewDialogRef.current?.close();
    setRating(0);
    setComment("");
  };

  const submitReview = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      reviewDialogRef.current?.close();

      const formData = new FormData();
      if (comment) {
        formData.set("comment", comment);
      }

      formData.set("rating", rating.toString());

      const res = await addOrUpdateReview({
        formData,
        userId: user?._id as string,
        productId: params.id as string,
      });

      if ("data" in res) {
        toast.success(res.data?.message as string);
        console.log(res.data);
      } else {
        const error = res.error as FetchBaseQueryError;
        const message = (error.data as MessageResponseType).message;
        toast.error(message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error as string);
    } finally {
      setRating(0);
      setComment("");
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      const res = await deleteReviewApi({
        reviewId,
        userId: user?._id as string,
      });

      if ("data" in res) {
        toast.success(res.data?.message as string);
        console.log(res.data);
      } else {
        const error = res.error as FetchBaseQueryError;
        const message = (error.data as MessageResponseType).message;
        toast.error(message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error as string);
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
              <em
                style={{ display: "flex", gap: "1rem", alignItems: "center" }}
              >
                <RatingsComponent value={data?.product.ratings || 0} />
                {data?.product.noOfReviews} reviews
              </em>
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

      <dialog ref={reviewDialogRef} className="review-dialog">
        <button onClick={closeModal}>X</button>
        <h2>Write a Review</h2>
        <form onSubmit={submitReview}>
          <RatingsEditable />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Review..."
          ></textarea>
          <button type="submit">Submit</button>
        </form>
      </dialog>

      <section>
        <article>
          <h2>Reviews</h2>
          {reviewLoading
            ? null
            : user && (
                <button onClick={showModal}>
                  <FiEdit />
                </button>
              )}
        </article>
        <div
          style={{
            display: "flex",
            gap: "2rem",
            overflowX: "auto",
            padding: "2rem",
          }}
        >
          {reviewLoading ? (
            <>
              <Skeleton width="45rem" length={5} />
              <Skeleton width="45rem" length={5} />
              <Skeleton width="45rem" length={5} />
            </>
          ) : (
            reviewData?.reviews.map((review) => (
              <ReviewCard
                review={review}
                user={user!}
                deleteReview={deleteReview}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

const ReviewCard = ({
  review,
  user,
  deleteReview,
}: {
  review: Review;
  user: User;
  deleteReview: (reviewId: string) => void;
}) => {
  return (
    <div key={review._id} className="review">
      <RatingsComponent value={review.rating} />
      <p>{review.comment}</p>
      <div>
        <img src={review.user.photo} alt="User Image" />
        <small>{review.user.name}</small>
      </div>
      {review.user._id === user?._id && (
        <button onClick={() => deleteReview(review._id)}>
          <FaTrash />
        </button>
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
