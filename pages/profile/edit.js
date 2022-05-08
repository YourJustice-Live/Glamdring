import Layout from 'components/layout/Layout';
import ProfileManage from 'components/profile/ProfileManage';
import useWeb3Context from 'hooks/useWeb3Context';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

/**
 * Page where account can edit own profile.
 */
export default function ProfileEdit() {
  const router = useRouter();
  const { accountProfile } = useWeb3Context();

  useEffect(() => {
    if (!accountProfile) {
      router.push(`/profile/create`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountProfile]);

  return (
    <Layout title={'YourJustice / Edit Own Profile'} enableSidebar={true}>
      <ProfileManage profile={accountProfile} action="editOwnProfile" />
    </Layout>
  );
}
