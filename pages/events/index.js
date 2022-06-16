import { Divider, Typography } from '@mui/material';
import CaseEventList from 'components/case/CaseEventList';
import Layout from 'components/layout/Layout';
import ContentProtector from 'components/protector/ContentProtector';
import useDataContext from 'hooks/context/useDataContext';
import useWeb3Context from 'hooks/context/useWeb3Context';
import useCase from 'hooks/useCase';
import useErrors from 'hooks/useErrors';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect, useState } from 'react';

/**
 * Page with events for current profile.
 *
 * TODO: Optimize function to load events.
 */
export default function Events() {
  const { t } = useTranslation('common');
  const { account } = useWeb3Context();
  const { accountProfile } = useDataContext();
  const { handleError } = useErrors();
  const { getCases, getCaseEvents } = useCase();
  const [caseEvents, setCaseEvents] = useState(null);

  async function loadData() {
    try {
      const cases = await getCases({
        participant: accountProfile.id,
        first: 100,
        skip: 0,
      });
      const caseIds = cases.map((caseObject) => caseObject.id);
      const caseEvents = await getCaseEvents(caseIds);
      setCaseEvents(caseEvents);
    } catch (error) {
      handleError(error, true);
    }
  }

  useEffect(() => {
    if (accountProfile) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountProfile]);

  return (
    <Layout title={t('page-title-events')} enableSidebar={!!account}>
      <ContentProtector
        isAccountRequired={true}
        isAccountProfileRequired={true}
      >
        <Typography variant="h1" gutterBottom>
          {t('page-events-headline')}
        </Typography>
        <Typography gutterBottom>
          {t('page-events-supporting-headline')}
        </Typography>
        <Divider />
        <CaseEventList caseEvents={caseEvents} sx={{ mt: 4 }} />
      </ContentProtector>
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
