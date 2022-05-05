import { useEffect, useState } from 'react';
import { Divider, Stack, TextField, Typography } from '@mui/material';
import { traitTypes } from 'utils/metadata';

/**
 * A widget for input profile attributes (traits).
 */
export default function ProfileAttributesInput(props) {
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
              required
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
