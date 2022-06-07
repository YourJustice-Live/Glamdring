import CaseDetails from 'components/case/CaseDetails';
import CaseHeader from 'components/case/CaseHeader';
import CaseTabs from 'components/case/CaseTabs';
import LawList from 'components/law/LawList';
import Layout from 'components/layout/Layout';
import useWeb3Context from 'hooks/context/useWeb3Context';
import useCase from 'hooks/useCase';
import useErrors from 'hooks/useErrors';
import useJurisdiction from 'hooks/useJurisdiction';
import useLaw from 'hooks/useLaw';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { palette } from 'theme/palette';

/**
 * Page with case data.
 *
 * TODO: Show "Not Found" message if case is not found.
 */
export default function Case() {
  const { t } = useTranslation('common');
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
      const ruleIds = caseObject?.rules.map((rule) => rule.id);
      const rules = await getJurisdictionRules(ruleIds || [], null, null);
      const laws = await getLawsByRules(rules || []);
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
      title={`${t('page-title-case')} ${queryCase}`}
      enableSidebar={!!account}
      background={
        caseLaws
          ? isLawsPositive(caseLaws)
            ? `linear-gradient(to bottom, ${palette.case.positive}, #FFFFFF)`
            : `linear-gradient(to bottom, ${palette.case.negative}, #FFFFFF)`
          : 'none'
      }
    >
      <CaseHeader caseObject={caseObject} />
      <LawList laws={caseLaws} sx={{ mt: 4 }} />
      <CaseDetails caseObject={caseObject} caseLaws={caseLaws} sx={{ mt: 4 }} />
      <CaseTabs caseObject={caseObject} caseLaws={caseLaws} sx={{ mt: 4 }} />
    </Layout>
  );
}

/**
 * Define localized texts before rendering the page.
 */
export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
