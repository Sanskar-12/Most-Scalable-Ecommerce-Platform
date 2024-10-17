import { Column, TableOptions, useTable } from "react-table";

function TableHOC<T extends object>(
  columns: Column<T>[],
  data: T[],
  containerClassname: string,
  heading: string
) {
  return function HOC() {
    const options: TableOptions<T> = {
      columns,
      data,
    };

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
      useTable(options);

    return (
      <div className={containerClassname}>
        <h2 className="heading">{heading}</h2>
        <table className="table">
          <thead></thead>
          <tbody></tbody>
        </table>
      </div>
    );
  };
}

export default TableHOC;
