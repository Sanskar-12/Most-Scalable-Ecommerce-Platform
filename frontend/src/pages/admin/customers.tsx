import { ReactElement, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from "../../redux/api/userAPI";
import { RootState } from "../../types/reducer-types";
import { useSelector } from "react-redux";
import { CustomError, MessageResponseType } from "../../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../../components/Loader";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Customers = () => {
  const { user } = useSelector((state: RootState) => state.userSlice);

  const { data, isLoading, isError, error } = useGetAllUsersQuery(
    user?._id as string
  );
  const [deleteUser] = useDeleteUserMutation();

  const [rows, setRows] = useState<DataType[]>([]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Customers",
    rows.length > 6
  )();

  const deleteHandler = async (userId: string) => {
    const res = await deleteUser({
      userId,
      adminId: user?._id as string,
    });

    if ("data" in res) {
      toast.success(res.data?.message as string);
      console.log(res.data);
    } else {
      const error = res.error as FetchBaseQueryError;
      const message = (error.data as MessageResponseType).message;
      toast.error(message);
    }
  };

  if (isError) toast.error((error as CustomError).data.message);

  useEffect(() => {
    if (data) {
      setRows(
        data.users.map((user) => ({
          avatar: (
            <img
              style={{
                borderRadius: "50%",
              }}
              src={user?.photo}
              alt="User Image"
            />
          ),
          name: user?.name,
          email: user?.email,
          gender: user?.gender,
          role: user?.role,
          action: (
            <button>
              <FaTrash onClick={() => deleteHandler(user._id)} />
            </button>
          ),
        }))
      );
    }
  }, [data]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={20} /> : Table}</main>
    </div>
  );
};

export default Customers;
