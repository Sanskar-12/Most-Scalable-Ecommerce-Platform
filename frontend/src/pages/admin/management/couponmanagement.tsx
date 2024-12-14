import { FaTrash } from "react-icons/fa";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Skeleton } from "../../../components/Loader";
import { FormEvent, useEffect, useState } from "react";
import {
  useDeleteCouponMutation,
  useUpdateCouponMutation,
  useViewCouponQuery,
} from "../../../redux/api/couponAPI";
import toast from "react-hot-toast";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../types/reducer-types";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponseType } from "../../../types/api-types";

const CouponManagement = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState("");
  const [amountUpdate, setAmountUpdate] = useState(0);
  const [isLoadingButton, setIsLoadingButton] = useState(false);

  const { user } = useSelector((state: RootState) => state.userSlice);

  const { data, isLoading, isError } = useViewCouponQuery({
    couponId: params.id as string,
    userId: user?._id as string,
  });

  const [updateCoupon] = useUpdateCouponMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoadingButton(true);
      if (!couponCode || !amountUpdate) return;

      const formData = new FormData();
      if (couponCode) {
        formData.set("coupon", couponCode);
      }
      if (amountUpdate) {
        formData.set("amount", amountUpdate.toString());
      }

      const res = await updateCoupon({
        couponId: params.id as string,
        userId: user?._id as string,
        formData,
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
    const res = await deleteCoupon({
      userId: user?._id as string,
      couponId: params.id as string,
    });

    if ("data" in res) {
      toast.success(res.data?.message as string);
      navigate("/admin/coupon");
    } else {
      const error = res.error as FetchBaseQueryError;
      const message = (error.data as MessageResponseType).message;
      toast.error(message);
    }
  };

  useEffect(() => {
    if (data) {
      setCouponCode(data.coupon.coupon);
      setAmountUpdate(data.coupon.amount);
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
            <article>
              <button className="product-delete-btn" onClick={deleteHandler}>
                <FaTrash />
              </button>
              <form onSubmit={handleSubmit}>
                <h2>Manage</h2>
                <div>
                  <label>Coupon Code</label>
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                </div>

                <div>
                  <label>Price</label>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={amountUpdate}
                    onChange={(e) => setAmountUpdate(Number(e.target.value))}
                  />
                </div>

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

export default CouponManagement;
