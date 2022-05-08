import ActionRuleBackend from 'components/backend/ActionRuleBackend';
import RoleBackend from 'components/backend/RoleBackend';
import Layout from 'components/layout/Layout';
import useWeb3Context from 'hooks/useWeb3Context';

/**
 * Page with backend features.
 */
export default function Backend() {
  const { account } = useWeb3Context();

  return (
    <Layout title={'YourJustice / Backend'} enableSidebar={!!account}>
      <RoleBackend sx={{ mt: 12 }} />
      <ActionRuleBackend sx={{ mt: 12 }} />
    </Layout>
  );
}
