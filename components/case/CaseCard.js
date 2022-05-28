import { Card, CardContent } from '@mui/material';
import LawList from 'components/law/LawList';
import useJurisdiction from 'hooks/useJurisdiction';
import useLaw from 'hooks/useLaw';
import { useEffect, useState } from 'react';
import { palette } from 'theme/palette';
import CaseDetails from './CaseDetails';
import CaseTabs from './CaseTabs';
import CaseHeader from './CaseHeader';

/**
 * A component with a card with case.
 */
export default function CaseCard({ caseObject }) {
  const { getJurisdictionRules } = useJurisdiction();
  const { getLawsByRules, isLawsPositive } = useLaw();
  const [caseLaws, setCaseLaws] = useState(null);

  async function getLawsByCase(caseObject) {
    let laws;
    if (caseObject?.rules) {
      const ruleIds = caseObject.rules.map((rule) => rule.id);
      const rules = await getJurisdictionRules(ruleIds, null, null);
      laws = await getLawsByRules(rules);
    }
    return laws;
  }

  useEffect(() => {
    let isComponentActive = true;
    getLawsByCase(caseObject).then((laws) => {
      if (isComponentActive) {
        setCaseLaws(laws);
      }
    });
    return () => {
      isComponentActive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseObject]);

  return (
    <Card
      elevation={1}
      sx={{
        background: caseLaws
          ? isLawsPositive(caseLaws)
            ? `linear-gradient(to bottom, ${palette.case.positive}, #FFFFFF)`
            : `linear-gradient(to bottom, ${palette.case.negative}, #FFFFFF)`
          : 'none',
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <CaseHeader caseObject={caseObject} />
        <LawList laws={caseLaws} sx={{ mt: 3 }} />
        <CaseDetails
          caseObject={caseObject}
          caseLaws={caseLaws}
          sx={{ mt: 3 }}
        />
        <CaseTabs caseObject={caseObject} caseLaws={caseLaws} sx={{ mt: 3 }} />
      </CardContent>
    </Card>
  );
}
