import { Alert, Button, Stack, Typography } from '@mui/material';
import RoleManageDialog from 'components/jurisdiction/JurisdictionRoleManageDialog';
import useDialogContext from 'hooks/useDialogContext';
import useWeb3Context from 'hooks/useWeb3Context';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { palette } from 'theme/palette';
import JurisdictionManageDialog from './JurisdictionManageDialog';

/**
 * A component with jurisdiction manager tools.
 */
export default function JurisdictionManagerTools({ jurisdiction, sx }) {
  const { account } = useWeb3Context();
  const { showDialog, closeDialog } = useDialogContext();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const isJurisdictionMain =
    jurisdiction?.id?.toLowerCase() ===
    process.env.NEXT_PUBLIC_MAIN_JURISDICTION_CONTRACT_ADDRESS.toLowerCase();

  return (
    <>
      {account && jurisdiction && isVisible && (
        <Alert
          severity="info"
          icon={false}
          sx={{ p: 3, background: palette.grey[50], boxShadow: 'none', ...sx }}
          onClose={() => setIsVisible(false)}
        >
          <Typography variant="h4" gutterBottom>
            Manager Tools
          </Typography>
          <Typography gutterBottom>
            Features for users with appropriate roles to manage this
            jurisdiction
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
                Update Jurisdiction
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
              Assign Role
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
              Remove Role
            </Button>
            <Button
              variant="outlined"
              type="submit"
              onClick={() =>
                router.push(`/jurisdiction/${jurisdiction.id}/laws/manage`)
              }
            >
              Manage Laws
            </Button>
          </Stack>
        </Alert>
      )}
    </>
  );
}
