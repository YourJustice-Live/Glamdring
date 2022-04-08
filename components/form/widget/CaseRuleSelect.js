import { useEffect, useState } from 'react';
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
import useToasts from 'hooks/useToasts';

/**
 * A widget to select case rule.
 */
export default function CaseRuleSelect(props) {
  const propsValue = props.value;
  const propsOnChange = props.onChange;
  const propsFormActionGuid = props.formContext?.formData?.actionGuid;
  const { showToastError } = useToasts();
  const { getRules } = useRule();
  const [rules, setRules] = useState(null);

  async function loadRules() {
    try {
      setRules(null);
      setRules(await getRules(propsFormActionGuid));
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    if (propsFormActionGuid) {
      loadRules();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propsFormActionGuid]);

  return (
    <Box>
      <Typography sx={{ fontWeight: 'bold' }}>Rule</Typography>
      <Divider sx={{ my: 1.5 }} />
      {rules ? (
        <List>
          {rules.map((rule, index) => (
            <ListItemButton
              key={index}
              selected={propsValue === rule.id}
              onClick={() => propsOnChange(rule.id)}
            >
              <ListItemIcon>
                <ArrowForwardOutlined />
              </ListItemIcon>
              <ListItemText
                primary={rule.rule.uriData.name}
                secondary={rule.rule.uriData.description}
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
