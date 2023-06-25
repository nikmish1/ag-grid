import { ColDef, GridReadyEvent } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

type AgGridProps<T> = {
  rowData: T[];
  columnDefs?: any[];
  onGridReady: (params: GridReadyEvent) => void;
  updateColumnDef?: ColDef;
};

const defaultColDef: ColDef = {
  editable: true,
  sortable: true,
  flex: 1,
  minWidth: 100,
  filter: true,
};

export const AgGrid = <T,>({
  rowData,
  columnDefs,
  onGridReady,
  updateColumnDef = {},
}: AgGridProps<T>) => {
  const row = rowData ? rowData[0] : {};
  const columns = columnDefs || getColumnsFromRow(row as object);
  console.log("columns: ", columns);
  return (
    <AgGridReact
      rowData={rowData}
      columnDefs={columns}
      defaultColDef={{ ...defaultColDef, ...updateColumnDef }}
      onGridReady={onGridReady}
    ></AgGridReact>
  );
};

const getColumnsFromRow = <T extends object>(row: T): any[] => {
  return Object.keys(row).map((key) => ({ field: key }));
};
