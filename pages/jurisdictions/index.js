import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Button, Tab, Typography } from '@mui/material';
import JurisdictionListObserver from 'components/jurisdiction/JurisdictionListObserver';
import JurisdictionManageDialog from 'components/jurisdiction/JurisdictionManageDialog';
import Layout from 'components/layout/Layout';
import useDataContext from 'hooks/context/useDataContext';
import useDialogContext from 'hooks/context/useDialogContext';
import useWeb3Context from 'hooks/context/useWeb3Context';
import { IconPassport, IconPlus } from 'icons/core';
import { useState } from 'react';
import { palette } from 'theme/palette';

/**
 * Page with list of all jurisdictions.
 */
export default function Jurisdictions() {
  const { account } = useWeb3Context();
  const { accountProfile } = useDataContext();
  const { showDialog, closeDialog } = useDialogContext();
  const [tabValue, setTabValue] = useState('1');

  function handleChange(_, newTabValue) {
    setTabValue(newTabValue);
  }

  return (
    <Layout title={'YourJustice / Jurisdictions'} enableSidebar={!!account}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconPassport color={palette.text.primary} width="24" height="24" />
          <Typography variant="h3" sx={{ ml: 1 }}>
            Jurisdictions
          </Typography>
        </Box>
        {accountProfile && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<IconPlus />}
            sx={{ px: 2 }}
            onClick={() =>
              showDialog(<JurisdictionManageDialog onClose={closeDialog} />)
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
              <Tab label="My Citizenship" value="2" />
              <Tab label="My Judging" value="3" />
              <Tab label="My Administration" value="4" />
            </TabList>
            <TabPanel value="1" sx={{ px: 0 }}>
              <JurisdictionListObserver />
            </TabPanel>
            <TabPanel value="2" sx={{ px: 0 }}>
              <JurisdictionListObserver
                isFilterButtonHidden={true}
                filters={{
                  memberProfileId: accountProfile.id,
                }}
              />
            </TabPanel>
            <TabPanel value="3" sx={{ px: 0 }}>
              <JurisdictionListObserver
                isFilterButtonHidden={true}
                filters={{
                  judgeProfileId: accountProfile.id,
                }}
              />
            </TabPanel>
            <TabPanel value="4" sx={{ px: 0 }}>
              <JurisdictionListObserver
                isFilterButtonHidden={true}
                filters={{
                  adminProfileId: accountProfile.id,
                }}
              />
            </TabPanel>
          </TabContext>
        </Box>
      ) : (
        <JurisdictionListObserver sx={{ mt: 3 }} />
      )}
    </Layout>
  );
}
