import { DataObjectOutlined } from '@mui/icons-material';
import { Box } from '@mui/system';
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import JsonViewDialog from 'components/json/JsonViewDialog';
import useDialogContext from 'hooks/context/useDialogContext';
import useAction from 'hooks/useAction';
import useErrors from 'hooks/useErrors';
import { useEffect, useState } from 'react';

/**
 * A component with a table with actions.
 *
 * TODO: Move strings to localization file.
 */
export default function ActionTable({ sx }) {
  const { showDialog, closeDialog } = useDialogContext();
  const { handleError } = useErrors();
  const { getActions } = useAction();
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);

  const columns = [
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 60,
      getActions: (params) => {
        const actions = [
          <GridActionsCellItem
            key="viewJson"
            icon={<DataObjectOutlined />}
            label="View as JSON"
            title="View as JSON"
            onClick={() =>
              showDialog(
                <JsonViewDialog json={params.row} onClose={closeDialog} />,
              )
            }
          />,
        ];
        return actions;
      },
    },
    {
      field: 'guid',
      headerName: 'GUID (ID)',
      width: 200,
      valueGetter: (params) => `${params.row.guid}`,
    },
    {
      field: 'subject',
      headerName: 'Acted',
      width: 400,
      valueGetter: (params) => `${params.row.action.subject || ''}`,
    },
    {
      field: 'verb',
      headerName: 'Verb',
      width: 400,
      valueGetter: (params) => `${params.row.action.verb || ''}`,
    },
    {
      field: 'object',
      headerName: 'Object',
      width: 400,
      valueGetter: (params) => `${params.row.action.object || ''}`,
    },
  ];

  async function loadData() {
    try {
      setRows([]);
      setIsLoading(true);
      let actions = await getActions();
      actions = actions.sort((a, b) =>
        a.action?.subject?.localeCompare(b.action?.subject),
      );
      setRows(actions);
    } catch (error) {
      handleError(error, true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ height: 800, ...sx }}>
      <DataGrid
        loading={isLoading}
        rows={rows}
        columns={columns}
        pageSize={50}
        rowsPerPageOptions={[50]}
        rowHeight={84}
        getRowId={(row) => row.guid}
        components={{
          Toolbar: GridToolbar,
        }}
      />
    </Box>
  );
}
