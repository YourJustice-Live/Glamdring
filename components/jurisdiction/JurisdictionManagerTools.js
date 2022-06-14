import { Alert, Button, Stack, Typography } from '@mui/material';
import RoleManageDialog from 'components/jurisdiction/JurisdictionRoleManageDialog';
import { JURISDICTION_ROLE } from 'constants/contracts';
import useDialogContext from 'hooks/context/useDialogContext';
import useWeb3Context from 'hooks/context/useWeb3Context';
import useJurisdiction from 'hooks/useJurisdiction';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useState } from 'react';
import { palette } from 'theme/palette';
import JurisdictionManageDialog from './JurisdictionManageDialog';

/**
 * A component with jurisdiction manager tools.
 */
export default function JurisdictionManagerTools({ jurisdiction, sx }) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { account } = useWeb3Context();
  const { showDialog, closeDialog } = useDialogContext();
  const { isAccountHasJurisdictionRole } = useJurisdiction();
  const [isAccountAdmin, setIsAccountAdmin] = useState(false);
  const isJurisdictionMain =
    jurisdiction?.id?.toLowerCase() ===
    process.env.NEXT_PUBLIC_MAIN_JURISDICTION_CONTRACT_ADDRESS.toLowerCase();

  useEffect(() => {
    setIsAccountAdmin(false);
    if (account && jurisdiction) {
      setIsAccountAdmin(
        isAccountHasJurisdictionRole(
          jurisdiction,
          account,
          JURISDICTION_ROLE.admin.id,
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, jurisdiction]);

  if (isAccountAdmin) {
    return (
      <Alert
        severity="info"
        icon={false}
        sx={{ p: 3, background: palette.grey[50], boxShadow: 'none', ...sx }}
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
              {t('button-jurisdiction-update')}
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
            {t('button-jurisdiction-assign-role')}
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
            {t('button-jurisdiction-remove-role')}
          </Button>
          <Button
            variant="outlined"
            type="submit"
            onClick={() =>
              router.push(`/jurisdiction/${jurisdiction.id}/laws/manage`)
            }
          >
            {t('button-laws-manage')}
          </Button>
        </Stack>
      </Alert>
    );
  }

  return <></>;
}
