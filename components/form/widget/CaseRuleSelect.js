import { ArrowForwardOutlined } from '@mui/icons-material';
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
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
          propsLaws.get(key).rules.forEach((lawRule) => {
            if (isRuleInCategory(lawRule.rule, propsFormCategory)) {
              items.push({
                rule: lawRule.rule,
                ruleUriData: lawRule.ruleUriData,
              });
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
            key={index}
            selected={item.rule.id === propsValue}
            disabled={propsDisabled}
            onClick={() => propsOnChange(item.rule.id)}
          >
            <ListItemIcon>
              <ArrowForwardOutlined />
            </ListItemIcon>
            <ListItemText
              primary={item?.ruleUriData?.name || 'None Name'}
              secondary={item?.ruleUriData?.description || 'None Description'}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
