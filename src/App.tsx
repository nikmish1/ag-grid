"use strict";

import React, { useCallback, useMemo, useRef, useState } from "react";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import PersonFilter from "./filters/personFilter.js";
import YearFilter from "./filters/yearFilter.js";
import { ColDef, GridReadyEvent, IDateFilterParams } from "ag-grid-community";
import { OlympicData } from "./types/index.js";
import { AgGrid } from "./lib/grid/index.js";

const App = () => {
  const [rowData, setRowData] = useState<OlympicData[]>();

  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      field: "athlete",
      headerName: "Athe",
      minWidth: 150,
      filter: PersonFilter,
    },
    { field: "age", filter: "agNumberColumnFilter" },
    { field: "country", minWidth: 150 },
    { field: "year", filter: YearFilter },
    {
      field: "date",
      minWidth: 130,
      filter: "agDateColumnFilter",
      filterParams: {
        comparator: function (
          filterLocalDateAtMidnight: Date,
          cellValue: string
        ) {
          const dateAsString = cellValue;
          const dateParts = dateAsString.split("/");
          const cellDate = new Date(
            Number(dateParts[2]),
            Number(dateParts[1]) - 1,
            Number(dateParts[0])
          );
          if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
            return 0;
          }
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          }
          if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
        },
      } as IDateFilterParams,
    },
    { field: "sport" },
    { field: "gold", filter: "agNumberColumnFilter" },
    { field: "silver", filter: "agNumberColumnFilter" },
    { field: "bronze", filter: "agNumberColumnFilter" },
    { field: "total", filter: "agNumberColumnFilter" },
  ]);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    console.log("grid ready....");
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data: OlympicData[]) => {
        setRowData(data);
      });
  }, []);

  return (
    <div style={{ height: "500px" }}>
      <div className="ag-theme-alpine" style={{ height: "500px" }}>
        <AgGrid
          rowData={rowData}
          columnDefs={columnDefs}
          updateColumnDef={{ resizable: true }}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

export default App;
