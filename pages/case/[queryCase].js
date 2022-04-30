import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import CaseComments from 'components/case/CaseComments';
import CaseEvidence from 'components/case/CaseEvidence';
import CaseMeta from 'components/case/CaseMeta';
import CaseParticipants from 'components/case/CaseParticipants';
import CaseJudging from 'components/case/CaseJudging';
import CaseConfirmations from 'components/case/CaseConfirmations';
import LawList from 'components/law/LawList';
import Layout from 'components/layout/Layout';
import useCase from 'hooks/useCase';
import useJurisdiction from 'hooks/useJurisdiction';
import useLaw from 'hooks/useLaw';
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
  const { getJusirsdictionRules } = useJurisdiction();
  const { getLawsByRules } = useLaw();
  const [caseObject, setCaseObject] = useState();
  const [caseLaws, setCaseLaws] = useState(null);

  async function loadData() {
    try {
      const caseObject = await getCase(queryCase);
      const ruleIds = caseObject.rules.map((rule) => rule.id);
      const rules = await getJusirsdictionRules(ruleIds, null, null);
      const laws = await getLawsByRules(rules);
      setCaseObject(caseObject);
      setCaseLaws(laws);
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    if (queryCase) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryCase]);

  return (
    <Layout title={'YourJustice / Case'} enableSidebar={!!account}>
      <Box>
        <Typography variant="h1" gutterBottom>
          Case
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <CaseMeta caseObject={caseObject} />
      </Box>
      <Box sx={{ mt: 12 }}>
        <Typography variant="h1" gutterBottom>
          Laws
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <LawList laws={caseLaws} />
      </Box>
      <Box sx={{ mt: 12 }}>
        <Typography variant="h1" gutterBottom>
          Participants
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <CaseParticipants caseObject={caseObject} />
      </Box>
      <Box sx={{ mt: 12 }}>
        <Typography variant="h1" gutterBottom>
          Evidence
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <CaseEvidence caseObject={caseObject} />
      </Box>
      <Box sx={{ mt: 12 }}>
        <Typography variant="h1" gutterBottom>
          Comments
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <CaseComments caseObject={caseObject} />
      </Box>
      <Box sx={{ mt: 12 }}>
        <Typography variant="h1" gutterBottom>
          Confirmations
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <CaseConfirmations caseObject={caseObject} />
      </Box>
      <Box sx={{ mt: 12, mb: 6 }}>
        <Typography variant="h1" gutterBottom>
          Judging
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <CaseJudging caseObject={caseObject} caseLaws={caseLaws} />
      </Box>
    </Layout>
  );
}
