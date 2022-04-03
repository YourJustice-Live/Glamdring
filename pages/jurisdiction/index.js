import JurisdictionCases from 'components/jurisdiction/JurisdictionCases';
import JurisdictionCaseCreator from 'components/jurisdiction/JurisdictionCaseCreator';
import JurisdictionMembers from 'components/jurisdiction/JurisdictionMembers';
import JurisdictionMeta from 'components/jurisdiction/JurisdictionMeta';
import JurisdictionOfficials from 'components/jurisdiction/JurisdictionOfficials';
import JurisdictionRules from 'components/jurisdiction/JurisdictionRules';
import Layout from 'components/layout/Layout';
import useWeb3Context from 'hooks/useWeb3Context';

/**
 * Page with the jurisdiction.
 */
export default function Jurisdiction() {
  const { account } = useWeb3Context();

  return (
    <Layout
      title={'YourJustice / Jurisdiction'}
      showAccountNavigation={!!account}
    >
      <JurisdictionMeta />
      <JurisdictionCaseCreator />
      <JurisdictionCases />
      <JurisdictionOfficials />
      <JurisdictionMembers />
      <JurisdictionRules />
    </Layout>
  );
}
