import Layout from 'components/layout/Layout';
import ProfileManage from 'components/profile/ProfileManage';
import ContentProtector from 'components/protector/ContentProtector';
import useWeb3Context from 'hooks/useWeb3Context';

/**
 * Page where account can edit own profile.
 */
export default function ProfileEdit() {
  const { account, accountProfile } = useWeb3Context();

  return (
    <Layout title={'YourJustice / Edit Own Profile'} enableSidebar={!!account}>
      <ContentProtector
        isAccountRequired={true}
        isAccountProfileRequired={true}
      >
        <ProfileManage profile={accountProfile} action="editOwnProfile" />
      </ContentProtector>
    </Layout>
  );
}
