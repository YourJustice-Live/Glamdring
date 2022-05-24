import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Badge, Box, Button, Tab, Typography } from '@mui/material';
import CaseCreateDialog from 'components/case/CaseCreateDialog';
import CaseListObserver from 'components/case/CaseListObserver';
import Layout from 'components/layout/Layout';
import { CASE_STAGE } from 'constants/contracts';
import useDataContext from 'hooks/context/useDataContext';
import useDialogContext from 'hooks/context/useDialogContext';
import useWeb3Context from 'hooks/context/useWeb3Context';
import { IconHammer, IconPlus } from 'icons';
import { useState } from 'react';
import { palette } from 'theme/palette';

/**
 * Page with list of all cases.
 */
export default function Cases() {
  const { account } = useWeb3Context();
  const {
    accountProfile,
    isAccountProfileHasAwaitingConfirmationCases,
    isAccountProfileHasAwaitingJudgingCases,
  } = useDataContext();
  const { showDialog, closeDialog } = useDialogContext();
  const [tabValue, setTabValue] = useState('1');

  function handleChange(_, newTabValue) {
    setTabValue(newTabValue);
  }

  return (
    <Layout title={'YourJustice / Cases'} enableSidebar={!!account}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconHammer size={24} hexColor={palette.text.primary} />
          <Typography variant="h3" sx={{ ml: 1 }}>
            Cases
          </Typography>
        </Box>
        {accountProfile && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<IconPlus />}
            sx={{ px: 2 }}
            onClick={() =>
              showDialog(<CaseCreateDialog onClose={closeDialog} />)
            }
          >
            Create
          </Button>
        )}
      </Box>
      {accountProfile ? (
        <Box sx={{ width: '100%', mt: 2 }}>
          <TabContext value={tabValue}>
            <TabList
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                mb: 1,
                maxWidth: 'calc(100vw - 32px)',
              }}
            >
              <Tab label="All" value="1" />
              <Tab
                label={
                  <Badge
                    color="danger"
                    badgeContent={
                      isAccountProfileHasAwaitingConfirmationCases ? 1 : 0
                    }
                    variant="dot"
                    sx={{ '& .MuiBadge-badge': { top: '0px', right: '-10px' } }}
                  >
                    Awaiting My Confirmation
                  </Badge>
                }
                sx={{ px: 4 }}
                value="2"
              />
              <Tab
                label={
                  <Badge
                    color="danger"
                    badgeContent={
                      isAccountProfileHasAwaitingJudgingCases ? 1 : 0
                    }
                    variant="dot"
                    sx={{ '& .MuiBadge-badge': { top: '0px', right: '-10px' } }}
                  >
                    Awaiting My Judging
                  </Badge>
                }
                sx={{ px: 4 }}
                value="3"
              />
            </TabList>
            <TabPanel value="1" sx={{ px: 0 }}>
              <CaseListObserver />
            </TabPanel>
            <TabPanel value="2" sx={{ px: 0 }}>
              <CaseListObserver
                isFilterButtonHidden={true}
                filters={{
                  stageId: CASE_STAGE.open,
                  witnessProfileAccount: account,
                  accountWithoutConfirmationPost: account,
                }}
              />
            </TabPanel>
            <TabPanel value="3" sx={{ px: 0 }}>
              <CaseListObserver
                isFilterButtonHidden={true}
                filters={{
                  stageId: CASE_STAGE.verdict,
                  judgeProfileAccount: account,
                }}
              />
            </TabPanel>
          </TabContext>
        </Box>
      ) : (
        <CaseListObserver sx={{ mt: 3 }} />
      )}
    </Layout>
  );
}
