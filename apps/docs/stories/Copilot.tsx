import type { Meta, StoryObj } from '@storybook/react';
import { Copilot } from "ui";
import { DataGrid, useGridApiRef, GridToolbarContainer } from "@mui/x-data-grid";
import { FC } from 'react';

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

const Example: FC = () => {
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
                toolbar: () => (
                    <GridToolbarContainer>
                        <Copilot apiRef={apiRef} />
                    </GridToolbarContainer>
                )
              }}
            />
          </div>
        </div>
      </>
    );
}

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Copilot',
  component: Example,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
} satisfies Meta<typeof Example>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {} satisfies Story;