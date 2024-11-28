import { useSelector } from "react-redux";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { BarChart } from "../../../components/admin/Charts";
import { RootState } from "../../../types/reducer-types";
import { useBarQuery } from "../../../redux/api/dashboardAPI";
import { CustomError } from "../../../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../../../components/Loader";
import { getLastMonths } from "../../../utils/features";

const Barcharts = () => {
  const { user } = useSelector((state: RootState) => state.userSlice);

  const { data, isError, error, isLoading } = useBarQuery(user?._id as string);

  const charts = data?.charts;

  const { last6Months, last12Months } = getLastMonths();

  if (isError) toast.error((error as CustomError).data.message);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <>
            <h1>Bar Charts</h1>
            <section>
              <BarChart
                data_1={charts?.products ?? []}
                data_2={charts?.users ?? []}
                title_1="Products"
                title_2="Users"
                labels={last6Months}
                bgColor_1={`hsl(260, 50%, 30%)`}
                bgColor_2={`hsl(360, 90%, 90%)`}
              />
              <h2>Top Products & Top Customers</h2>
            </section>

            <section>
              <BarChart
                horizontal={true}
                data_1={charts?.orders ?? []}
                data_2={[]}
                title_1="Orders"
                title_2=""
                bgColor_1={`hsl(180, 40%, 50%)`}
                bgColor_2=""
                labels={last12Months}
              />
              <h2>Orders throughout the year</h2>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Barcharts;
