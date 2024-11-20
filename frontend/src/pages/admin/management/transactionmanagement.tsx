import { FaTrash } from "react-icons/fa";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { RootState } from "../../../types/reducer-types";
import {
  useDeleteOrderMutation,
  useOrderDetailsQuery,
  useUpdateOrderMutation,
} from "../../../redux/api/orderAPI";
import { OrderItemType } from "../../../types/types";
import { server } from "../../../redux/store";
import { Skeleton } from "../../../components/Loader";
import toast from "react-hot-toast";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponseType } from "../../../types/api-types";

const TransactionManagement = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.userSlice);

  const { data, isLoading, isError } = useOrderDetailsQuery(
    params.id as string
  );
  const [updateOrderStatus] = useUpdateOrderMutation();
  const [deleteOrderStatus] = useDeleteOrderMutation();

  const {
    shippingInfo: { address, city, state, country, pinCode },
    status,
    subtotal,
    discount,
    shippingCharges,
    tax,
    total,
    orderItems,
    user: { name },
    _id,
  } = data?.order || {
    shippingInfo: {
      address: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
    },
    status: "",
    subtotal: 0,
    discount: 0,
    shippingCharges: 0,
    tax: 0,
    total: 0,
    orderItems: [],
    user: {
      _id: "",
      name: "",
    },
    _id: "",
  };

  const updateHandler = async () => {
    const res = await updateOrderStatus({
      orderId: params.id as string,
      userId: user?._id as string,
    });

    if ("data" in res) {
      if (status === "Delivered") return toast.error("Already Delivered");
      toast.success(res.data?.message as string);
      console.log(res.data);
      navigate("/admin/transaction");
    } else {
      const error = res.error as FetchBaseQueryError;
      const message = (error.data as MessageResponseType).message;
      toast.error(message);
    }
  };

  const deleteHandler = async () => {
    const res = await deleteOrderStatus({
      orderId: params.id as string,
      userId: user?._id as string,
    });

    if ("data" in res) {
      toast.success(res.data?.message as string);
      console.log(res.data);
      navigate("/admin/transaction");
    } else {
      const error = res.error as FetchBaseQueryError;
      const message = (error.data as MessageResponseType).message;
      toast.error(message);
    }
  };

  if (isError) return <Navigate to={"/404"} />;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <>
            <section
              style={{
                padding: "2rem",
              }}
            >
              <h2>Order Items</h2>

              {orderItems.map((i) => (
                <ProductCard
                  key={i._id}
                  name={i.name}
                  photo={i.photo}
                  productId={i.productId}
                  _id={i._id}
                  quantity={i.quantity}
                  price={i.price}
                />
              ))}
            </section>

            <article className="shipping-info-card">
              <button className="product-delete-btn" onClick={deleteHandler}>
                <FaTrash />
              </button>
              <h1>Order Info</h1>
              <h5>User Info</h5>
              <p>Name: {name}</p>
              <p>
                Address:{" "}
                {`${address}, ${city}, ${state}, ${country} ${pinCode}`}
              </p>
              <h5>Amount Info</h5>
              <p>Subtotal: {subtotal}</p>
              <p>Shipping Charges: {shippingCharges}</p>
              <p>Tax: {tax}</p>
              <p>Discount: {discount}</p>
              <p>Total: {total}</p>

              <h5>Status Info</h5>
              <p>
                Status:{" "}
                <span
                  className={
                    status === "Delivered"
                      ? "purple"
                      : status === "Shipped"
                      ? "green"
                      : "red"
                  }
                >
                  {status}
                </span>
              </p>
              <button className="shipping-btn" onClick={updateHandler}>
                Process Status
              </button>
            </article>
          </>
        )}
      </main>
    </div>
  );
};

const ProductCard = ({
  name,
  photo,
  price,
  quantity,
  productId,
}: OrderItemType) => (
  <div className="transaction-product-card">
    <img src={`${server}/${photo}`} alt={name} />
    <Link to={`/product/${productId}`}>{name}</Link>
    <span>
      ₹{price} X {quantity} = ₹{price * quantity}
    </span>
  </div>
);

export default TransactionManagement;
