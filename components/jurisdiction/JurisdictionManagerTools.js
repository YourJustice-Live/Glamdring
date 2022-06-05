import { Alert, Button, Stack, Typography } from '@mui/material';
import RoleManageDialog from 'components/jurisdiction/JurisdictionRoleManageDialog';
import useDialogContext from 'hooks/context/useDialogContext';
import useWeb3Context from 'hooks/context/useWeb3Context';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { palette } from 'theme/palette';
import JurisdictionManageDialog from './JurisdictionManageDialog';

/**
 * A component with jurisdiction manager tools.
 */
export default function JurisdictionManagerTools({ jurisdiction, sx }) {
  const { t } = useTranslation('common');
  const { account } = useWeb3Context();
  const { showDialog, closeDialog } = useDialogContext();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const isJurisdictionMain =
    jurisdiction?.id?.toLowerCase() ===
    process.env.NEXT_PUBLIC_MAIN_JURISDICTION_CONTRACT_ADDRESS.toLowerCase();

  if (account && jurisdiction && isVisible) {
    return (
      <Alert
        severity="info"
        icon={false}
        sx={{ p: 3, background: palette.grey[50], boxShadow: 'none', ...sx }}
        onClose={() => setIsVisible(false)}
      >
        <Typography variant="h4" gutterBottom>
          {t('alert-manager-tools-title')}
        </Typography>
        <Typography gutterBottom>
          {t('alert-manager-tools-description')}
        </Typography>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ mt: 2 }}
        >
          {!isJurisdictionMain && (
            <Button
              variant="outlined"
              type="submit"
              onClick={() =>
                showDialog(
                  <JurisdictionManageDialog
                    jurisdiction={jurisdiction}
                    onClose={closeDialog}
                  />,
                )
              }
            >
              {t('button-update-jurisdiction')}
            </Button>
          )}
          <Button
            variant="outlined"
            type="submit"
            onClick={() =>
              showDialog(
                <RoleManageDialog
                  jurisdiction={jurisdiction}
                  isAssign={true}
                  onClose={closeDialog}
                />,
              )
            }
          >
            {t('button-assign-role')}
          </Button>
          <Button
            variant="outlined"
            type="submit"
            onClick={() =>
              showDialog(
                <RoleManageDialog
                  jurisdiction={jurisdiction}
                  isAssign={false}
                  onClose={closeDialog}
                />,
              )
            }
          >
            {t('button-remove-role')}
          </Button>
          <Button
            variant="outlined"
            type="submit"
            onClick={() =>
              router.push(`/jurisdiction/${jurisdiction.id}/laws/manage`)
            }
          >
            {t('button-manage-laws')}
          </Button>
        </Stack>
      </Alert>
    );
  }

  return <></>;
}
