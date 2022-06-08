import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Button, Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { MuiForm5 as Form } from '@rjsf/material-ui';
import AvatarNftMetadata from 'classes/metadata/AvatarNftMetadata';
import ImageInput from 'components/form/widget/ImageInput';
import ProfileAttributesInput from 'components/form/widget/ProfileAttributesInput';
import useDataContext from 'hooks/context/useDataContext';
import useAvatarNftContract from 'hooks/contracts/useAvatarNftContract';
import useIpfs from 'hooks/useIpfs';
import useToasts from 'hooks/useToasts';
import useErrors from 'hooks/useErrors';
import Link from 'next/link';
import { useState } from 'react';
import {
  handleCreateOwnProfileEvent,
  handleEditOwnProfileEvent,
} from 'utils/analytics';
import { useTranslation } from 'next-i18next';

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

  const { t } = useTranslation('common');
  const { handleError } = useErrors();
  const { showToastSuccessLink } = useToasts();
  const { runProfileUpdater } = useDataContext();
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
        title: '',
      },
      attributes: {
        type: 'array',
        title: '',
        items: [{}],
      },
    },
  };

  const uiSchema = {
    image: {
      'ui:widget': 'ImageInput',
      'ui:options': {
        header: (
          <Typography variant="h4" sx={{ mb: 3 }}>
            {t('input-profile-picture-title')}
          </Typography>
        ),
      },
    },
    attributes: {
      'ui:widget': 'ProfileAttributesInput',
    },
  };

  const widgets = {
    ImageInput: ImageInput,
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
      // Do not show this notification
      showToastSuccessLink(
        t('notification-data-is-successfully-uploaded'),
        url,
      );
      // Use contract
      setStatus(STATUS.isUsingContract);
      if (action === 'createOwnProfile') {
        await mint(url);
        runProfileUpdater();
        handleCreateOwnProfileEvent();
      } else if (action === 'editOwnProfile') {
        await update(profile.avatarNftId, url);
        runProfileUpdater();
        handleEditOwnProfileEvent();
      } else if (action === 'createAnotherProfile') {
        await add(url);
      }
      setStatus(STATUS.isUsingContractSuccessed);
    } catch (error) {
      handleError(error, true);
      setStatus(STATUS.isAvailable);
    }
  }

  return (
    <Box>
      {/* Form for fill profile */}
      {formData && status !== STATUS.isUsingContractSuccessed && (
        <>
          <Typography variant="h1" gutterBottom>
            {action === 'createOwnProfile' &&
              t('dialog-profile-create-own-title')}
            {action === 'editOwnProfile' && t('dialog-profile-edit-own-title')}
            {action === 'createAnotherProfile' &&
              t('dialog-profile-invite-title')}
          </Typography>
          <Typography gutterBottom>
            {action === 'createAnotherProfile' &&
              t('dialog-profile-invite-subscription')}
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
              <Button variant="contained" type="submit">
                {action === 'editOwnProfile'
                  ? t('button-profile-edit')
                  : t('button-profile-create')}
              </Button>
            )}
            {status === STATUS.isUploadingToIpfs && (
              <LoadingButton
                loading
                loadingPosition="start"
                startIcon={<Save />}
                variant="outlined"
              >
                {t('text-uploading-to-ipfs')}
              </LoadingButton>
            )}
            {status === STATUS.isUsingContract && (
              <LoadingButton
                loading
                loadingPosition="start"
                startIcon={<Save />}
                variant="outlined"
              >
                {action === 'editOwnProfile'
                  ? t('text-nft-updating')
                  : t('text-nft-minting')}
              </LoadingButton>
            )}
          </Form>
        </>
      )}

      {/* Message that form is submitter */}
      {formData && status === STATUS.isUsingContractSuccessed && (
        <>
          <Typography variant="h4" gutterBottom>
            {t('notification-transaction-is-created')}
          </Typography>
          <Typography gutterBottom>
            {action === 'editOwnProfile'
              ? t('text-profile-will-be-updated-soon')
              : t('text-profile-will-be-minted-soon')}
          </Typography>
          <Link href="/" passHref>
            <Button variant="contained" type="submit" sx={{ mt: 2 }}>
              {t('button-go-home')}
            </Button>
          </Link>
        </>
      )}
    </Box>
  );
}
