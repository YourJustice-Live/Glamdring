import { ArrowForwardOutlined } from '@mui/icons-material';
import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  Typography,
} from '@mui/material';
import useJurisdiction from 'hooks/useJurisdiction';
import { useEffect, useState } from 'react';

/**
 * A widget to select case action.
 */
export default function CaseActionSelect(props) {
  const propsValue = props.value;
  const propsDisabled = props.disabled;
  const propsOnChange = props.onChange;
  const propsLaws = props.formContext?.laws;
  const propsFormCategory = props.formContext?.formData?.category;
  const { isJurisdictionRuleInCategory } = useJurisdiction();
  const [items, setItems] = useState([]);

  /**
   * Get actions from laws and add it to items if action has any rule in the specified category.
   */
  useEffect(() => {
    if (propsLaws) {
      const items = [];
      [...propsLaws.keys()].forEach((key) => {
        let isActionInCategory = false;
        propsLaws.get(key).rules.forEach((rule) => {
          if (isJurisdictionRuleInCategory(rule, propsFormCategory)) {
            isActionInCategory = true;
          }
        });
        if (isActionInCategory) {
          items.push(propsLaws.get(key).action);
        }
      });
      setItems(items);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propsLaws, propsFormCategory]);

  return (
    <Box>
      <Typography sx={{ fontWeight: 'bold' }}>Action</Typography>
      <Divider sx={{ my: 1.5 }} />
      <List>
        {items.map((item, index) => (
          <ListItemButton
            sx={{ py: 2.4 }}
            key={index}
            selected={item.guid === propsValue}
            disabled={propsDisabled}
            onClick={() => propsOnChange(item.guid)}
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
              <Typography sx={{ fontWeight: 'bold' }} gutterBottom>
                {item?.uriData?.name || 'None Name'}
              </Typography>
              <Typography variant="body2">
                {item?.uriData?.description || 'None Description'}
              </Typography>
            </Box>
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
