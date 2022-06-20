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
import useErrors from 'hooks/useErrors';
import useIpfs from 'hooks/useIpfs';
import useToasts from 'hooks/useToasts';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  handleCreateOwnProfileEvent,
  handleEditOwnProfileEvent,
} from 'utils/analytics';

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
  };

  const router = useRouter();
  const { t } = useTranslation('common');
  const { handleError } = useErrors();
  const { showToastSuccess } = useToasts();
  const { runProfileUpdater } = useDataContext();
  const { uploadJsonToIPFS } = useIpfs();
  const { mint, update, add } = useAvatarNftContract();
  const [status, setStatus] = useState(STATUS.isAvailable);
  const [formData, setFormData] = useState(
    profile?.uriData ? profile.uriData : {},
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
    },
    attributes: {
      'ui:widget': 'ProfileAttributesInput',
      'ui:options': {
        labels: {
          description:
            action === 'createAnotherProfile'
              ? t('input-profile-trait-description-for-another-person-title')
              : t('input-profile-trait-description-for-yourself-title'),
        },
      },
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
      // Use contract
      setStatus(STATUS.isUsingContract);
      if (action === 'createOwnProfile') {
        await mint(url);
        showToastSuccess(t('notification-profile-will-be-minted-soon'));
        runProfileUpdater();
        handleCreateOwnProfileEvent();
      } else if (action === 'editOwnProfile') {
        await update(profile.id, url);
        showToastSuccess(t('notification-profile-will-be-updated-soon'));
        runProfileUpdater();
        handleEditOwnProfileEvent();
      } else if (action === 'createAnotherProfile') {
        await add(url);
        showToastSuccess(
          t('notification-profile-for-another-person-will-be-minted-soon'),
        );
      }
      router.push('/');
    } catch (error) {
      handleError(error, true);
      setStatus(STATUS.isAvailable);
    }
  }

  return (
    <Box>
      <Typography variant="h1" gutterBottom>
        {action === 'createOwnProfile' && t('dialog-profile-create-own-title')}
        {action === 'editOwnProfile' && t('dialog-profile-edit-own-title')}
        {action === 'createAnotherProfile' && t('dialog-profile-invite-title')}
      </Typography>
      <Typography gutterBottom>
        {action === 'createAnotherProfile' &&
          t('dialog-profile-invite-description')}
      </Typography>
      <Divider />
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
            {action === 'createOwnProfile' && t('button-profile-create')}
            {action === 'editOwnProfile' && t('button-profile-save')}
            {action === 'createAnotherProfile' && t('button-profile-invite')}
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
            {action === 'createOwnProfile' && t('text-nft-minting')}
            {action === 'editOwnProfile' && t('text-nft-updating')}
            {action === 'createAnotherProfile' && t('text-nft-minting')}
          </LoadingButton>
        )}
      </Form>
    </Box>
  );
}
