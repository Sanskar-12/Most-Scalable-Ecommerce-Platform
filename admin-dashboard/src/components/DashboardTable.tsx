import { Column } from "react-table";
import TableHOC from "./TableHOC";

interface TableHOCProps {
  id: string;
  quantity: number;
  discount: number;
  amount: number;
  status: string;
}

const columns: Column<TableHOCProps>[] = [
  {
    Header: "Id",
    accessor: "id",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
  },
  {
    Header: "Discount",
    accessor: "discount",
  },
  {
    Header: "Amount",
    accessor: "amount",
  },
  {
    Header: "Status",
    accessor: "status",
  },
];

const DashboardTable = ({ data = [] }: { data: TableHOCProps[] }) => {
  return TableHOC<TableHOCProps>(
    columns,
    data,
    "transaction-box",
    "Top Transactions"
  )();
};

export default DashboardTable;
