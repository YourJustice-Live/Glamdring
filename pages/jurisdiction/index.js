import Cases from 'components/jurisdiction/Cases';
import Members from 'components/jurisdiction/Members';
import Meta from 'components/jurisdiction/Meta';
import Officials from 'components/jurisdiction/Officials';
import Rules from 'components/jurisdiction/Rules';
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
      <Meta />
      <Cases />
      <Officials />
      <Members />
      <Rules />
    </Layout>
  );
}
