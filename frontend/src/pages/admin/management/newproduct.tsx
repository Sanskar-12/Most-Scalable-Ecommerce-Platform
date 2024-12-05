import { ChangeEvent, FormEvent, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { RootState } from "../../../types/reducer-types";
import { useNewProductMutation } from "../../../redux/api/productAPI";
import toast from "react-hot-toast";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponseType } from "../../../types/api-types";
import { useNavigate } from "react-router-dom";
import { useFileHandler } from "6pp";

const NewProduct = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.userSlice);

  const [newProduct] = useNewProductMutation();

  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);

  const photos = useFileHandler("multiple", 25, 5);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !price || !stock || !category) return;

    const formData = new FormData();

    formData.set("name", name);
    formData.set("price", price.toString());
    formData.set("category", category);
    formData.set("stock", stock.toString());
    if (photos) {
      photos.file.forEach((file) => formData.append("photos", file));
    }

    const res = await newProduct({
      formData,
      userId: user?._id as string,
    });

    if ("data" in res) {
      toast.success(res.data?.message as string);
      console.log(res.data);

      setName("");
      setCategory("");
      setPrice(0);
      setStock(0);

      navigate("/admin/product");
    } else {
      const error = res.error as FetchBaseQueryError;
      const message = (error.data as MessageResponseType).message;
      toast.error(message);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form onSubmit={handleSubmit}>
            <h2>New Product</h2>
            <div>
              <label>Name</label>
              <input
                required
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                required
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                required
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Category</label>
              <input
                required
                type="text"
                placeholder="eg. laptop, camera etc"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div>
              <label>Photo</label>
              <input
                required
                type="file"
                multiple
                onChange={photos.changeHandler}
              />
            </div>

            {photos.error && <p>{photos.error}</p>}

            {photos.preview &&
              photos.preview.map((photo, i) => (
                <img key={i} src={photo} alt="Photo" />
              ))}
            <button type="submit">Create</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
