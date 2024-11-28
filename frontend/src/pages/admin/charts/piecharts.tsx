import AdminSidebar from "../../../components/admin/AdminSidebar";
import { DoughnutChart, PieChart } from "../../../components/admin/Charts";
import { useSelector } from "react-redux";
import { RootState } from "../../../types/reducer-types";
import { usePieQuery, useStatsQuery } from "../../../redux/api/dashboardAPI";
import { categories } from "../../../assets/data.json";
import { CustomError } from "../../../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../../../components/Loader";

const PieCharts = () => {
  const { user } = useSelector((state: RootState) => state.userSlice);

  const { data, isError, error, isLoading } = usePieQuery(user?._id as string);

  const charts = data?.charts;

  if (isError) toast.error((error as CustomError).data.message);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        {isLoading ? (
          <Skeleton length={20} />
        ) : (
          <>
            <h1>Pie & Doughnut Charts</h1>
            <section>
              <div>
                <PieChart
                  labels={["Processing", "Shipped", "Delivered"]}
                  data={[
                    Number(charts?.orderFullfillment.processing),
                    Number(charts?.orderFullfillment.shipped),
                    Number(charts?.orderFullfillment.delivered),
                  ]}
                  backgroundColor={[
                    `hsl(110,80%, 80%)`,
                    `hsl(110,80%, 50%)`,
                    `hsl(110,40%, 50%)`,
                  ]}
                  offset={[0, 0, 50]}
                />
              </div>
              <h2>Order Fulfillment Ratio</h2>
            </section>

            <section>
              <div>
                <DoughnutChart
                  labels={
                    charts?.productCategories.map((i) => Object.keys(i)[0]) ??
                    []
                  }
                  data={
                    charts?.productCategories.map((i) => Object.values(i)[0]) ??
                    []
                  }
                  backgroundColor={
                    charts?.productCategories.map(
                      (i) =>
                        `hsl(${Object.values(i)[0] * 4}, ${
                          Object.values(i)[0]
                        }%, 50%)`
                    ) ?? []
                  }
                  legends={false}
                  offset={[0, 0, 0, 80]}
                />
              </div>
              <h2>Product Categories Ratio</h2>
            </section>

            <section>
              <div>
                <DoughnutChart
                  labels={["In Stock", "Out Of Stock"]}
                  data={[
                    Number(charts?.stockAvailability.inStock),
                    Number(charts?.stockAvailability.outOfStock),
                  ]}
                  backgroundColor={["hsl(269,80%,40%)", "rgb(53, 162, 255)"]}
                  legends={false}
                  offset={[0, 80]}
                  cutout={"70%"}
                />
              </div>
              <h2> Stock Availability</h2>
            </section>

            <section>
              <div>
                <DoughnutChart
                  labels={[
                    "Marketing Cost",
                    "Discount",
                    "Burnt",
                    "Production Cost",
                    "Net Margin",
                  ]}
                  data={[
                    Number(charts?.revenueDistribution.marketingCost),
                    Number(charts?.revenueDistribution.discount),
                    Number(charts?.revenueDistribution.burnt),
                    Number(charts?.revenueDistribution.productionCost),
                    Number(charts?.revenueDistribution.netMargin),
                  ]}
                  backgroundColor={[
                    "hsl(110,80%,40%)",
                    "hsl(19,80%,40%)",
                    "hsl(69,80%,40%)",
                    "hsl(300,80%,40%)",
                    "rgb(53, 162, 255)",
                  ]}
                  legends={false}
                  offset={[20, 30, 20, 30, 80]}
                />
              </div>
              <h2>Revenue Distribution</h2>
            </section>

            <section>
              <div>
                <PieChart
                  labels={[
                    "Teenager(Below 20)",
                    "Adult (20-40)",
                    "Older (above 40)",
                  ]}
                  data={[
                    Number(charts?.usersAgeGroup.teen),
                    Number(charts?.usersAgeGroup.adult),
                    Number(charts?.usersAgeGroup.old),
                  ]}
                  backgroundColor={[
                    `hsl(10, ${80}%, 80%)`,
                    `hsl(10, ${80}%, 50%)`,
                    `hsl(10, ${40}%, 50%)`,
                  ]}
                  offset={[0, 0, 50]}
                />
              </div>
              <h2>Users Age Group</h2>
            </section>

            <section>
              <div>
                <DoughnutChart
                  labels={["Admin", "Customers"]}
                  data={[
                    Number(charts?.adminCustomers.adminUsersCount),
                    Number(charts?.adminCustomers.customerUsersCount),
                  ]}
                  backgroundColor={[`hsl(335, 100%, 38%)`, "hsl(44, 98%, 50%)"]}
                  offset={[0, 50]}
                />
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default PieCharts;
