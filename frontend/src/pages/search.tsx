import { useState } from "react";
import ProductCard from "../components/Product-Card";
import {
  useCategoriesQuery,
  useSearchProductsQuery,
} from "../redux/api/productAPI";
import toast from "react-hot-toast";
import { CustomError } from "../types/api-types";
import { Skeleton } from "../components/Loader";
import { useDispatch } from "react-redux";
import { CartItemsType } from "../types/types";
import { addToCart } from "../redux/reducer/cartSlice";

const Search = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError,
    error,
  } = useCategoriesQuery("");

  const {
    data: searchedProduct,
    isLoading: searchedProductLoading,
    isError: searchedProductIsError,
    error: searchedProductError,
  } = useSearchProductsQuery({
    search,
    sort,
    price: maxPrice,
    category,
    page,
  });

  const addToCartHandler = (cartItem: CartItemsType) => {
    if (cartItem.stock < 1) toast.error("Out of Stock");
    else {
      dispatch(addToCart(cartItem));
      toast.success("Added to Cart");
    }
  };

  const isPrevPage = page > 1;
  const isNextPage = page < (searchedProduct?.totalPages as number);

  if (isError) {
    toast.error((error as CustomError).data.message);
  }

  if (searchedProductIsError) {
    toast.error((searchedProductError as CustomError).data.message);
  }

  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">Price (High to Low)</option>
          </select>
        </div>
        <div>
          <h4>Max Price: {maxPrice || ""}</h4>
          <input
            type="range"
            min={100}
            max={1000000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
        <div>
          <h4>Category</h4>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">ALL</option>
            {categoriesLoading === false &&
              categoriesData?.categories.map((category) => (
                <option key={category} value={category}>
                  {category.toUpperCase()}
                </option>
              ))}
          </select>
        </div>
      </aside>
      <main>
        <h1>Products</h1>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="search-product-list">
          {searchedProductLoading ? (
            <Skeleton length={10} />
          ) : (
            searchedProduct?.products.map((product) => (
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
        </div>
        {searchedProduct && searchedProduct.totalPages > 1 && (
          <article>
            <button
              disabled={!isPrevPage}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Prev
            </button>
            <span>
              {page} of {searchedProduct?.totalPages}
            </span>
            <button
              disabled={!isNextPage}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </article>
        )}
      </main>
    </div>
  );
};

export default Search;
