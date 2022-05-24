import Layout from 'components/layout/Layout';
import ProfileManage from 'components/profile/ProfileManage';
import ContentProtector from 'components/protector/ContentProtector';
import useDataContext from 'hooks/context/useDataContext';
import useWeb3Context from 'hooks/context/useWeb3Context';

/**
 * Page where account can edit own profile.
 */
export default function ProfileEdit() {
  const { account } = useWeb3Context();
  const { accountProfile } = useDataContext();

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
