"use client"
import { Copilot, ApiRef } from "ui";
import { DataGrid, useGridApiRef, GridToolbarContainer } from "@mui/x-data-grid";

const columns = [
  { field: "name", headerName: "Name", width: 150 },
  { field: "age", headerName: "Age", width: 100 },
  { field: "city", headerName: "City", width: 150 }
];

const rows = [
  { id: 1, name: "John Doe", age: 30, city: "New York" },
  { id: 2, name: "Jane Smith", age: 25, city: "Los Angeles" },
  { id: 3, name: "Bob Johnson", age: 40, city: "Chicago" }
];

function CustomToolbar({ apiRef } : { apiRef: ApiRef } ) {
  return (
    <GridToolbarContainer>
      <Copilot apiRef={apiRef} />
    </GridToolbarContainer>
  );
}

export default function Page() {
  const apiRef = useGridApiRef();
  return (
    <>
      <div>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            apiRef={apiRef}
            columns={columns}
            rows={rows}
            slots={{
              toolbar: () => <CustomToolbar apiRef={ apiRef } />
            }}
          />
        </div>
      </div>
    </>
  );
}
