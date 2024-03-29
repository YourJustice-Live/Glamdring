import { Autocomplete, Box, TextField } from '@mui/material';
import ProfileCompactCard from 'components/profile/ProfileCompactCard';
import useErrors from 'hooks/useErrors';
import useProfile from 'hooks/useProfile';
import { throttle, unionWith } from 'lodash';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useState } from 'react';
import { formatAddress, formatProfileFirstLastName } from 'utils/formatters';

/**
 * A widget to select profile (profile id).
 */
export default function ProfileSelect(props) {
  const propsHeader = props.options?.header;
  const propsLabel = props.label;
  const propsSize = props.size;
  const propsDisabled = props.disabled;
  const propsRequired = props.required;
  const propsSx = props.sx;
  const propsValue = props.value;
  const propsOnChange = props.onChange;
  const { t } = useTranslation('common');
  const { handleError } = useErrors();
  const { getProfile, getProfilesBySearchQuery } = useProfile();
  const [isDisabled, setIsDisabled] = useState(false);
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);

  /**
   * A function to searching profiles by search query that runs once every defined amount of milliseconds.
   */
  const searchProfiles = useMemo(
    () =>
      throttle((searchQuery, callback) => {
        getProfilesBySearchQuery(searchQuery).then((profiles) =>
          callback(profiles),
        );
      }, 400),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  /**
   * Search profiles if input value is changed.
   */
  useEffect(() => {
    let isComponentActive = true;
    searchProfiles(inputValue, (profiles) => {
      if (isComponentActive) {
        let newOptions = [];
        // Add selected value to option list
        if (value) {
          newOptions = [value];
        }
        // Add found profiles to option list
        if (profiles) {
          newOptions = unionWith(
            newOptions,
            profiles,
            (profile1, profile2) => profile1.id === profile2.id,
          );
        }
        setOptions(newOptions);
      }
    });
    return () => {
      isComponentActive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, value]);

  /**
   * Init selected value if props value is defined
   */
  useEffect(() => {
    if (propsValue) {
      setIsDisabled(true);
      getProfile({ id: propsValue })
        .then((profile) => {
          setValue(profile);
          setIsDisabled(false);
        })
        .catch((error) => handleError(error, true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ ...propsSx }}>
      {propsHeader}
      <Autocomplete
        disabled={isDisabled || propsDisabled}
        getOptionLabel={(option) =>
          formatProfileFirstLastName(option) +
          ' (' +
          option.id +
          ' , ' +
          formatAddress(option.owner) +
          ')'
        }
        filterOptions={(x) => x}
        options={options}
        value={value}
        onChange={(_, newValue) => {
          setValue(newValue);
          propsOnChange(newValue?.id);
        }}
        onInputChange={(_, newInputValue) => {
          setInputValue(newInputValue);
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => (
          <TextField
            fullWidth
            {...params}
            size={propsSize}
            label={propsLabel || t('input-profile-title')}
            placeholder={t('input-profile-placeholder')}
            required={propsRequired}
          />
        )}
        renderOption={(props, option) => {
          return (
            <li {...props}>
              <ProfileCompactCard
                profile={option}
                disableId={false}
                disableAddress={false}
                disableLink={true}
                disableRating={true}
                sx={{ my: 0.6 }}
              />
            </li>
          );
        }}
      />
    </Box>
  );
}
