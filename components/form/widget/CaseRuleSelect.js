import {
  Box,
  Chip,
  List,
  ListItemButton,
  Skeleton,
  Typography,
} from '@mui/material';
import RuleEffects from 'components/law/RuleEffects';
import useJurisdiction from 'hooks/useJurisdiction';
import useToasts from 'hooks/useToasts';
import { useEffect, useState } from 'react';

/**
 * A widget to select case rule (ruleId).
 */
export default function CaseRuleSelect(props) {
  const propsHeader = props.options?.header;
  const propsValue = props.value;
  const propsDisabled = props.disabled;
  const propsSx = props.sx;
  const propsOnChange = props.onChange;
  const propsJurisdiction = props.formContext?.jurisdiction;
  const propsFormIsPositive = props.formContext?.formData?.isPositive;
  const propsFormActionGuid = props.formContext?.formData?.actionGuid;
  const { showToastError } = useToasts();
  const { getJurisdictionRules } = useJurisdiction();
  const [rules, setRules] = useState(null);

  useEffect(() => {
    if (propsJurisdiction && propsFormActionGuid) {
      setRules(null);
      getJurisdictionRules(
        null,
        propsJurisdiction.id,
        propsFormActionGuid,
        propsFormIsPositive === true,
        propsFormIsPositive === false,
      )
        .then((rules) => setRules(rules))
        .catch((error) => showToastError(error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propsJurisdiction, propsFormIsPositive, propsFormActionGuid]);

  return (
    <Box sx={{ ...propsSx }}>
      {propsHeader}
      {rules ? (
        <List>
          {rules.map((rule, index) => (
            <ListItemButton
              sx={{ py: 2.4 }}
              key={index}
              selected={rule.ruleId === propsValue}
              disabled={propsDisabled}
              onClick={() => {
                propsOnChange(rule.ruleId);
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  flexDirection: 'column',
                }}
              >
                <Typography sx={{ fontWeight: 'bold' }}>
                  {rule?.rule?.uriData?.name || 'None Name'}
                </Typography>
                <Chip
                  label={`ID: ${rule?.ruleId}`}
                  size="small"
                  sx={{ mt: 0.8 }}
                />
                <Typography variant="body2" sx={{ mt: 1.2 }}>
                  {rule?.rule?.uriData?.description || 'None Description'}
                </Typography>
                <RuleEffects rule={rule} sx={{ mt: 1.2 }} />
              </Box>
            </ListItemButton>
          ))}
        </List>
      ) : (
        <>
          <Skeleton variant="rectangular" width={196} height={24} />
          <Skeleton
            variant="rectangular"
            width={128}
            height={18}
            sx={{ mt: 1.5 }}
          />
        </>
      )}
    </Box>
  );
}
