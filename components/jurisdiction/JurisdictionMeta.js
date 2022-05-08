import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { JURISDICTION_ROLE } from 'constants/contracts';
import useJuridictionContract from 'hooks/contracts/useJurisdictionContract';
import useDialogContext from 'hooks/useDialogContext';
import useJurisdiction from 'hooks/useJurisdiction';
import useToasts from 'hooks/useToasts';
import useWeb3Context from 'hooks/useWeb3Context';
import { IconProfile } from 'icons';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { palette } from 'theme/palette';

/**
 * A component with jurisdiction meta (title, image, etc).
 */
export default function JurisdictionMeta({ jurisdiction, sx }) {
  const { account, accountProfile } = useWeb3Context();
  const { showDialog, closeDialog } = useDialogContext();
  const { showToastSuccess, showToastError } = useToasts();
  const { join, leave } = useJuridictionContract();
  const { isAccountHasJurisdictionRole } = useJurisdiction();
  const [isMember, setIsMember] = useState(null);
  const [isJoiningOrLeaving, setIsJoiningOrLeaving] = useState(false);

  async function joinOrLeave() {
    try {
      setIsJoiningOrLeaving(true);
      // Check that account has profile
      if (!accountProfile) {
        showDialog(<ProfileRequireDialog onClose={closeDialog} />);
        return;
      }
      // Use contract
      let transaction;
      if (isMember) {
        transaction = await leave();
      } else {
        transaction = await join();
      }
      showToastSuccess('Success! Data will be updated soon.');
      await transaction.wait();
      setIsMember(!isMember);
    } catch (error) {
      showToastError(error);
    } finally {
      setIsJoiningOrLeaving(false);
    }
  }

  useEffect(() => {
    if (account && jurisdiction) {
      setIsMember(
        isAccountHasJurisdictionRole(
          jurisdiction,
          account,
          JURISDICTION_ROLE.member.id,
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jurisdiction]);

  return (
    <Box sx={{ ...sx }}>
      {jurisdiction && (
        <>
          <Typography variant="h1" gutterBottom>
            {jurisdiction.name}
          </Typography>
          <Divider />
          {account && isMember !== null && (
            <Box sx={{ mt: 3 }}>
              {isJoiningOrLeaving ? (
                <LoadingButton
                  loading
                  loadingPosition="start"
                  startIcon={<Save />}
                  variant="outlined"
                >
                  {isMember ? 'Leaving' : 'Joining'}
                </LoadingButton>
              ) : (
                <Button variant="contained" type="submit" onClick={joinOrLeave}>
                  {isMember ? 'Leave' : 'Join'}
                </Button>
              )}
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

function ProfileRequireDialog({ isClose, onClose }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(!isClose);

  function close() {
    setIsOpen(false);
    onClose();
  }

  return (
    <Dialog open={isOpen} onClose={close}>
      <DialogTitle>Join to Jurisdiction</DialogTitle>
      <DialogContent>
        <Typography>
          To join the jurisdiction, you need to create a profile.
        </Typography>
        <Button
          sx={{ mt: 4 }}
          variant="contained"
          onClick={() => {
            router.push('/profile/create');
            close();
          }}
          startIcon={<IconProfile hexColor={palette.primary.contrastText} />}
        >
          Create Profile
        </Button>
      </DialogContent>
    </Dialog>
  );
}
