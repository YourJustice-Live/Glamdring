import Layout from 'components/layout/Layout';
import ProfileManage from 'components/profile/ProfileManage';
import useWeb3Context from 'hooks/useWeb3Context';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

/**
 * Page where account can create own profile.
 */
export default function ProfileCreate() {
  const router = useRouter();
  const { accountProfile } = useWeb3Context();

  useEffect(() => {
    if (accountProfile) {
      router.push(`/profile/edit`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountProfile]);

  return (
    <Layout title={'YourJustice / Create Own Profile'} enableSidebar={true}>
      <ProfileManage action="createOwnProfile" />
    </Layout>
  );
}
