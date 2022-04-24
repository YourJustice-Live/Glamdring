import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import CaseMeta from 'components/case/CaseMeta';
import CaseParticipants from 'components/case/CaseParticipants';
import CasePosts from 'components/case/CasePosts';
import CaseVerdictCancellation from 'components/case/CaseVerdictCancellation';
import LawList from 'components/law/LawList';
import Layout from 'components/layout/Layout';
import useCase from 'hooks/useCase';
import useLaw from 'hooks/useLaw';
import useRule from 'hooks/useRule';
import useToasts from 'hooks/useToasts';
import useWeb3Context from 'hooks/useWeb3Context';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

/**
 * Page with case data.
 */
export default function Case() {
  const router = useRouter();
  const { queryCase } = router.query;
  const { account } = useWeb3Context();
  const { showToastError } = useToasts();
  const { getCase } = useCase();
  const { getRulesByIds } = useRule();
  const { getLawsByRules } = useLaw();
  const [caseObject, setCaseObject] = useState();
  const [caseLaws, setCaseLaws] = useState(null);

  async function loadData() {
    try {
      const caseObject = await getCase(queryCase.toLowerCase());
      const ruleIds = caseObject.rules.map((rule) => rule.id);
      const rules = await getRulesByIds(ruleIds);
      const laws = await getLawsByRules(rules);
      setCaseObject(caseObject);
      setCaseLaws(laws);
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryCase]);

  return (
    <Layout title={'YourJustice / Case'} showAccountNavigation={!!account}>
      <Box>
        <Typography variant="h1" gutterBottom>
          Case
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <CaseMeta caseObject={caseObject} />
      </Box>
      <Box sx={{ mt: 12 }}>
        <Typography variant="h1" gutterBottom>
          Case Laws
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <LawList laws={caseLaws} />
      </Box>
      <Box sx={{ mt: 12 }}>
        <Typography variant="h1" gutterBottom>
          Case Participants
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <CaseParticipants caseObject={caseObject} />
      </Box>
      <Box sx={{ mt: 12 }}>
        <Typography variant="h1" gutterBottom>
          Case Posts
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <CasePosts caseObject={caseObject} />
      </Box>
      <Box sx={{ mt: 12, mb: 6 }}>
        <Typography variant="h1" gutterBottom>
          Case Verdict or Cancellation
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <CaseVerdictCancellation caseObject={caseObject} caseLaws={caseLaws} />
      </Box>
    </Layout>
  );
}
