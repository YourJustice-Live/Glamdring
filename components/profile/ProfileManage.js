import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Button, Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { MuiForm5 as Form } from '@rjsf/material-ui';
import AvatarNftMetadata from 'classes/metadata/AvatarNftMetadata';
import ProfileAttributesInput from 'components/form/widget/ProfileAttributesInput';
import ProfilePictureInput from 'components/form/widget/ProfilePictureInput';
import useAvatarNftContract from 'hooks/contracts/useAvatarNftContract';
import useIpfs from 'hooks/useIpfs';
import useToasts from 'hooks/useToasts';
import useWeb3Context from 'hooks/useWeb3Context';
import Link from 'next/link';
import { useState } from 'react';

/**
 * A component for create, edit own profile or create profile for another person (aka invite).
 *
 * @param {{profile: Profile, action: 'createOwnProfile'|'editOwnProfile'|'createAnotherProfile'}} params Params.
 */
export default function ProfileManage({
  profile,
  action = 'createAnotherProfile',
}) {
  const STATUS = {
    isAvailable: 'isAvailable',
    isUploadingToIpfs: 'isUploadingToIpfs',
    isUsingContract: 'isUsingContract',
    isUsingContractSuccessed: 'isUsingContractSuccessed',
  };

  const { showToastSuccessLink, showToastError } = useToasts();
  const { runProfileUpdater } = useWeb3Context();
  const { uploadJsonToIPFS } = useIpfs();
  const { mint, update, add } = useAvatarNftContract();
  const [status, setStatus] = useState(STATUS.isAvailable);
  const [formData, setFormData] = useState(
    profile?.avatarNftUriData ? profile.avatarNftUriData : {},
  );

  const schema = {
    type: 'object',
    properties: {
      image: {
        type: 'string',
        title: 'Profile Picture',
      },
      attributes: {
        type: 'array',
        title: 'Profile Attributes',
        items: [{}],
      },
    },
  };

  const uiSchema = {
    image: {
      'ui:widget': 'ProfilePictureInput',
      'ui:options': {
        size: 128,
      },
    },
    attributes: {
      'ui:widget': 'ProfileAttributesInput',
    },
  };

  const widgets = {
    ProfilePictureInput: ProfilePictureInput,
    ProfileAttributesInput: ProfileAttributesInput,
  };

  async function submit({ formData }) {
    try {
      // Update form data
      setFormData(formData);
      // Upload json with form data to IPFS
      setStatus(STATUS.isUploadingToIpfs);
      const { url } = await uploadJsonToIPFS(
        new AvatarNftMetadata(formData.image, formData.attributes),
      );
      showToastSuccessLink('Data uploaded to IPFS!', url);
      // Use contract
      setStatus(STATUS.isUsingContract);
      if (action === 'createOwnProfile') {
        await mint(url);
        runProfileUpdater();
      } else if (action === 'editOwnProfile') {
        await update(profile.avatarNftId, url);
        runProfileUpdater();
      } else if (action === 'createAnotherProfile') {
        await add(url);
      }
      setStatus(STATUS.isUsingContractSuccessed);
    } catch (error) {
      showToastError(error);
    }
  }

  return (
    <Box>
      {/* Form for fill profile */}
      {formData && status !== STATUS.isUsingContractSuccessed && (
        <>
          <Typography variant="h1" gutterBottom>
            {action === 'createOwnProfile' && 'Creating Own Profile'}
            {action === 'editOwnProfile' && 'Editing Own Profile'}
            {action === 'createAnotherProfile' && 'Invite Person'}
          </Typography>
          <Typography gutterBottom>
            {action === 'createAnotherProfile' &&
              'Create profile for another person to make it appear in YourJustice.'}
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Form
            schema={schema}
            uiSchema={uiSchema}
            formData={formData}
            onSubmit={submit}
            widgets={widgets}
            disabled={status !== STATUS.isAvailable ? true : false}
          >
            {status === STATUS.isAvailable && (
              <Button variant="outlined" type="submit">
                {action === 'editOwnProfile'
                  ? 'Edit Profile'
                  : 'Create Profile'}
              </Button>
            )}
            {status === STATUS.isUploadingToIpfs && (
              <LoadingButton
                loading
                loadingPosition="start"
                startIcon={<Save />}
                variant="outlined"
              >
                Uploading to IPFS
              </LoadingButton>
            )}
            {status === STATUS.isUsingContract && (
              <LoadingButton
                loading
                loadingPosition="start"
                startIcon={<Save />}
                variant="outlined"
              >
                {action === 'editOwnProfile' ? 'Updating NFT' : 'Minting NFT'}
              </LoadingButton>
            )}
          </Form>
        </>
      )}

      {/* Message that form is submitter */}
      {formData && status === STATUS.isUsingContractSuccessed && (
        <>
          <Typography variant="h4" gutterBottom>
            Transaction is created!
          </Typography>
          <Typography gutterBottom>
            {action === 'editOwnProfile'
              ? 'Your profile will be updated soon.'
              : 'Your profile will be minted soon.'}
          </Typography>
          <Link href="/" passHref>
            <Button variant="contained" type="submit" sx={{ mt: 2 }}>
              Go to Home
            </Button>
          </Link>
        </>
      )}
    </Box>
  );
}
