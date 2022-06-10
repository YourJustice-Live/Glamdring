import { Autocomplete, TextField } from '@mui/material';
import { Box } from '@mui/system';
import JurisdctionCompactCard from 'components/jurisdiction/JurisdictionCompactCard';
import useErrors from 'hooks/useErrors';
import useJurisdiction from 'hooks/useJurisdiction';
import { throttle, unionWith } from 'lodash';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useState } from 'react';
import { formatAddress } from 'utils/formatters';

/**
 * A widget to select jurisdiction (id, address).
 */
export default function JurisdictionSelect(props) {
  const propsHeader = props.options?.header;
  const propsFooter = props.options?.footer;
  const propsLabel = props.label;
  const propsSize = props.size;
  const propsDisabled = props.disabled;
  const propsRequired = props.required;
  const propsSx = props.sx;
  const propsValue = props.value;
  const propsOnChange = props.onChange;
  const { t } = useTranslation('common');
  const { handleError } = useErrors();
  const { getJurisdiction, getJurisdictionsBySearchQuery } = useJurisdiction();
  const [isDisabled, setIsDisabled] = useState(false);
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);

  /**
   * A function to searching jurisdictions by search query that runs once every defined amount of milliseconds.
   */
  const searchJurisdictions = useMemo(
    () =>
      throttle((searchQuery, callback) => {
        getJurisdictionsBySearchQuery(searchQuery).then((jurisdictions) =>
          callback(jurisdictions),
        );
      }, 400),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  /**
   * Search jurisdictions if input value is changed.
   */
  useEffect(() => {
    let isComponentActive = true;
    searchJurisdictions(inputValue, (jurisdictions) => {
      if (isComponentActive) {
        let newOptions = [];
        // Add selected value to option list
        if (value) {
          newOptions = [value];
        }
        // Add found jurisdictions to option list
        if (jurisdictions) {
          newOptions = unionWith(
            newOptions,
            jurisdictions,
            (jurisdiction1, jurisdiction2) =>
              jurisdiction1.id === jurisdiction2.id,
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
   * Init selected value if props value is defined.
   */
  useEffect(() => {
    if (propsValue) {
      setIsDisabled(true);
      getJurisdiction(propsValue)
        .then((jurisdiction) => {
          setValue(jurisdiction);
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
          option.name + ' (' + formatAddress(option.id) + ')'
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
            label={propsLabel || t('input-jurisdiction-title')}
            placeholder={t('input-jurisdiction-placeholder')}
            required={propsRequired}
          />
        )}
        renderOption={(props, option) => {
          return (
            <li {...props}>
              <JurisdctionCompactCard jurisdiction={option} />
            </li>
          );
        }}
      />
      {propsFooter}
    </Box>
  );
}
