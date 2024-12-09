import { Link } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Skeleton } from "../../components/Loader";
import { Column } from "react-table";
import { ReactElement, useState } from "react";
import { FaPlus } from "react-icons/fa";
import TableHOC from "../../components/admin/TableHOC";
import { useFetchData } from "6pp";
import { server } from "../../redux/store";
import { AllCouponsResponse } from "../../types/api-types";
import toast from "react-hot-toast";

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
  const [rows, setRows] = useState<DataType[]>([]);
  const isLoading = false;

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Products",
    rows.length > 6
  )();

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
