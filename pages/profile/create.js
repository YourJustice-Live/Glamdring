import Layout from 'components/layout/Layout';
import ProfileManage from 'components/profile/ProfileManage';
import ContentProtector from 'components/protector/ContentProtector';
import useWeb3Context from 'hooks/useWeb3Context';

/**
 * Page where account can create own profile.
 */
export default function ProfileCreate() {
  const { account } = useWeb3Context();

  return (
    <Layout
      title={'YourJustice / Create Own Profile'}
      enableSidebar={!!account}
    >
      <ContentProtector
        isAccountRequired={true}
        isNoAccountProfileRequired={true}
      >
        <ProfileManage action="createOwnProfile" />
      </ContentProtector>
    </Layout>
  );
}
