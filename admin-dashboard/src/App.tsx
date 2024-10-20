import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loader from "./components/Loader";

// Code splitting
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Products = lazy(() => import("./pages/Products"));
const Transactions = lazy(() => import("./pages/Transactions"));
const Customers = lazy(() => import("./pages/Customers"));
const CreateProduct = lazy(() => import("./pages/management/Create-Product"));
const ProductManagement = lazy(
  () => import("./pages/management/Product-Management")
);
const TransactionManagement = lazy(
  () => import("./pages/management/Transaction-Management")
);
const BarCharts = lazy(() => import("./pages/charts/BarCharts"));
const PieCharts = lazy(() => import("./pages/charts/PieCharts"));
const LineCharts = lazy(() => import("./pages/charts/LineCharts"));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Pages */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/product" element={<Products />} />
          <Route path="/admin/customer" element={<Customers />} />
          <Route path="/admin/transaction" element={<Transactions />} />

          {/* Charts */}
          <Route path="/admin/chart/bar" element={<BarCharts />} />
          <Route path="/admin/chart/pie" element={<PieCharts />} />
          <Route path="/admin/chart/line" element={<LineCharts />} />

          {/* Apps */}

          {/* Management */}
          <Route path="/admin/product/new" element={<CreateProduct />} />
          <Route path="/admin/product/:id" element={<ProductManagement />} />
          <Route
            path="/admin/transaction/:id"
            element={<TransactionManagement />}
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
