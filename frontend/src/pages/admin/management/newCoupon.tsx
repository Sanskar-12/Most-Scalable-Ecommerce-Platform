import { FormEvent, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { RootState } from "../../../types/reducer-types";
import toast from "react-hot-toast";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponseType } from "../../../types/api-types";
import { useNavigate } from "react-router-dom";
import { useNewCouponMutation } from "../../../redux/api/couponAPI";

const NewCoupon = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.userSlice);

  const [newCoupon] = useNewCouponMutation();

  const [isLoading, setIsLoading] = useState(false);

  const [code, setCode] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.set("coupon", code);
      formData.set("amount", amount.toString());

      const res = await newCoupon({
        formData,
        userId: user?._id as string,
      });

      if ("data" in res) {
        toast.success(res.data?.message as string);

        setCode("");
        setAmount(0);

        navigate("/admin/coupon");
      } else {
        const error = res.error as FetchBaseQueryError;
        const message = (error.data as MessageResponseType).message;
        toast.error(message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error as string);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form onSubmit={handleSubmit}>
            <h2>New Coupon</h2>
            <div>
              <label>Coupon Code</label>
              <input
                required
                type="text"
                placeholder="Coupon Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div>
              <label>Amount</label>
              <input
                required
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </div>

            <button disabled={isLoading} type="submit">
              Create
            </button>
          </form>
        </article>
      </main>
    </div>
  );
};
export default NewCoupon;
