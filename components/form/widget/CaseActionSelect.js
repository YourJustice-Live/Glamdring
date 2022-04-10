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
import useIpfs from 'hooks/useIpfs';
import useToasts from 'hooks/useToasts';
import { useEffect, useState } from 'react';

/**
 * A widget to select case action.
 */
export default function CaseActionSelect(props) {
  const propsValue = props.value;
  const propsOnChange = props.onChange;
  const { showToastError } = useToasts();
  const { loadJsonFromIPFS } = useIpfs();
  const { getActions } = useAction();
  const [items, setItems] = useState(null);

  async function loadItems() {
    try {
      setItems(null);
      let items = [];
      const actions = await getActions();
      for (const action of actions) {
        let item = {
          action: action,
          actionUriData: await loadJsonFromIPFS(action.uri),
        };
        items.push(item);
      }
      setItems(items);
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <Typography sx={{ fontWeight: 'bold' }}>Action</Typography>
      <Divider sx={{ my: 1.5 }} />
      {items ? (
        <List>
          {items.map((item, index) => (
            <ListItemButton
              key={index}
              selected={item.action.guid === propsValue}
              onClick={() => propsOnChange(item.action.guid)}
            >
              <ListItemIcon>
                <ArrowForwardOutlined />
              </ListItemIcon>
              <ListItemText
                primary={item.actionUriData.name}
                secondary={item.actionUriData.description}
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
