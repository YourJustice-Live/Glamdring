import {
  AddBoxOutlined,
  IndeterminateCheckBoxOutlined,
  InsertPhotoOutlined,
} from '@mui/icons-material';
import {
  Avatar,
  Button,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import CaseCreateDialog from 'components/case/CaseCreateDialog';
import useDialogContext from 'hooks/useDialogContext';
import useProfile from 'hooks/useProfile';
import useToasts from 'hooks/useToasts';
import { useEffect, useState } from 'react';
import { hexStringToJson } from 'utils/converters';
import { formatAddress } from 'utils/formatters';
import { getTraitValue, traitTypes } from 'utils/metadata';

/**
 * A component with profile meta (image, name, email, socials).
 */
export default function ProfileMeta({ account }) {
  const { showDialog, closeDialog } = useDialogContext();
  const { showToastError } = useToasts();
  const { getProfile } = useProfile();
  const [profile, setProfile] = useState(null);
  const [profileMetadata, setProfileMetadata] = useState(null);

  async function loadData() {
    try {
      const profile = await getProfile(account);
      const profileMedata = hexStringToJson(profile.avatarNftUriData);
      setProfile(profile);
      setProfileMetadata(profileMedata);
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    if (account) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return (
    <>
      <Typography variant="h1" gutterBottom>
        Profile
      </Typography>
      <Divider sx={{ mb: 3 }} />
      {profile && profileMetadata ? (
        <>
          {/* Avatar */}
          <Avatar
            sx={{ width: 128, height: 128, my: 3 }}
            src={profileMetadata.image}
          >
            <InsertPhotoOutlined />
          </Avatar>
          {/* Traits */}
          <Typography gutterBottom>
            <b>Account: </b>
            {formatAddress(profile?.account) || 'none'}
          </Typography>
          <Typography gutterBottom>
            <b>First Name: </b>
            {getTraitValue(profileMetadata, traitTypes.firstName) || 'none'}
          </Typography>
          <Typography gutterBottom>
            <b>Last Name:</b>{' '}
            {getTraitValue(profileMetadata, traitTypes.lastName) || 'none'}
          </Typography>
          <Typography gutterBottom>
            <b>Email: </b>{' '}
            {getTraitValue(profileMetadata, traitTypes.email) || 'none'}
          </Typography>
          <Typography gutterBottom>
            <b>Twitter: </b>{' '}
            {getTraitValue(profileMetadata, traitTypes.twitter) || 'none'}
          </Typography>
          {/* Actions */}
          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<AddBoxOutlined />}
              onClick={() =>
                showDialog(<CaseCreateDialog onClose={closeDialog} />)
              }
            >
              Add Score
            </Button>
            <Button
              variant="contained"
              color="danger"
              startIcon={<IndeterminateCheckBoxOutlined />}
              onClick={() =>
                showDialog(<CaseCreateDialog onClose={closeDialog} />)
              }
            >
              Add Score
            </Button>
          </Stack>
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
    </>
  );
}
