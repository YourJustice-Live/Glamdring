import { DataObjectOutlined, ModeEditOutline } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import JsonViewDialog from 'components/json/JsonViewDialog';
import useDialogContext from 'hooks/context/useDialogContext';
import useAction from 'hooks/useAction';
import { useEffect, useState } from 'react';
import { getActionIcon } from 'utils/metadata';
import ActionManageDialog from './ActionManageDialog';
import useErrors from 'hooks/useErrors';

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
      width: 100,
      getActions: (params) => {
        const actions = [
          <GridActionsCellItem
            key="viewJson"
            icon={<DataObjectOutlined />}
            label="View as JSON"
            onClick={() =>
              showDialog(
                <JsonViewDialog json={params.row} onClose={closeDialog} />,
              )
            }
          />,
          <GridActionsCellItem
            key="updateAction"
            icon={<ModeEditOutline />}
            label="Update Action"
            onClick={() =>
              showDialog(
                <ActionManageDialog
                  action={params.row}
                  onClose={closeDialog}
                />,
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
      field: 'metadata',
      headerName: 'Metadata',
      width: 600,
      valueGetter: (params) => `${params.row.uriData?.name || 'None'}`,
      renderCell: (params) => (
        <Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            {getActionIcon(params.row, 28)}
            <Typography>{params.row.uriData?.name || 'None'}</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {params.row.uriData?.description || 'None'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'subject',
      headerName: 'Acted',
      width: 200,
      valueGetter: (params) => `${params.row.action.subject || 'None'}`,
    },
    {
      field: 'verb',
      headerName: 'Verb',
      width: 400,
      valueGetter: (params) => `${params.row.action.verb || 'None'}`,
    },
    {
      field: 'object',
      headerName: 'Object',
      width: 100,
      valueGetter: (params) => `${params.row.action.object || 'None'}`,
    },
  ];

  async function loadData() {
    try {
      setRows([]);
      setIsLoading(true);
      const actions = await getActions();
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
