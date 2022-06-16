import Layout from 'components/layout/Layout';
import ProfileManage from 'components/profile/ProfileManage';
import ContentProtector from 'components/protector/ContentProtector';
import useWeb3Context from 'hooks/context/useWeb3Context';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

/**
 * Page where account can create profile for another person.
 */
export default function ProfileInvite() {
  const { t } = useTranslation('common');
  const { account } = useWeb3Context();

  return (
    <Layout title={t('page-title-profile-invite')} enableSidebar={!!account}>
      <ContentProtector
        isAccountRequired={true}
        isAccountProfileRequired={true}
      >
        <ProfileManage action="createAnotherProfile" />
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
