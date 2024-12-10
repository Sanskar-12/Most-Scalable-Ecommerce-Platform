import { Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Skeleton } from "../../components/Loader";
import { Column } from "react-table";
import { ReactElement, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import TableHOC from "../../components/admin/TableHOC";
import { useGetAllCouponsQuery } from "../../redux/api/couponAPI";
import toast from "react-hot-toast";
import { CustomError } from "../../types/api-types";
import { useSelector } from "react-redux";
import { RootState } from "../../types/reducer-types";

interface DataType {
  _id: string;
  code: string;
  amount: number;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Id",
    accessor: "_id",
  },
  {
    Header: "Coupon Code",
    accessor: "code",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Coupon = () => {
  const { user } = useSelector((state: RootState) => state.userSlice);

  const { data, isLoading, isError, error } = useGetAllCouponsQuery(
    user?._id as string
  );

  const [rows, setRows] = useState<DataType[]>([]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Products",
    rows.length > 6
  )();

  if (isError) toast.error((error as CustomError).data.message);

  useEffect(() => {
    if (data) {
      setRows(
        data.coupons.map((coupon) => ({
          _id: coupon._id,
          amount: coupon.amount,
          code: coupon.coupon,
          action: <Link to={`/admin/coupon/${coupon._id}`}>Manage</Link>,
        }))
      );
    }
  }, [data]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={20} /> : Table}</main>
      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Coupon;
