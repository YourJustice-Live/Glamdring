import Layout from 'components/layout/Layout';
import ProfileManage from 'components/profile/ProfileManage';
import ContentProtector from 'components/protector/ContentProtector';
import useDataContext from 'hooks/context/useDataContext';
import useWeb3Context from 'hooks/context/useWeb3Context';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

/**
 * Page where account can edit own profile.
 */
export default function ProfileEdit() {
  const { t } = useTranslation('common');
  const { account } = useWeb3Context();
  const { accountProfile } = useDataContext();

  return (
    <Layout title={t('page-title-profile-edit-own')} enableSidebar={!!account}>
      <ContentProtector
        isAccountRequired={true}
        isAccountProfileRequired={true}
      >
        <ProfileManage profile={accountProfile} action="editOwnProfile" />
      </ContentProtector>
    </Layout>
  );
}

/**
 * Define localized texts at build time.
 */
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
