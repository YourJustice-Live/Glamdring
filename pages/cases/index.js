import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Badge, Box, Button, Tab, Typography } from '@mui/material';
import CaseCreateDialog from 'components/case/CaseCreateDialog';
import CaseListObserver from 'components/case/CaseListObserver';
import Layout from 'components/layout/Layout';
import { CASE_STAGE } from 'constants/contracts';
import useDataContext from 'hooks/context/useDataContext';
import useDialogContext from 'hooks/context/useDialogContext';
import useWeb3Context from 'hooks/context/useWeb3Context';
import { IconHammer1, IconPlus } from 'icons/core';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import { palette } from 'theme/palette';

/**
 * Page with list of all cases.
 */
export default function Cases() {
  const { t } = useTranslation('common');
  const { account } = useWeb3Context();
  const {
    accountProfile,
    accountProfileIsJudgeJurisdictions,
    isAccountProfileHasOpenCasesCreatedByHim,
    isAccountProfileHasOpenCasesAgainstHim,
    isAccountProfileHasAwaitingConfirmationCases,
    isAccountProfileHasAwaitingJudgingCases,
  } = useDataContext();
  const { showDialog, closeDialog } = useDialogContext();
  const [tabValue, setTabValue] = useState('1');

  function handleChange(_, newTabValue) {
    setTabValue(newTabValue);
  }

  return (
    <Layout title={t('page-title-cases')} enableSidebar={!!account}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconHammer1 color={palette.text.primary} width="18" heigth="18" />
          <Typography variant="h3" sx={{ ml: 1 }}>
            {t('text-cases')}
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
            {t('button-create')}
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
              {/* Tab for All */}
              <Tab label={t('text-all')} value="1" />
              {/* Tab for Created by me */}
              <Tab
                label={
                  <Badge
                    color="danger"
                    badgeContent={
                      isAccountProfileHasOpenCasesCreatedByHim ? 1 : 0
                    }
                    variant="dot"
                    sx={{ '& .MuiBadge-badge': { top: '0px', right: '-10px' } }}
                  >
                    {t('text-created-by-me')}
                  </Badge>
                }
                sx={{ px: 3 }}
                value="2"
              />
              {/* Tab for Against me */}
              <Tab
                label={
                  <Badge
                    color="danger"
                    badgeContent={
                      isAccountProfileHasOpenCasesAgainstHim ? 1 : 0
                    }
                    variant="dot"
                    sx={{ '& .MuiBadge-badge': { top: '0px', right: '-10px' } }}
                  >
                    {t('text-against-me')}
                  </Badge>
                }
                sx={{ px: 3 }}
                value="3"
              />
              {/* Tab for Awaiting my confirmation */}
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
                    {t('text-my-awaiting-confirmation')}
                  </Badge>
                }
                sx={{ px: 3 }}
                value="4"
              />
              {/* Tab for Awaiting my judging */}
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
                    {t('text-my-awaiting-judging')}
                  </Badge>
                }
                sx={{ px: 3 }}
                value="5"
              />
            </TabList>
            {/* Tab panel for All */}
            <TabPanel value="1" sx={{ px: 0 }}>
              <CaseListObserver />
            </TabPanel>
            {/* Tab panel for Created by me */}
            <TabPanel value="2" sx={{ px: 0 }}>
              <CaseListObserver
                isFilterButtonHidden={true}
                filters={{
                  stageId: CASE_STAGE.open,
                  adminProfileId: accountProfile.id,
                }}
              />
            </TabPanel>
            {/* Tab panel for Against me */}
            <TabPanel value="3" sx={{ px: 0 }}>
              <CaseListObserver
                isFilterButtonHidden={true}
                filters={{
                  stageId: CASE_STAGE.open,
                  subjectProfileId: accountProfile.id,
                }}
              />
            </TabPanel>
            {/* Tab for Awaiting my confirmation */}
            <TabPanel value="4" sx={{ px: 0 }}>
              <CaseListObserver
                isFilterButtonHidden={true}
                filters={{
                  stageId: CASE_STAGE.open,
                  witnessProfileId: accountProfile.id,
                  participantWithoutConfirmationPostProfileId:
                    accountProfile.id,
                }}
              />
            </TabPanel>
            {/* Tab for Awaiting my judging */}
            <TabPanel value="5" sx={{ px: 0 }}>
              <CaseListObserver
                isFilterButtonHidden={true}
                filters={{
                  stageIds: [CASE_STAGE.open, CASE_STAGE.verdict],
                  jurisdictionAddresses:
                    accountProfileIsJudgeJurisdictions?.length > 0
                      ? accountProfileIsJudgeJurisdictions.map((j) => j.id)
                      : [],
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

/**
 * Define localized texts at build time.
 */
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
