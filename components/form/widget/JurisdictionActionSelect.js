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
import useAction from 'hooks/useAction';
import useToasts from 'hooks/useToasts';

/**
 * A widget to select jurisdiction action.
 */
export default function JurisdictionActionSelect(props) {
  const propsValue = props.value;
  const propsOnChange = props.onChange;
  const { showToastError } = useToasts();
  const { getActions } = useAction();
  const [actions, setActions] = useState(false);

  async function loadActions() {
    try {
      setActions(null);
      setActions(await getActions());
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    loadActions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <Typography sx={{ fontWeight: 'bold' }}>Action</Typography>
      <Divider sx={{ my: 1.5 }} />
      {actions ? (
        <List>
          {actions.map((action, index) => (
            <ListItemButton
              key={index}
              selected={propsValue === action.guid}
              onClick={() => propsOnChange(action.guid)}
            >
              <ListItemIcon>
                <ArrowForwardOutlined />
              </ListItemIcon>
              <ListItemText
                primary={action.uriData.name}
                secondary={action.uriData.description}
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
