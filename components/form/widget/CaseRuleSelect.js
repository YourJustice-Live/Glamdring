import { ArrowForwardOutlined } from '@mui/icons-material';
import {
  Box,
  Chip,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  Typography,
} from '@mui/material';
import RuleEffects from 'components/rule/RuleEffects';
import useRule from 'hooks/useRule';
import { useEffect, useState } from 'react';

/**
 * A widget to select case rule.
 */
export default function CaseRuleSelect(props) {
  const propsValue = props.value;
  const propsDisabled = props.disabled;
  const propsOnChange = props.onChange;
  const propsLaws = props.formContext?.laws;
  const propsFormCategory = props.formContext?.formData?.category;
  const propsFormActionGuid = props.formContext?.formData?.actionGuid;
  const { isRuleInCategory } = useRule();
  const [items, setItems] = useState([]);

  /**
   * Get rules from laws by action guid and add it to items if rule in the specified category.
   */
  useEffect(() => {
    if (propsLaws && propsFormActionGuid) {
      const items = [];
      [...propsLaws.keys()].forEach((key) => {
        if (propsLaws.get(key).action.guid === propsFormActionGuid) {
          propsLaws.get(key).rules.forEach((rule) => {
            if (isRuleInCategory(rule, propsFormCategory)) {
              items.push(rule);
            }
          });
        }
      });
      setItems(items);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propsLaws, propsFormCategory, propsFormActionGuid]);

  return (
    <Box>
      <Typography sx={{ fontWeight: 'bold' }}>Rule</Typography>
      <Divider sx={{ my: 1.5 }} />
      <List>
        {items.map((item, index) => (
          <ListItemButton
            sx={{ py: 2.4 }}
            key={index}
            selected={item.ruleId === propsValue}
            disabled={propsDisabled}
            onClick={() => propsOnChange(item.ruleId)}
          >
            <ListItemIcon>
              <ArrowForwardOutlined />
            </ListItemIcon>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'column',
              }}
            >
              <Typography sx={{ fontWeight: 'bold' }}>
                {item?.rule?.uriData?.name || 'None Name'}
              </Typography>
              <Chip
                label={`ID: ${item?.ruleId}`}
                size="small"
                sx={{ mt: 0.8 }}
              />
              <Typography variant="body2" sx={{ mt: 1.2 }}>
                {item?.rule?.uriData?.description || 'None Description'}
              </Typography>
              <RuleEffects rule={item} sx={{ mt: 1.2 }} />
            </Box>
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
