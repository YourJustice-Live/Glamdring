import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import CaseEventList from 'components/case/CaseEventList';
import Layout from 'components/layout/Layout';
import useCase from 'hooks/useCase';
import useToasts from 'hooks/useToasts';
import useWeb3Context from 'hooks/useWeb3Context';
import { useEffect, useState } from 'react';

/**
 * Page with events for current profile.
 */
export default function Events() {
  const { account } = useWeb3Context();
  const { showToastError } = useToasts();
  const { getCases, getCaseEvents } = useCase();
  const [caseEvents, setCaseEvents] = useState(null);

  async function loadData() {
    try {
      const cases = await getCases(
        null,
        process.env.NEXT_PUBLIC_JURISDICTION_CONTRACT_ADDRESS,
        null,
        account,
        100,
        0,
      );
      const caseIds = cases.map((caseObject) => caseObject.id);
      const caseEvents = await getCaseEvents(caseIds);
      setCaseEvents(caseEvents);
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout title={'YourJustice / Events'} enableSidebar={!!account}>
      <Box>
        <Typography variant="h1" gutterBottom>
          Events
        </Typography>
        <Divider />
      </Box>
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom>
          Recent events that happened in your cases
        </Typography>
        <Divider />
        <CaseEventList caseEvents={caseEvents} sx={{ mt: 2.5 }} />
      </Box>
    </Layout>
  );
}
