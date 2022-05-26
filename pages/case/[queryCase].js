import CaseDetails from 'components/case/CaseDetails';
import CaseTabs from 'components/case/CaseTabs';
import CaseTop from 'components/case/CaseTop';
import LawList from 'components/law/LawList';
import Layout from 'components/layout/Layout';
import useWeb3Context from 'hooks/context/useWeb3Context';
import useCase from 'hooks/useCase';
import useErrors from 'hooks/useErrors';
import useJurisdiction from 'hooks/useJurisdiction';
import useLaw from 'hooks/useLaw';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { palette } from 'theme/palette';

/**
 * Page with case data.
 */
export default function Case() {
  const router = useRouter();
  const { queryCase } = router.query;
  const { account } = useWeb3Context();
  const { handleError } = useErrors();
  const { getCase } = useCase();
  const { getJurisdictionRules } = useJurisdiction();
  const { getLawsByRules, isLawsPositive } = useLaw();
  const [caseObject, setCaseObject] = useState();
  const [caseLaws, setCaseLaws] = useState(null);

  async function loadData() {
    try {
      const caseObject = await getCase(queryCase);
      const ruleIds = caseObject.rules.map((rule) => rule.id);
      const rules = await getJurisdictionRules(ruleIds, null, null);
      const laws = await getLawsByRules(rules);
      setCaseObject(caseObject);
      setCaseLaws(laws);
    } catch (error) {
      handleError(error, true);
    }
  }

  useEffect(() => {
    if (queryCase) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryCase]);

  return (
    <Layout
      title={'YourJustice / Case'}
      enableSidebar={!!account}
      background={
        caseLaws
          ? isLawsPositive(caseLaws)
            ? `linear-gradient(to bottom, ${palette.case.positive}, #FFFFFF)`
            : `linear-gradient(to bottom, ${palette.case.negative}, #FFFFFF)`
          : 'none'
      }
    >
      <CaseTop caseObject={caseObject} />
      <LawList laws={caseLaws} sx={{ mt: 4 }} />
      <CaseDetails caseObject={caseObject} caseLaws={caseLaws} sx={{ mt: 4 }} />
      <CaseTabs caseObject={caseObject} caseLaws={caseLaws} sx={{ mt: 4 }} />
    </Layout>
  );
}
