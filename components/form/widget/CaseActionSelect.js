import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import useAction from 'hooks/useAction';
import useErrors from 'hooks/useErrors';
import useJurisdiction from 'hooks/useJurisdiction';
import { throttle, unionWith } from 'lodash';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useState } from 'react';
import { formatActionName } from 'utils/formatters';

/**
 * A widget to select case action (guid).
 */
export default function CaseActionSelect(props) {
  const propsHeader = props.options?.header;
  const propsFooter = props.options?.footer;
  const propsLabel = props.label;
  const propsDisabled = props.disabled;
  const propsRequired = props.required;
  const propsSx = props.sx;
  const propsValue = props.value;
  const propsOnChange = props.onChange;
  const propsJurisdictionId = props.formContext?.formData?.jurisdictionId;
  const propsIsPositive = props.formContext?.formData?.isPositive;
  const { t } = useTranslation('common');
  const { handleError } = useErrors();
  const { getActions } = useAction();
  const { getJurisdictionRulesBySearchQuery } = useJurisdiction();
  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);

  /**
   * A function to searching jurisdiction rules by search query that runs once every defined amount of milliseconds.
   */
  const searchRules = useMemo(
    () =>
      throttle((jurisdictionId, isPositive, searchQuery, callback) => {
        try {
          getJurisdictionRulesBySearchQuery(
            jurisdictionId,
            isPositive === true,
            isPositive === false,
            true,
            searchQuery,
          ).then((rules) => callback(rules));
        } catch (error) {
          handleError(error, true);
        }
      }, 400),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  /**
   * Load actions by guids and add it to options list.
   */
  async function loadActions(actionGuids) {
    try {
      // Load actions for input options
      const actions = await getActions(actionGuids);
      // Define options
      let options = [];
      // Add selected value to option list
      if (value) {
        options = [value];
      }
      // Add found actions to option list
      if (actions) {
        options = unionWith(
          options,
          actions,
          (action1, action2) => action1.guid === action2.guid,
        );
      }
      setOptions(options);
    } catch (error) {
      handleError(error, true);
    }
  }

  /**
   * Search jurisdiction rules by specified data, then load actions by action guids from found rules.
   */
  useEffect(() => {
    let isComponentActive = true;
    // setOptions([]);
    searchRules(propsJurisdictionId, propsIsPositive, inputValue, (rules) => {
      if (isComponentActive) {
        loadActions(rules.map((rule) => rule.rule.about));
      }
    });
    return () => {
      isComponentActive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propsJurisdictionId, propsIsPositive, inputValue]);

  /**
   * Clear options if props changes.
   */
  useEffect(() => {
    setOptions([]);
  }, [propsJurisdictionId, propsIsPositive]);

  /**
   * Clear value if props value cleared.
   */
  useEffect(() => {
    if (!propsValue) {
      setValue(null);
    }
  }, [propsValue]);

  return (
    <Box sx={{ ...propsSx }}>
      {propsHeader}
      <Autocomplete
        disabled={propsDisabled}
        getOptionLabel={(option) => formatActionName(option)}
        filterOptions={(x) => x}
        options={options}
        value={value}
        onChange={(_, newValue) => {
          setValue(newValue);
          propsOnChange(newValue?.guid);
        }}
        onInputChange={(_, newInputValue) => {
          setInputValue(newInputValue);
        }}
        isOptionEqualToValue={(option, value) => option.guid === value.guid}
        renderInput={(params) => (
          <TextField
            fullWidth
            {...params}
            label={propsLabel || t('input-action-title')}
            placeholder={t('input-action-placeholder')}
            required={propsRequired}
          />
        )}
        renderOption={(props, option) => {
          return (
            <li {...props}>
              <Box sx={{ my: 0.5 }}>
                <Typography>{formatActionName(option)}</Typography>
              </Box>
            </li>
          );
        }}
      />
      {propsFooter}
    </Box>
  );
}
