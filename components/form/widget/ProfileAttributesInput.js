import {
  FacebookRounded,
  Instagram,
  Language,
  Telegram,
  Twitter,
} from '@mui/icons-material';
import {
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { PROFILE_TRAIT_TYPE } from 'constants/metadata';
import { useEffect, useState } from 'react';
import { getTraitValue } from 'utils/metadata';

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
            value: eventTargetValue || '',
          };
        } else {
          return attribute;
        }
      }),
    );
  }

  useEffect(() => {
    // Init attributes using parent's props or default values
    const attributes = Object.values(PROFILE_TRAIT_TYPE).map((traitType) => {
      return {
        trait_type: traitType,
        value: getTraitValue(propsAttributes, traitType) || '',
      };
    });
    setAttributes(attributes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Update parent's props
    propsOnChange(attributes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes]);

  return (
    <>
      {attributes ? (
        <>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Public Profile
          </Typography>
          <Stack spacing={2}>
            <TextField
              variant="outlined"
              onChange={onChange}
              label={PROFILE_TRAIT_TYPE.firstName}
              name={PROFILE_TRAIT_TYPE.firstName}
              disabled={propsDisabled}
              value={
                getTraitValue(attributes, PROFILE_TRAIT_TYPE.firstName) || ''
              }
              required
            />
            <TextField
              variant="outlined"
              onChange={onChange}
              label={PROFILE_TRAIT_TYPE.lastName}
              name={PROFILE_TRAIT_TYPE.lastName}
              disabled={propsDisabled}
              value={
                getTraitValue(attributes, PROFILE_TRAIT_TYPE.lastName) || ''
              }
              required
            />
            <TextField
              variant="outlined"
              onChange={onChange}
              label={PROFILE_TRAIT_TYPE.description}
              name={PROFILE_TRAIT_TYPE.description}
              disabled={propsDisabled}
              value={
                getTraitValue(attributes, PROFILE_TRAIT_TYPE.description) || ''
              }
              multiline
              rows={4}
            />
          </Stack>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h4" sx={{ mb: 4 }}>
            Contacts
          </Typography>
          <Stack spacing={2}>
            <TextField
              variant="outlined"
              onChange={onChange}
              label={PROFILE_TRAIT_TYPE.email}
              name={PROFILE_TRAIT_TYPE.email}
              disabled={propsDisabled}
              value={getTraitValue(attributes, PROFILE_TRAIT_TYPE.email) || ''}
              placeholder="email@site.com"
            />
          </Stack>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h4" sx={{ mb: 4 }}>
            Links
          </Typography>
          <Stack spacing={2}>
            <TextField
              variant="outlined"
              onChange={onChange}
              label={PROFILE_TRAIT_TYPE.site}
              name={PROFILE_TRAIT_TYPE.site}
              disabled={propsDisabled}
              value={getTraitValue(attributes, PROFILE_TRAIT_TYPE.site) || ''}
              placeholder="https://site.com"
              type="url"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Language color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              variant="outlined"
              onChange={onChange}
              label={PROFILE_TRAIT_TYPE.twitter}
              name={PROFILE_TRAIT_TYPE.twitter}
              disabled={propsDisabled}
              value={
                getTraitValue(attributes, PROFILE_TRAIT_TYPE.twitter) || ''
              }
              placeholder="username"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Twitter color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              variant="outlined"
              onChange={onChange}
              label={PROFILE_TRAIT_TYPE.telegram}
              name={PROFILE_TRAIT_TYPE.telegram}
              disabled={propsDisabled}
              value={
                getTraitValue(attributes, PROFILE_TRAIT_TYPE.telegram) || ''
              }
              placeholder="username"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Telegram color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              variant="outlined"
              onChange={onChange}
              label={PROFILE_TRAIT_TYPE.facebook}
              name={PROFILE_TRAIT_TYPE.facebook}
              disabled={propsDisabled}
              value={
                getTraitValue(attributes, PROFILE_TRAIT_TYPE.facebook) || ''
              }
              placeholder="username"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FacebookRounded color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              variant="outlined"
              onChange={onChange}
              label={PROFILE_TRAIT_TYPE.instagram}
              name={PROFILE_TRAIT_TYPE.instagram}
              disabled={propsDisabled}
              value={
                getTraitValue(attributes, PROFILE_TRAIT_TYPE.instagram) || ''
              }
              placeholder="username"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Instagram color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
          <Divider sx={{ mt: 4, mb: 3 }} />
        </>
      ) : (
        <></>
      )}
    </>
  );
}
