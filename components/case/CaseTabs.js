import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Tab } from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import CaseComments from './CaseComments';
import CaseConfirmations from './CaseConfirmations';
import CaseEvidence from './CaseEvidence';
import CaseJudging from './CaseJudging';

/**
 * A component with a case tabs (comments, confirmations, judging).
 */
export default function CaseTabs({ caseObject, caseLaws, sx }) {
  const { t } = useTranslation('common');
  const [tabValue, setTabValue] = useState('1');

  function handleChange(_, newTabValue) {
    setTabValue(newTabValue);
  }

  if (caseObject && caseLaws) {
    return (
      <Box sx={{ ...sx }}>
        <TabContext value={tabValue}>
          <TabList
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              mb: 0,
              maxWidth: 'calc(100vw - 96px)',
            }}
          >
            <Tab label={t('text-evidence')} value="1" />
            <Tab label={t('text-comments')} value="2" />
            <Tab label={t('text-confirmations')} value="3" />
            <Tab label={t('text-judging')} value="4" />
          </TabList>
          <TabPanel value="1" sx={{ px: { xs: 0, md: '24px' } }}>
            <CaseEvidence caseObject={caseObject} />
          </TabPanel>
          <TabPanel value="2" sx={{ px: { xs: 0, md: '24px' } }}>
            <CaseComments caseObject={caseObject} />
          </TabPanel>
          <TabPanel value="3" sx={{ px: { xs: 0, md: '24px' } }}>
            <CaseConfirmations caseObject={caseObject} />
          </TabPanel>
          <TabPanel value="4" sx={{ px: { xs: 0, md: '24px' } }}>
            <CaseJudging caseObject={caseObject} caseLaws={caseLaws} />
          </TabPanel>
        </TabContext>
      </Box>
    );
  }

  return <></>;
}
