import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  Link,
  Typography,
} from '@mui/material';
import ActionManageDialog from 'components/law/ActionManageDialog';
import ActionTable from 'components/law/ActionTable';
import RuleManageDialog from 'components/law/RuleManageDialog';
import RuleTable from 'components/law/RuleTable';
import Layout from 'components/layout/Layout';
import useDialogContext from 'hooks/context/useDialogContext';
import useErrors from 'hooks/useErrors';
import useJurisdiction from 'hooks/useJurisdiction';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

/**
 * Page for manage jurisdiction laws.
 */
export default function JurisdictionLawsManage() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { queryJurisdiction } = router.query;
  const { showDialog, closeDialog } = useDialogContext();
  const { handleError } = useErrors();
  const { getJurisdiction } = useJurisdiction();
  const [jurisdiction, setJurisdiction] = useState(null);

  async function loadData() {
    try {
      setJurisdiction(await getJurisdiction(queryJurisdiction));
    } catch (error) {
      handleError(error, true);
    }
  }

  useEffect(() => {
    if (queryJurisdiction) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryJurisdiction]);

  return (
    <Layout title={t('page-title-jurisdiction-laws-manage')} maxWidth="xl">
      {jurisdiction && (
        <Box>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 6 }}>
            <NextLink href={`/jurisdiction/${queryJurisdiction}`} passHref>
              <Link underline="none" color="inherit">
                {jurisdiction.name || t('text-jurisdiction')}
              </Link>
            </NextLink>
            <Typography color="text.primary">
              {t('text-laws-manager')}
            </Typography>
          </Breadcrumbs>
          {/* Rules */}
          <Box>
            <Typography variant="h2" gutterBottom>
              {t('jurisdiction-laws-manage-page-rules-headline')}
            </Typography>
            <Typography gutterBottom>
              {t('jurisdiction-laws-manage-page-rules-supporting-headline')}
            </Typography>
            <Divider />
            <Button
              variant="outlined"
              onClick={() =>
                showDialog(
                  <RuleManageDialog
                    jurisdiction={jurisdiction}
                    onClose={closeDialog}
                  />,
                )
              }
              sx={{ mt: 2.5 }}
            >
              {t('button-add-rule')}
            </Button>
            <RuleTable jurisdiction={jurisdiction} sx={{ mt: 2.5 }} />
          </Box>
          {/* Actions */}
          <Box sx={{ mt: 12 }}>
            <Typography variant="h2" gutterBottom>
              {t('jurisdiction-laws-manage-page-actions-headline')}
            </Typography>
            <Typography gutterBottom>
              {t('jurisdiction-laws-manage-page-actions-supporting-headline')}
            </Typography>
            <Divider />
            <Button
              variant="outlined"
              onClick={() =>
                showDialog(<ActionManageDialog onClose={closeDialog} />)
              }
              sx={{ mt: 2.5 }}
            >
              {t('button-add-action')}
            </Button>
            <ActionTable sx={{ mt: 2.5 }} />
          </Box>
        </Box>
      )}
    </Layout>
  );
}

/**
 * Define localized texts before rendering the page.
 */
export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
