import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import useAction from 'hooks/useAction';
import useJurisdiction from 'hooks/useJurisdiction';
import useToasts from 'hooks/useToasts';
import { throttle, unionWith } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { getActionIcon } from 'utils/metadata';

/**
 * A widget to select case action (guid).
 */
export default function CaseActionSelect(props) {
  const propsHeader = props.options?.header;
  const propsFooter = props.options?.footer;
  const propsDisabled = props.disabled;
  const propsRequired = props.required;
  const propsSx = props.sx;
  const propsValue = props.value;
  const propsOnChange = props.onChange;
  const propsJurisdiction = props.formContext?.jurisdiction;
  const propsIsPositive = props.formContext?.formData?.isPositive;
  const { showToastError } = useToasts();
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
      throttle((jurisdiction, isPositive, searchQuery, callback) => {
        try {
          getJurisdictionRulesBySearchQuery(
            jurisdiction.id,
            isPositive === true,
            isPositive === false,
            searchQuery,
          ).then((rules) => callback(rules));
        } catch (error) {
          showToastError(error);
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
      showToastError(error);
    }
  }

  /**
   * Search jurisdiction rules by specified data, then load actions by action guids from found rules.
   */
  useEffect(() => {
    let isComponentActive = true;
    // setOptions([]);
    searchRules(propsJurisdiction, propsIsPositive, inputValue, (rules) => {
      if (isComponentActive) {
        loadActions(rules.map((rule) => rule.rule.about));
      }
    });
    return () => {
      isComponentActive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propsJurisdiction, propsIsPositive, inputValue]);

  /**
   * Clear options if props changes.
   */
  useEffect(() => {
    setOptions([]);
  }, [propsJurisdiction, propsIsPositive]);

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
        getOptionLabel={(option) => option.uriData?.name || 'None Name'}
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
            label="Search by action, acted or affected role"
            required={propsRequired}
          />
        )}
        renderOption={(props, option) => {
          return (
            <li {...props}>
              <Box
                sx={{
                  my: 0.5,
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: { xs: 'flex-start', md: 'center' },
                }}
              >
                {getActionIcon(option, 36)}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    mt: { xs: 1, md: 0 },
                    ml: { xs: 0, md: 2 },
                  }}
                >
                  <Typography sx={{ fontWeight: 'bold' }} gutterBottom>
                    {option.uriData?.name || 'None Name'}
                  </Typography>
                  <Typography variant="body2">
                    {option.uriData?.description}
                  </Typography>
                </Box>
              </Box>
            </li>
          );
        }}
      />
      {propsFooter}
    </Box>
  );
}
