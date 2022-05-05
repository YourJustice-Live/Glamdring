import Layout from 'components/layout/Layout';
import ProfileManage from 'components/profile/ProfileManage';

/**
 * Page where account can create profile for another person.
 */
export default function ProfileCreate() {
  return (
    <Layout title={'YourJustice / Invite Person'} enableSidebar={true}>
      <ProfileManage action="createAnotherProfile" />
    </Layout>
  );
}
