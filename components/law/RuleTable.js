import { DataObjectOutlined, ModeEditOutline } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { DataGrid, GridActionsCellItem, GridToolbar } from '@mui/x-data-grid';
import JsonViewDialog from 'components/json/JsonViewDialog';
import { REPUTATION_RATING } from 'constants/contracts';
import useAction from 'hooks/useAction';
import useDialogContext from 'hooks/useDialogContext';
import useJurisdiction from 'hooks/useJurisdiction';
import useToasts from 'hooks/useToasts';
import { capitalize } from 'lodash';
import { useEffect, useState } from 'react';
import { getActionIcon } from 'utils/metadata';
import RuleManageDialog from './RuleManageDialog';

/**
 * A component with a table with jurisdiction rules.
 */
export default function RuleTable({ jurisdiction, sx }) {
  const { showDialog, closeDialog } = useDialogContext();
  const { showToastError } = useToasts();
  const { getActions } = useAction();
  const { getJurisdictionRules } = useJurisdiction();
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);

  const columns = [
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 100,
      getActions: (params) => [
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
          key="updateRule"
          icon={<ModeEditOutline />}
          label="Update Rule"
          onClick={() =>
            showDialog(
              <RuleManageDialog
                jurisdiction={jurisdiction}
                rule={params.row.rule}
                onClose={closeDialog}
              />,
            )
          }
        />,
      ],
    },
    {
      field: 'id',
      headerName: 'ID',
      width: 100,
      valueGetter: (params) => `${params.row.rule.ruleId}`,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 500,
      valueGetter: (params) => `${params.row.action.guid}`,
      renderCell: (params) => (
        <Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            {getActionIcon(params.row.action, 28)}
            <Typography>{params.row.action.uriData?.name}</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {params.row.action.guid}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'metadata',
      headerName: 'Metadata',
      width: 600,
      valueGetter: (params) =>
        `${params.row.rule.rule.uriData?.name || 'None'}`,
      renderCell: (params) => (
        <Box>
          <Typography>
            {params.row.rule.rule.uriData?.name || 'None'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • {params.row.rule.rule.uriData?.description || 'None'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • {params.row.rule.rule.uriData?.evidenceDescription || 'None'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'affected',
      headerName: 'Affected',
      width: 200,
      valueGetter: (params) => `${params.row.rule.rule.affected || 'None'}`,
    },
    {
      field: 'negation',
      headerName: 'Negation',
      width: 100,
      valueGetter: (params) =>
        `${params.row.rule.rule.negation.toString() || 'None'}`,
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 140,
      valueGetter: (params) =>
        params.row.rule.isPositive ? 'positive' : 'negative',
      renderCell: (params) => {
        if (params.row.rule.isPositive) {
          return (
            <Typography sx={{ color: 'success.main' }}>Positive</Typography>
          );
        } else {
          return (
            <Typography sx={{ color: 'danger.main' }}>Negative</Typography>
          );
        }
      },
    },
    {
      field: 'effects',
      headerName: 'Effects',
      width: 320,
      valueGetter: (params) => JSON.stringify(params.row.rule.effects),
      renderCell: (params) => (
        <Stack>
          {params.row.rule.effects.map((effect, index) => {
            return (
              <Stack key={index} direction="row" spacing={2}>
                <Typography variant="body2">
                  {capitalize(effect.name)}
                </Typography>
                <Typography variant="body2">|</Typography>
                {effect.direction === REPUTATION_RATING.positive.direction ? (
                  <Typography variant="body2" sx={{ color: 'success.main' }}>
                    Is Positive
                  </Typography>
                ) : (
                  <Typography variant="body2" sx={{ color: 'danger.main' }}>
                    Is Negative
                  </Typography>
                )}
                <Typography variant="body2">|</Typography>
                <Typography variant="body2">Value: {effect.value}</Typography>
              </Stack>
            );
          })}
        </Stack>
      ),
    },
    {
      field: 'ruling',
      headerName: 'Ruling',
      width: 100,
      valueGetter: (params) =>
        `${params.row.rule.confirmation.ruling || 'None'}`,
    },
    {
      field: 'evidence',
      headerName: 'Evidence',
      width: 100,
      valueGetter: (params) =>
        `${params.row.rule.confirmation.evidence.toString() || 'None'}`,
    },
    {
      field: 'witness',
      headerName: 'Witness',
      width: 100,
      valueGetter: (params) =>
        `${params.row.rule.confirmation.witness || 'None'}`,
    },
  ];

  async function loadData() {
    try {
      setRows([]);
      setIsLoading(true);
      const rows = [];
      const rules = await getJurisdictionRules(null, jurisdiction.id);
      const actionGuids = new Set();
      for (const rule of rules) {
        actionGuids.add(rule.rule.about);
      }
      const actions = await getActions(Array.from(actionGuids));
      for (const rule of rules) {
        const action = actions.find(
          (action) => action.guid === rule.rule.about,
        );
        rows.push({ action: action, rule: rule });
      }
      setRows(rows);
    } catch (error) {
      showToastError(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (jurisdiction) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jurisdiction]);

  return (
    <Box sx={{ height: 800, ...sx }}>
      <DataGrid
        loading={isLoading}
        rows={rows}
        columns={columns}
        pageSize={50}
        rowsPerPageOptions={[50]}
        rowHeight={84}
        getRowId={(row) => row.rule.id}
        components={{
          Toolbar: GridToolbar,
        }}
      />
    </Box>
  );
}