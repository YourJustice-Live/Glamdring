import { useEffect, useState } from 'react';
import { InsertPhotoOutlined } from '@mui/icons-material';
import {
  Avatar,
  CircularProgress,
  Divider,
  Input,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { MuiForm5 as Form } from '@rjsf/material-ui';
import useIpfs from 'hooks/useIpfs';
import useToasts from 'hooks/useToasts';
import { traitTypes } from 'utils/metadata';

/**
 * A component with a form for creating or editing a profile.
 *
 * TODO: Check that account uploaded picture before submit form
 */
export default function ProfileForm({
  children,
  disabled,
  initData,
  onSubmit,
}) {
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
      'ui:widget': 'ProfilePictureInputWidget',
      'ui:options': {
        size: 128,
      },
    },
    attributes: {
      'ui:widget': 'ProfileAttributesInputWidget',
    },
  };

  const widgets = {
    ProfilePictureInputWidget: ProfilePictureInputWidget,
    ProfileAttributesInputWidget: ProfileAttributesInputWidget,
  };

  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      formData={initData}
      onSubmit={({ formData }) => onSubmit(formData)}
      widgets={widgets}
      disabled={disabled}
    >
      {children}
    </Form>
  );
}

/**
 * A widget for input profile attributes (traits).
 */
function ProfileAttributesInputWidget(props) {
  const propsDisabled = props.disabled;
  const propsAttributes = props.value;
  const propsOnChange = props.onChange;

  const [attributes, setAttributes] = useState(null);

  function onChange(event) {
    const eventTargetName = event.target.name;
    const eventTargetValue = event.target.value;
    // Update state of attributes
    setAttributes(
      attributes.map((attribute) => {
        if (attribute.trait_type === eventTargetName) {
          return {
            trait_type: attribute.trait_type,
            value: eventTargetValue,
          };
        } else {
          return attribute;
        }
      }),
    );
  }

  useEffect(() => {
    // Init attributes using parent's props
    if (!attributes) {
      setAttributes([
        {
          trait_type: traitTypes.firstName,
          value:
            propsAttributes.find(
              (attribute) => attribute?.trait_type === traitTypes.firstName,
            )?.value || '',
        },
        {
          trait_type: traitTypes.lastName,
          value:
            propsAttributes.find(
              (attribute) => attribute?.trait_type === traitTypes.lastName,
            )?.value || '',
        },
        {
          trait_type: traitTypes.email,
          value:
            propsAttributes.find(
              (attribute) => attribute?.trait_type === traitTypes.email,
            )?.value || '',
        },
        {
          trait_type: traitTypes.twitter,
          value:
            propsAttributes.find(
              (attribute) => attribute?.trait_type === traitTypes.twitter,
            )?.value || '',
        },
      ]);
    }
    // Update parent's props
    else {
      propsOnChange(attributes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes]);

  return (
    <>
      {attributes ? (
        <>
          <Typography variant="h5">Profile Picture</Typography>
          <Divider sx={{ mb: 3 }} />
          <Stack spacing={1} sx={{ mb: 4 }}>
            <TextField
              variant="outlined"
              onChange={onChange}
              label={traitTypes.firstName}
              name={traitTypes.firstName}
              disabled={propsDisabled}
              value={
                attributes.find(
                  (attribute) => attribute?.trait_type === traitTypes.firstName,
                )?.value
              }
            />
            <TextField
              variant="outlined"
              onChange={onChange}
              label={traitTypes.lastName}
              name={traitTypes.lastName}
              disabled={propsDisabled}
              value={
                attributes.find(
                  (attribute) => attribute?.trait_type === traitTypes.lastName,
                )?.value
              }
            />
          </Stack>
          <Typography variant="h5">Public Contacts</Typography>
          <Divider sx={{ mb: 3 }} />
          <Stack spacing={1} sx={{ mb: 4 }}>
            <TextField
              variant="outlined"
              onChange={onChange}
              label={traitTypes.email}
              name={traitTypes.email}
              disabled={propsDisabled}
              value={
                attributes.find(
                  (attribute) => attribute?.trait_type === traitTypes.email,
                )?.value
              }
            />
          </Stack>
          <Typography variant="h5">Links</Typography>
          <Divider sx={{ mb: 3 }} />
          <Stack spacing={1} sx={{ mb: 2 }}>
            <TextField
              variant="outlined"
              onChange={onChange}
              label={traitTypes.twitter}
              name={traitTypes.twitter}
              disabled={propsDisabled}
              value={
                attributes.find(
                  (attribute) => attribute?.trait_type === traitTypes.twitter,
                )?.value
              }
            />
          </Stack>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

/**
 * A widget for input a profile picture.
 */
function ProfilePictureInputWidget(props) {
  const propsSize = props.options.size || 128;
  const propsDisabled = props.disabled;
  const propsPicture = props.value;
  const propsOnChange = props.onChange;
  const { showToastSuccessLink, showToastError } = useToasts();
  const { uploadFileToIPFS } = useIpfs();
  const [isLoading, setIsLoading] = useState(false);

  function isFileValid(file) {
    if (!file) {
      return false;
    }
    const isJpgOrPng =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/gif' ||
      file.type === 'image/svg+xml';
    if (!isJpgOrPng) {
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      return false;
    }
    return true;
  }

  async function onChange(event) {
    // Get file
    const file = event.target.files[0];
    // Ignore not existing file
    if (!file) {
      return;
    }
    // Show error if file is not valid
    if (!isFileValid(file)) {
      event.target.value = null;
      showToastError(
        'Sorry, only JPG/PNG/GIF files with size smaller than 2MB are currently supported!',
      );
      return;
    }
    // Upload file to IPFS
    try {
      setIsLoading(true);
      const { url } = await uploadFileToIPFS(file);
      propsOnChange(url);
      showToastSuccessLink('Your picture uploaded to IPFS!', url);
    } catch (error) {
      showToastError(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Typography variant="h5">Profile Picture</Typography>
      <Divider sx={{ mb: 2 }} />
      <label htmlFor="input" style={{ width: propsSize, height: propsSize }}>
        <Avatar
          sx={{
            cursor: !isLoading && !propsDisabled ? 'pointer' : null,
            width: propsSize,
            height: propsSize,
          }}
          src={!isLoading ? propsPicture : null}
        >
          {isLoading ? <CircularProgress /> : <InsertPhotoOutlined />}
        </Avatar>
        <Input
          onChange={onChange}
          sx={{ display: 'none' }}
          accept="image/*"
          id="input"
          type="file"
          disabled={isLoading || propsDisabled}
        />
      </label>
    </>
  );
}
