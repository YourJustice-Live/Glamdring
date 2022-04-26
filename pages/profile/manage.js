import Layout from 'components/layout/Layout';
import ProfileManageComponent from 'components/profile/ProfileManage';

/**
 * Page where account can create (mint) or edit profile (Avatar NFT).
 */
export default function ProfileManage() {
  return (
    <Layout title={'YourJustice / Profile Manage'} enableSidebar={true}>
      <ProfileManageComponent />
    </Layout>
  );
}
