import { Button, Stack, Typography } from '@mui/material';
import Layout from 'components/layout/Layout';
import useWeb3Context from 'hooks/context/useWeb3Context';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

/**
 * Page for sandbox.
 */
export default function Sandbox() {
  const { t } = useTranslation('common');
  const { account } = useWeb3Context();

  async function play() {
    console.log('[Dev] Play start');
    console.log('[Dev] Play complete');
  }

  return (
    <Layout title={t('page-title-sandbox')} enableSidebar={!!account}>
      <Stack spacing={2}>
        <Typography>{t('sandbox-page-headline')}</Typography>
        <Button variant="contained" onClick={play}>
          {t('button-play')}
        </Button>
      </Stack>
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
