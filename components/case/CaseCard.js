import { Card, CardContent, Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import LawList from 'components/law/LawList';
import useJurisdiction from 'hooks/useJurisdiction';
import useLaw from 'hooks/useLaw';
import { useEffect, useState } from 'react';
import CaseComments from './CaseComments';
import CaseConfirmations from './CaseConfirmations';
import CaseEvidence from './CaseEvidence';
import CaseMeta from './CaseMeta';
import CaseParticipants from './CaseParticipants';
import CaseJudging from './CaseJudging';

/**
 * A component with a card with case.
 */
export default function CaseCard({ caseObject }) {
  const { getJusirsdictionRules } = useJurisdiction();
  const { getLawsByRules } = useLaw();
  const [caseLaws, setCaseLaws] = useState(null);

  async function loadData() {
    const ruleIds = caseObject.rules.map((rule) => rule.id);
    const rules = await getJusirsdictionRules(ruleIds, null, null);
    const laws = await getLawsByRules(rules);
    setCaseLaws(laws);
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseObject]);

  return (
    <Card elevation={1}>
      <CardContent sx={{ p: 4 }}>
        <CaseMeta caseObject={caseObject} />
        <Box sx={{ mt: 6 }}>
          <Typography variant="h3" gutterBottom>
            Laws
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <LawList laws={caseLaws} />
        </Box>
        <Box sx={{ mt: 6 }}>
          <Typography variant="h3" gutterBottom>
            Participants
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <CaseParticipants caseObject={caseObject} />
        </Box>
        <Box sx={{ mt: 6 }}>
          <Typography variant="h3" gutterBottom>
            Evidence
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <CaseEvidence caseObject={caseObject} />
        </Box>
        <Box sx={{ mt: 6 }}>
          <Typography variant="h3" gutterBottom>
            Comments
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <CaseComments caseObject={caseObject} />
        </Box>
        <Box sx={{ mt: 6 }}>
          <Typography variant="h3" gutterBottom>
            Confirmations
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <CaseConfirmations caseObject={caseObject} />
        </Box>
        <Box sx={{ mt: 6, mb: 3 }}>
          <Typography variant="h3" gutterBottom>
            Judging
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <CaseJudging caseObject={caseObject} caseLaws={caseLaws} />
        </Box>
      </CardContent>
    </Card>
  );
}
