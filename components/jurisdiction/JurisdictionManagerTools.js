import { Button, Divider, Paper, Stack, Typography } from '@mui/material';
import RoleManageDialog from 'components/jurisdiction/JurisdictionRoleManageDialog';
import useDialogContext from 'hooks/useDialogContext';
import useWeb3Context from 'hooks/useWeb3Context';
import { useRouter } from 'next/router';
import { palette } from 'theme/palette';

/**
 * A component with jurisdiction manager tools.
 */
export default function JurisdictionManagerTools({ jurisdiction, sx }) {
  const { account } = useWeb3Context();
  const { showDialog, closeDialog } = useDialogContext();
  const router = useRouter();

  return (
    <>
      {account && jurisdiction && (
        <Paper
          variant="outlined"
          sx={{ p: 3, background: palette.grey[50], ...sx }}
        >
          <Typography variant="h4" gutterBottom>
            Manager Tools
          </Typography>
          <Typography gutterBottom>
            A place where users with the appropriate roles can manage this
            jurisdiction
          </Typography>
          <Divider />
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{ mt: 2 }}
          >
            <Button
              variant="outlined"
              type="submit"
              onClick={() =>
                showDialog(
                  <RoleManageDialog isAssign={true} onClose={closeDialog} />,
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
                  <RoleManageDialog isAssign={false} onClose={closeDialog} />,
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
        </Paper>
      )}
    </>
  );
}
