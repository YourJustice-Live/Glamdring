import {
  FacebookRounded,
  Instagram,
  Language,
  Telegram,
  Twitter,
} from '@mui/icons-material';
import {
  Checkbox,
  Divider,
  FormControlLabel,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { PROFILE_TRAIT_TYPE } from 'constants/metadata';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { getTraitValue } from 'utils/metadata';

/**
 * A widget for input profile attributes (traits).
 */
export default function ProfileAttributesInput(props) {
  const propsDisabled = props.disabled;
  const propsLabels = props.options?.labels;
  const propsHiddenAttributes = props.options?.hiddenAttributes;
  const propsAttributes = props.value;
  const propsOnChange = props.onChange;
  const { t } = useTranslation('common');
  const [attributes, setAttributes] = useState(null);

  function onChange(event) {
    const eventTargetName = event.target.name;
    const eventTargetValue =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;
    // Update state of attributes
    setAttributes(
      attributes.map((attribute) => {
        if (attribute.trait_type === eventTargetName) {
          return {
            trait_type: attribute.trait_type,
            value: eventTargetValue !== null ? eventTargetValue : '',
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
          <Divider sx={{ mb: 4 }} />
          <Typography variant="h4" sx={{ mb: 3 }}>
            {t('input-profile-public-title')}
          </Typography>
          <Stack spacing={2}>
            <TextField
              variant="outlined"
              onChange={onChange}
              label={
                propsLabels?.firstName ||
                t('input-profile-trait-first-name-title')
              }
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
              label={
                propsLabels?.lastName ||
                t('input-profile-trait-last-name-title')
              }
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
              label={
                propsLabels?.description ||
                t('input-profile-trait-description-title')
              }
              name={PROFILE_TRAIT_TYPE.description}
              disabled={propsDisabled}
              value={
                getTraitValue(attributes, PROFILE_TRAIT_TYPE.description) || ''
              }
              multiline
              rows={4}
            />
            <TextField
              variant="outlined"
              onChange={onChange}
              label={propsLabels?.email || t('input-profile-trait-email-title')}
              name={PROFILE_TRAIT_TYPE.email}
              disabled={propsDisabled}
              value={getTraitValue(attributes, PROFILE_TRAIT_TYPE.email) || ''}
              placeholder="email@site.com"
            />
            {!propsHiddenAttributes.isEmailNotificationsEnabled &&
              getTraitValue(attributes, PROFILE_TRAIT_TYPE.email) && (
                <FormControlLabel
                  control={
                    <Checkbox
                      name={PROFILE_TRAIT_TYPE.isEmailNotificationsEnabled}
                      checked={
                        getTraitValue(
                          attributes,
                          PROFILE_TRAIT_TYPE.isEmailNotificationsEnabled,
                        ) || false
                      }
                      onChange={onChange}
                    />
                  }
                  label={t(
                    'input-profile-trait-is-email-notifications-enabled-title',
                  )}
                />
              )}
          </Stack>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h4" sx={{ mb: 3 }}>
            {t('input-profile-links-title')}
          </Typography>
          <Stack spacing={2}>
            <TextField
              variant="outlined"
              onChange={onChange}
              label={propsLabels?.site || t('input-profile-trait-site-title')}
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
              label={
                propsLabels?.twitter || t('input-profile-trait-twitter-title')
              }
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
              label={
                propsLabels?.telegram || t('input-profile-trait-telegram-title')
              }
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
              label={
                propsLabels?.facebook || t('input-profile-trait-facebook-title')
              }
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
              label={
                propsLabels?.instagram ||
                t('input-profile-trait-instagram-title')
              }
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
