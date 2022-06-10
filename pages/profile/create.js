import Layout from 'components/layout/Layout';
import ProfileManage from 'components/profile/ProfileManage';
import ContentProtector from 'components/protector/ContentProtector';
import useWeb3Context from 'hooks/context/useWeb3Context';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

/**
 * Page where account can create own profile.
 */
export default function ProfileCreate() {
  const { account } = useWeb3Context();
  const { t } = useTranslation('common');

  return (
    <Layout
      title={t('page-title-profile-create-own')}
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
