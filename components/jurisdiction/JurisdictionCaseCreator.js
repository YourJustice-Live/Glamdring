import { useState } from 'react';
import { AddBoxOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItemButton,
  Typography,
} from '@mui/material';
import useSubgraph from 'hooks/useSubgraph';
import useToasts from 'hooks/useToasts';

/**
 * TODO: Add docs
 * TODO: Hide component if account is not connected or acconunt is not member of jurisdiction
 */
export default function JurisdictionCaseCreator() {
  const { showToastError } = useToasts();
  const { findActionEntities } = useSubgraph();

  const [isOpen, setIsOpen] = useState(false);
  const [actions, setActions] = useState(false);
  const [rules, setRules] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedRule, setSelectedRule] = useState(null);

  async function open() {
    setIsOpen(true);
    loadActions();
  }

  async function close() {
    setIsOpen(false);
    setActions(null);
    setRules(null);
    setSelectedAction(null);
    setSelectedRule(null);
  }

  async function loadActions() {
    try {
      setActions(await findActionEntities());
    } catch (error) {
      showToastError(error);
    }
  }

  async function selectAction(index) {
    setSelectedAction(index);
    setSelectedRule(null);
    setRules(actions[index].rules);
  }

  async function selectRule(index) {
    setSelectedRule(index);
  }

  return (
    <Box sx={{ mb: 12 }}>
      <Typography variant="h1" gutterBottom>
        Case Creator
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Button variant="contained" startIcon={<AddBoxOutlined />} onClick={open}>
        Create Case
      </Button>
      <Dialog open={isOpen} onClose={close} maxWidth="xl" fullWidth={true}>
        <DialogTitle>Create New Case</DialogTitle>
        <DialogContent>
          <Box>
            <Typography sx={{ fontWeight: 'bold' }}>Jurisdiction</Typography>
            <Divider sx={{ my: 1.5 }} />
            <Typography>???</Typography>
          </Box>
          {actions && (
            <Box sx={{ mt: 4 }}>
              <Typography sx={{ fontWeight: 'bold' }}>Action</Typography>
              <Divider sx={{ my: 1.5 }} />
              <List>
                {actions.map((action, index) => (
                  <ListItemButton
                    key={index}
                    selected={selectedAction === index}
                    onClick={() => selectAction(index)}
                  >
                    <pre>{JSON.stringify(action, null, 2)}</pre>
                  </ListItemButton>
                ))}
              </List>
            </Box>
          )}
          {rules && (
            <Box sx={{ mt: 4 }}>
              <Typography sx={{ fontWeight: 'bold' }}>Rule</Typography>
              <Divider sx={{ my: 1.5 }} />
              <List>
                {rules.map((rule, index) => (
                  <ListItemButton
                    key={index}
                    selected={selectedRule === index}
                    onClick={() => selectRule(index)}
                  >
                    <pre>{JSON.stringify(rule, null, 2)}</pre>
                  </ListItemButton>
                ))}
              </List>
            </Box>
          )}
          {selectedAction != null && selectedRule != null && (
            <>
              <Box sx={{ mt: 4 }}>
                <Typography sx={{ fontWeight: 'bold' }}>Subject</Typography>
                <Divider sx={{ my: 1.5 }} />
                <Typography>...</Typography>
              </Box>
              <Box sx={{ mt: 4 }}>
                <Typography sx={{ fontWeight: 'bold' }}>Affected</Typography>
                <Divider sx={{ my: 1.5 }} />
                <Typography>...</Typography>
              </Box>
              <Button sx={{ mt: 4 }} variant="contained" type="submit">
                Create Case
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
