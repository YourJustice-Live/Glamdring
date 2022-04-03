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
import useAction from 'hooks/useAction';
import useToasts from 'hooks/useToasts';
import useRule from 'hooks/useRule';
import useProfile from 'hooks/useProfile';

/**
 * A component with form to create jurisdiction case.
 *
 * TODO: Use rjsf form with custom widgets
 * TODO: Create pretty visual components instead of json
 * TODO: Implement post case to contract
 * TODO: Hide component if account is not connected or acconunt is not member of jurisdiction
 * TODO: Display loading components if data is processing
 */
export default function JurisdictionCaseCreator() {
  const { showToastSuccess, showToastError } = useToasts();
  const { getActions } = useAction();
  const { getRules } = useRule();
  const { getJurisdictionMemberProfiles } = useProfile();

  const [isOpen, setIsOpen] = useState(false);
  const [actions, setActions] = useState(false);
  const [rules, setRules] = useState(false);
  const [members, setMembers] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedRule, setSelectedRule] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedAffected, setSelectedAffected] = useState(null);

  async function open() {
    setIsOpen(true);
    loadActions();
  }

  async function close() {
    setIsOpen(false);
    // Clear data
    setActions(null);
    setRules(null);
    setMembers(null);
    // Clear selectors
    setSelectedAction(null);
    setSelectedRule(null);
    setSelectedSubject(null);
    setSelectedAffected(null);
  }

  async function loadActions() {
    try {
      setActions(await getActions());
    } catch (error) {
      showToastError(error);
    }
  }

  async function selectAction(index) {
    try {
      setSelectedAction(index);
      setRules(await getRules(actions[index].guid));
      // Clear next selectors
      setSelectedRule(null);
      setSelectedSubject(null);
      setSelectedAffected(null);
    } catch (error) {
      showToastError(error);
    }
  }

  async function selectRule(index) {
    try {
      setSelectedRule(index);
      setMembers(await getJurisdictionMemberProfiles());
      // Clear next selectors
      setSelectedSubject(null);
      setSelectedAffected(null);
    } catch (error) {
      showToastError(error);
    }
  }

  function selectSubject(index) {
    setSelectedSubject(index);
  }

  function selectAffected(index) {
    setSelectedAffected(index);
  }

  function submit() {
    const formData = {
      action: actions[selectedAction],
      rule: rules[selectedRule],
      subject: members[selectedSubject],
      affected: members[selectedAffected],
    };
    console.log('[Dev] formData:', formData);
    showToastSuccess('Success!');
    close();
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
          {actions && (
            <Box>
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
          {members && (
            <>
              <Box sx={{ mt: 4 }}>
                <Typography sx={{ fontWeight: 'bold' }}>Subject</Typography>
                <Divider sx={{ my: 1.5 }} />
                <List>
                  {members.map((member, index) => (
                    <ListItemButton
                      key={index}
                      selected={selectedSubject === index}
                      onClick={() => selectSubject(index)}
                    >
                      <pre>{JSON.stringify(member, null, 2)}</pre>
                    </ListItemButton>
                  ))}
                </List>
              </Box>
              <Box sx={{ mt: 4 }}>
                <Typography sx={{ fontWeight: 'bold' }}>Affected</Typography>
                <Divider sx={{ my: 1.5 }} />
                {members.map((member, index) => (
                  <ListItemButton
                    key={index}
                    selected={selectedAffected === index}
                    onClick={() => selectAffected(index)}
                  >
                    <pre>{JSON.stringify(member, null, 2)}</pre>
                  </ListItemButton>
                ))}
              </Box>
            </>
          )}
          {selectedSubject != null && selectedAffected != null && (
            <Box sx={{ mt: 4 }}>
              <Button variant="contained" onClick={submit}>
                Create Case
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
