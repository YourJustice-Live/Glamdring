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
import useIpfs from 'hooks/useIpfs';
import useRule from 'hooks/useRule';
import useToasts from 'hooks/useToasts';
import { useEffect, useState } from 'react';

/**
 * A widget to select case rule.
 */
export default function CaseRuleSelect(props) {
  const propsValue = props.value;
  const propsOnChange = props.onChange;
  const propsFormActionGuid = props.formContext?.formData?.actionGuid;
  const { showToastError } = useToasts();
  const { loadJsonFromIPFS } = useIpfs();
  const { getRulesByActionGuid } = useRule();
  const [items, setItems] = useState(null);

  async function loadItems() {
    try {
      setItems(null);
      let items = [];
      const rules = await getRulesByActionGuid(propsFormActionGuid);
      for (const rule of rules) {
        let item = {
          rule: rule,
          ruleUriData: await loadJsonFromIPFS(rule.rule.uri),
        };
        items.push(item);
      }
      setItems(items);
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    if (propsFormActionGuid) {
      loadItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propsFormActionGuid]);

  return (
    <Box>
      <Typography sx={{ fontWeight: 'bold' }}>Rule</Typography>
      <Divider sx={{ my: 1.5 }} />
      {items ? (
        <List>
          {items.map((item, index) => (
            <ListItemButton
              key={index}
              selected={item.rule.id === propsValue}
              onClick={() => propsOnChange(item.rule.id)}
            >
              <ListItemIcon>
                <ArrowForwardOutlined />
              </ListItemIcon>
              <ListItemText
                primary={item.ruleUriData.name}
                secondary={item.ruleUriData.description}
              />
            </ListItemButton>
          ))}
        </List>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Box>
  );
}
