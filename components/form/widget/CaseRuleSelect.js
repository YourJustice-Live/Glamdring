import {
  Box,
  Chip,
  List,
  ListItemButton,
  Skeleton,
  Typography,
  useMediaQuery,
} from '@mui/material';
import RuleEffects from 'components/law/RuleEffects';
import useErrors from 'hooks/useErrors';
import useJurisdiction from 'hooks/useJurisdiction';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { theme } from 'theme';
import { getActionIcon } from 'utils/metadata';

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
  const propsFormAction = props.formContext?.formAction;
  const { t } = useTranslation('common');
  const { handleError } = useErrors();
  const { getJurisdictionRules } = useJurisdiction();
  const [rules, setRules] = useState(null);
  const isMediumDevice = useMediaQuery(theme.breakpoints.up('md'));

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
        .catch((error) => handleError(error, true));
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
              key={index}
              selected={rule.ruleId === propsValue}
              disabled={propsDisabled}
              alignItems={isMediumDevice ? 'center' : 'flex-start'}
              sx={{
                py: 1.8,
                display: 'flex',
                flexDirection: {
                  xs: 'column',
                  md: 'row',
                },
              }}
              onClick={() => {
                propsOnChange(rule.ruleId);
              }}
            >
              {/* Action icon */}
              {getActionIcon(propsFormAction, 36)}
              {/* Rule details */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  mt: { xs: 1, md: 0 },
                  ml: { xs: 0, md: 2 },
                }}
              >
                {/* Rule negation, name, id */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { xs: 'flex-start', md: 'center' },
                  }}
                >
                  {rule?.rule?.negation && (
                    <Typography
                      sx={{
                        fontWeight: 'bold',
                        color: 'danger.primary',
                        mr: 0.5,
                      }}
                    >
                      {t('text-action-negation')}
                    </Typography>
                  )}
                  <Typography
                    sx={{ fontWeight: 'bold', mr: 1, mt: { xs: 0.2, md: 0 } }}
                  >
                    {rule?.rule?.uriData?.name || t('text-none-name')}
                  </Typography>
                  <Chip
                    label={`ID: ${rule.ruleId}`}
                    size="small"
                    sx={{ mt: { xs: 0.5, md: 0 } }}
                  />
                </Box>
                {/* Rule description */}
                {rule?.rule?.uriData?.description && (
                  <Typography variant="body2" sx={{ mt: { xs: 1, md: 0.3 } }}>
                    {rule.rule.uriData.description}
                  </Typography>
                )}
                {/* Rule effects */}
                <RuleEffects rule={rule} sx={{ mt: { xs: 1.8, md: 1.2 } }} />
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
