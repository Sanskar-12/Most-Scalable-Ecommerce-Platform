import { Skeleton } from "../components/Loader";
import { Navigate, useParams } from "react-router-dom";
import { useOrderDetailsQuery } from "../redux/api/orderAPI";
import OrderItem from "../components/Order-Item";

const OrderDetail = () => {
  const params = useParams();

  const { data, isLoading, isError } = useOrderDetailsQuery(
    params.id as string
  );

  if (isError) return <Navigate to={"/404"} />;

  return (
    <div className="product-details">
      {isLoading ? (
        <ProductLoader />
      ) : (
        <>
          <div className="cart">
            <main>
              {data && data.order.orderItems.length > 0 ? (
                data.order.orderItems.map((orderitem, index) => (
                  <OrderItem key={index} orderItem={orderitem} />
                ))
              ) : (
                <h1>No Ordered Items</h1>
              )}
            </main>
            <aside>
              <article className="shipping-info-card">
                <h1>Order Info</h1>
                <h5>User Info</h5>
                <p>Name: {data?.order.user.name}</p>
                <p>
                  Address:{" "}
                  {`${data?.order.shippingInfo.address}, ${data?.order.shippingInfo.city}, ${data?.order.shippingInfo.state}, ${data?.order.shippingInfo.country} ${data?.order.shippingInfo.pinCode}`}
                </p>

                <h5>Payment Info</h5>
                <p>Subtotal: ₹{data?.order.subtotal}</p>
                <p>Shipping Charges: ₹{data?.order.shippingCharges}</p>
                <p>Tax: ₹{data?.order.tax}</p>
                <p>
                  Discount: <em className="red"> - ₹{data?.order.discount}</em>
                </p>
                <p>
                  <b>Total: ₹{data?.order.total}</b>
                </p>

                <h5>Status Info</h5>
                <p>
                  Status:{" "}
                  <span
                    className={
                      data?.order.status === "Delivered"
                        ? "purple"
                        : data?.order.status === "Shipped"
                        ? "green"
                        : "red"
                    }
                  >
                    {data?.order.status}
                  </span>
                </p>
              </article>
            </aside>
          </div>
        </>
      )}
    </div>
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

export default OrderDetail;
