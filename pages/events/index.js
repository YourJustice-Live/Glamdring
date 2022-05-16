import { Divider, Typography } from '@mui/material';
import CaseEventList from 'components/case/CaseEventList';
import Layout from 'components/layout/Layout';
import ContentProtector from 'components/protector/ContentProtector';
import useCase from 'hooks/useCase';
import useToasts from 'hooks/useToasts';
import useWeb3Context from 'hooks/useWeb3Context';
import { useEffect, useState } from 'react';

/**
 * Page with events for current profile.
 *
 * TODO: Optimize function to load events.
 */
export default function Events() {
  const { account } = useWeb3Context();
  const { showToastError } = useToasts();
  const { getCases, getCaseEvents } = useCase();
  const [caseEvents, setCaseEvents] = useState(null);

  async function loadData() {
    try {
      const cases = await getCases({
        participant: account,
        first: 100,
        skip: 0,
      });
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
      <ContentProtector
        isAccountRequired={true}
        isAccountProfileRequired={true}
      >
        <Typography variant="h1" gutterBottom>
          Events
        </Typography>
        <Typography gutterBottom>
          Recent events that happened in cases in which you are a participant
        </Typography>
        <Divider />
        <CaseEventList caseEvents={caseEvents} sx={{ mt: 4 }} />
      </ContentProtector>
    </Layout>
  );
}
