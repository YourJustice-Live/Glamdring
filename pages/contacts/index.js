import { Divider, Link, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import Layout from 'components/layout/Layout';
import useWeb3Context from 'hooks/context/useWeb3Context';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

/**
 * A page with a frequently asked questions list.
 */
export default function Faq() {
  const { t } = useTranslation('common');
  const { account } = useWeb3Context();

  return (
    <Layout title={t('page-title-contacts')} enableSidebar={!!account}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h1" gutterBottom>
          {t('page-contacts-headline')}
        </Typography>
        <Divider />
      </Box>
      <Stack spacing={2}>
        {/* Twitter */}
        <Stack direction="row" spacing={1}>
          <Typography>•</Typography>
          <Link
            underline="none"
            href="https://twitter.com/YourJusticeLife"
            target="_blank"
          >
            Twitter
          </Link>
        </Stack>
        {/* Discord */}
        <Stack direction="row" spacing={1}>
          <Typography>•</Typography>
          <Link
            underline="none"
            href="https://discord.com/invite/aKKCCzCfgS"
            target="_blank"
          >
            Discord
          </Link>
        </Stack>
        {/* Telegram en */}
        <Stack direction="row" spacing={1}>
          <Typography>•</Typography>
          <Link
            underline="none"
            href="https://t.me/yourjustworld"
            target="_blank"
          >
            Telegram (EN)
          </Link>
        </Stack>
        {/* Telegram ru */}
        <Stack direction="row" spacing={1}>
          <Typography>•</Typography>
          <Link
            underline="none"
            href="https://t.me/yourjustice_ru"
            target="_blank"
          >
            Telegram (RU)
          </Link>
        </Stack>
        {/* Email */}
        <Stack direction="row" spacing={1}>
          <Typography>•</Typography>
          <Link
            underline="none"
            href="mailto:team@yourjustice.life"
            target="_blank"
          >
            team@yourjustice.life
          </Link>
        </Stack>
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
