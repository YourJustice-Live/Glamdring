import { Circle, Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import CaseCreateDialog from 'components/case/CaseCreateDialog';
import { JURISDICTION_ROLE } from 'constants/contracts';
import useJuridictionContract from 'hooks/contracts/useJurisdictionContract';
import useDialogContext from 'hooks/useDialogContext';
import useJurisdiction from 'hooks/useJurisdiction';
import useToasts from 'hooks/useToasts';
import useWeb3Context from 'hooks/useWeb3Context';
import {
  IconFlag,
  IconJurisdiction,
  IconPassport,
  IconPlus,
  IconProfile,
} from 'icons';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { palette } from 'theme/palette';
import { formatAddress } from 'utils/formatters';

/**
 * A component with jurisdiction meta (title, image, etc).
 */
export default function JurisdictionMeta({ jurisdiction, sx }) {
  return (
    <Box sx={{ ...sx }}>
      {jurisdiction ? (
        <>
          <JurisdictionTop jurisdiction={jurisdiction} />
          <Divider sx={{ mt: 1, mb: 3 }} />
          <JurisdictionMain jurisdiction={jurisdiction} />
        </>
      ) : (
        <>
          <Skeleton
            variant="rectangular"
            height={24}
            width={256}
            sx={{ mb: 1 }}
          />
          <Skeleton
            variant="rectangular"
            height={24}
            width={256}
            sx={{ mb: 1 }}
          />
        </>
      )}
    </Box>
  );
}

function JurisdictionTop({ jurisdiction, sx }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        ...sx,
      }}
    >
      <IconFlag hexColor={palette.text.secondary} size={18} />
      <Typography variant="body2" sx={{ color: 'text.secondary', ml: 1 }}>
        JURISDICTION
      </Typography>
      <Circle sx={{ color: 'text.secondary', fontSize: 6, ml: 1 }} />
      <Typography variant="body2" sx={{ color: 'text.secondary', ml: 1 }}>
        {formatAddress(jurisdiction?.id) || 'none'}
      </Typography>
    </Box>
  );
}

function JurisdictionMain({ jurisdiction, sx }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { md: 'center' },
        ...sx,
      }}
    >
      <JurisdictionAvatar jurisdiction={jurisdiction} />
      <Box sx={{ mt: { xs: 2, md: 0 }, ml: { md: 4 } }}>
        <Typography variant="h2">{jurisdiction.name}</Typography>
        {jurisdiction.description && (
          <Typography sx={{ mt: 1 }}>{jurisdiction.description}</Typography>
        )}
        <JurisdictionActions jurisdiction={jurisdiction} sx={{ mt: 2 }} />
      </Box>
    </Box>
  );
}

function JurisdictionAvatar({ jurisdiction, sx }) {
  return (
    <Box sx={{ ...sx }}>
      <Avatar
        sx={{
          width: 164,
          height: 164,
          borderRadius: '24px',
        }}
        src={jurisdiction?.image}
      >
        <IconJurisdiction width="164" height="164" />
      </Avatar>
    </Box>
  );
}

function JurisdictionActions({ jurisdiction, sx }) {
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
        transaction = await leave(jurisdiction?.id);
      } else {
        transaction = await join(jurisdiction?.id);
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
    <Stack direction="row" spacing={1} sx={{ ...sx }}>
      {account && (
        <Button
          variant={isMember ? 'contained' : 'outlined'}
          startIcon={
            <IconPlus
              hexColor={
                isMember ? palette.primary.contrastText : palette.primary.main
              }
            />
          }
          onClick={() =>
            showDialog(
              <CaseCreateDialog
                jurisdiction={jurisdiction}
                onClose={closeDialog}
              />,
            )
          }
        >
          Create Case
        </Button>
      )}
      {account && isMember !== null && !isJoiningOrLeaving && (
        <Button
          variant={isMember ? 'outlined' : 'contained'}
          startIcon={
            <IconPassport
              hexColor={
                isMember ? palette.primary.main : palette.primary.contrastText
              }
            />
          }
          onClick={joinOrLeave}
        >
          {isMember ? 'Leave' : 'Join'}
        </Button>
      )}
      {account && isMember !== null && isJoiningOrLeaving && (
        <LoadingButton
          loading
          loadingPosition="start"
          startIcon={<Save />}
          variant="outlined"
        >
          {isMember ? 'Leaving' : 'Joining'}
        </LoadingButton>
      )}
    </Stack>
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
