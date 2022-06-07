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
import InteractiveAddress from 'components/address/InteractiveAddress';
import CaseCreateDialog from 'components/case/CaseCreateDialog';
import { JURISDICTION_ROLE } from 'constants/contracts';
import useDataContext from 'hooks/context/useDataContext';
import useDialogContext from 'hooks/context/useDialogContext';
import useWeb3Context from 'hooks/context/useWeb3Context';
import useJuridictionContract from 'hooks/contracts/useJurisdictionContract';
import useErrors from 'hooks/useErrors';
import useJurisdiction from 'hooks/useJurisdiction';
import useToasts from 'hooks/useToasts';
import { IconFlag, IconPassport, IconPlus, IconProfile } from 'icons/core';
import { IconJurisdiction } from 'icons/entities';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { palette } from 'theme/palette';
import {
  handleJoinJurisdictionEvent,
  handleLeaveJurisdictionEvent,
} from 'utils/analytics';

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
  const { t } = useTranslation('common');

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        ...sx,
      }}
    >
      <IconFlag color={palette.text.secondary} width="18" height="18" />
      <Typography variant="body2" sx={{ color: 'text.secondary', ml: 1 }}>
        {t('text-jurisdiction').toUpperCase()}
      </Typography>
      <Circle sx={{ color: 'text.secondary', fontSize: 6, ml: 1 }} />
      <InteractiveAddress
        address={jurisdiction.id}
        link={`${window.location.origin}/jurisdiction/${jurisdiction.id}`}
        sx={{ ml: 1 }}
      />
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
  const { t } = useTranslation('common');
  const { account } = useWeb3Context();
  const { accountProfile } = useDataContext();
  const { showDialog, closeDialog } = useDialogContext();
  const { handleError } = useErrors();
  const { showToastSuccess } = useToasts();
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
        handleLeaveJurisdictionEvent(jurisdiction?.id);
      } else {
        transaction = await join(jurisdiction?.id);
        handleJoinJurisdictionEvent(jurisdiction?.id);
      }
      showToastSuccess(t('notification-data-is-successfully-updated'));
      await transaction.wait();
      setIsMember(!isMember);
    } catch (error) {
      handleError(error, true);
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
              color={
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
          {t('button-case-create')}
        </Button>
      )}
      {account && isMember !== null && !isJoiningOrLeaving && (
        <Button
          variant={isMember ? 'outlined' : 'contained'}
          startIcon={
            <IconPassport
              color={
                isMember ? palette.primary.main : palette.primary.contrastText
              }
            />
          }
          onClick={joinOrLeave}
        >
          {isMember
            ? t('button-jurisdiction-leave')
            : t('button-jurisdiction-join')}
        </Button>
      )}
      {account && isMember !== null && isJoiningOrLeaving && (
        <LoadingButton
          loading
          loadingPosition="start"
          startIcon={<Save />}
          variant="outlined"
        >
          {isMember ? t('text-leaving') : t('text-joining')}
        </LoadingButton>
      )}
    </Stack>
  );
}

function ProfileRequireDialog({ isClose, onClose }) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(!isClose);

  function close() {
    setIsOpen(false);
    onClose();
  }

  return (
    <Dialog open={isOpen} onClose={close}>
      <DialogTitle>{t('dialog-jurisdiction-join')}</DialogTitle>
      <DialogContent>
        <Typography>{t('dialog-jurisdiction-join-description')}</Typography>
        <Button
          sx={{ mt: 4 }}
          variant="contained"
          onClick={() => {
            router.push('/profile/create');
            close();
          }}
          startIcon={<IconProfile color={palette.primary.contrastText} />}
        >
          {t('button-profile-create')}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
