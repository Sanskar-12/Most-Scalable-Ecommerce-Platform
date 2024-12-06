import { FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import {
  useDeleteProductMutation,
  useProductDetailQuery,
  useUpdateProductMutation,
} from "../../../redux/api/productAPI";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../types/reducer-types";
import toast from "react-hot-toast";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponseType } from "../../../types/api-types";
import { Skeleton } from "../../../components/Loader";
import { useFileHandler } from "6pp";

const Productmanagement = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.userSlice);

  const { data, isError, isLoading } = useProductDetailQuery(
    params.id as string
  );
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const { name, description, photos, price, stock, category, _id } =
    data?.product || {
      _id: "",
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
      photos: [],
    };

  const [isLoadingButton, setIsLoadingButton] = useState(false);

  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [descriptionUpdate, setDescriptionUpdate] =
    useState<string>(description);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);

  const photosFile = useFileHandler("multiple", 25, 5);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoadingButton(true);
    try {
      if (
        !nameUpdate ||
        !descriptionUpdate ||
        !priceUpdate ||
        stockUpdate < 0 ||
        !categoryUpdate ||
        !photosFile
      )
        return;

      const formData = new FormData();

      if (nameUpdate) {
        formData.set("name", nameUpdate);
      }
      if (descriptionUpdate) {
        formData.set("description", descriptionUpdate);
      }
      if (priceUpdate) {
        formData.set("price", priceUpdate.toString());
      }
      if (stockUpdate >= 0) {
        formData.set("stock", stockUpdate.toString());
      }
      if (categoryUpdate) {
        formData.set("category", categoryUpdate);
      }
      if (photosFile.file && photosFile.file.length > 0) {
        photosFile.file.forEach((file) => formData.append("photos", file));
      }

      const res = await updateProduct({
        formData,
        userId: user?._id as string,
        productId: _id,
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
      setIsLoadingButton(false);
    }
  };

  const deleteHandler = async () => {
    const res = await deleteProduct({
      userId: user?._id as string,
      productId: _id,
    });

    if ("data" in res) {
      toast.success(res.data?.message as string);
      console.log(res.data);
      navigate("/admin/product");
    } else {
      const error = res.error as FetchBaseQueryError;
      const message = (error.data as MessageResponseType).message;
      toast.error(message);
    }
  };

  useEffect(() => {
    if (data) {
      setPriceUpdate(data.product.price);
      setCategoryUpdate(data.product.category);
      setNameUpdate(data.product.name);
      setDescriptionUpdate(data.product.description);
      setStockUpdate(data.product.stock);
    }
  }, [data]);

  if (isError) return <Navigate to={"/404"} />;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <>
            <section>
              <strong>ID - {_id}</strong>
              <img src={photos[0]?.url} alt="Product" />
              <p>{name}</p>
              {stock > 0 ? (
                <span className="green">{stock} Available</span>
              ) : (
                <span className="red"> Not Available</span>
              )}
              <h3>₹{price}</h3>
            </section>
            <article>
              <button className="product-delete-btn" onClick={deleteHandler}>
                <FaTrash />
              </button>
              <form onSubmit={submitHandler}>
                <h2>Manage</h2>
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={nameUpdate}
                    onChange={(e) => setNameUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Description</label>
                  <textarea
                    placeholder="Description"
                    value={descriptionUpdate}
                    onChange={(e) => setDescriptionUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={priceUpdate}
                    onChange={(e) => setPriceUpdate(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label>Stock</label>
                  <input
                    type="number"
                    placeholder="Stock"
                    value={stockUpdate}
                    onChange={(e) => setStockUpdate(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label>Category</label>
                  <input
                    type="text"
                    placeholder="eg. laptop, camera etc"
                    value={categoryUpdate}
                    onChange={(e) => setCategoryUpdate(e.target.value)}
                  />
                </div>
                <div>
                  <label>Photos</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={photosFile.changeHandler}
                  />
                </div>

                {photosFile.error && <p>{photosFile.error}</p>}

                {photosFile.preview && (
                  <div
                    style={{
                      display: "flex",
                      gap: "1rem",
                      overflowX: "auto",
                    }}
                  >
                    {photosFile.preview.map((photo, i) => (
                      <img
                        key={i}
                        src={photo}
                        alt="Preview"
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    ))}
                  </div>
                )}
                <button disabled={isLoadingButton} type="submit">
                  Update
                </button>
              </form>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

export default Productmanagement;
