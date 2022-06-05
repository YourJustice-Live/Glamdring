import { Construction } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Layout from 'components/layout/Layout';
import ProfileManage from 'components/profile/ProfileManage';
import ContentProtector from 'components/protector/ContentProtector';
import { IS_PROFILE_INVITING_DISABLED } from 'constants/features';
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
        {IS_PROFILE_INVITING_DISABLED ? (
          <Box>
            <Typography variant="h1" gutterBottom>
              {t('text-feature-is-under-development')}
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mt: 1 }}
            >
              <Construction fontSize="small" />
              <Typography>{t('text-feature-inviting-coming-soon')}</Typography>
            </Stack>
          </Box>
        ) : (
          <ProfileManage action="createAnotherProfile" />
        )}
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
