"use client";
import React, { useState }  from "react";
import { Configuration, OpenAIApi } from 'openai-edge';
import {
  gridFilteredSortedRowEntriesSelector,
  useGridApiRef,
  useGridSelector,
  GridColDef,
  GridColumnVisibilityModel,
  GridValidRowModel
} from "@mui/x-data-grid";

export type ApiRef = ReturnType<typeof useGridApiRef>

interface CopilotProps {
  apiRef: ApiRef
}

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY || '',
});
const openai = new OpenAIApi(config);

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

const Copilot: React.FC<CopilotProps> = ( { apiRef } ) => {
  const rows: GridValidRowModel[] = useGridSelector(apiRef, gridFilteredSortedRowEntriesSelector).map<GridValidRowModel>((model) => model.model );
  const [datasource, setDataSource] = useState<string>('');
  const [summaryPrompt, setSummaryPrompt] = useState<string>('');

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const jsonData = JSON.stringify(rows, null, 2);
    setDataSource(jsonData);
    const filterValue = event.target.value;
    const prompt =
      filterValue +
      `\nExtract from this json structure only the needed columns and return only the field asked in input as json. Remember to put always an id property in the structure :\n${datasource}`;
      console.log(prompt);
      setSummaryPrompt(prompt);
  };

  const handleAskCopilot = async () => {
    try {
      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            content: summaryPrompt,
            role: 'user',
          },
        ],
      });

      const summary =
        (await completion.json()).choices?.[0]?.message?.content ?? '';

      const columnKeys = Object.keys(JSON.parse(summary)[0]);

      // Create column definitions dynamically based on the keys
      const dynamicColumns: GridColDef[] = columnKeys.map((key) => ({
        field: key,
        headerName: key.toUpperCase(),
        width: 200,
      }));

      const columnVisibilityModel: GridColumnVisibilityModel = {}

      apiRef.current.getAllColumns().filter(column => dynamicColumns.every(newColumn => newColumn.field !== column.field)).map((column) => (columnVisibilityModel[column.field] = false));
      apiRef.current.setColumnVisibilityModel(columnVisibilityModel);

      apiRef.current.updateColumns(dynamicColumns);
      apiRef.current.setRows(JSON.parse(summary));

    } catch (error) {
      console.error('Error generating summary:', error);
    }
  };

  return (
    <div>
      <input type="text" id="filterInput" onChange={handleFilterChange} placeholder="Ask to Copilot..." />
      <button onClick={handleAskCopilot} type="button">
        Ask
      </button>
    </div>
  );
};

export default Copilot;
