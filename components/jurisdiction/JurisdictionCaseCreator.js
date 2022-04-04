import { useEffect, useState } from 'react';
import { AddBoxOutlined, ArrowForwardOutlined } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { MuiForm5 as Form } from '@rjsf/material-ui';
import useAction from 'hooks/useAction';
import useProfile from 'hooks/useProfile';
import useRule from 'hooks/useRule';
import useToasts from 'hooks/useToasts';
import { getTraitValue, traitTypes } from 'utils/metadata';

/**
 * A component with a form to create jurisdiction case.
 *
 * TODO: Create pretty visual components instead of json
 * TODO: Implement post case to contract
 * TODO: Hide component if account is not connected or acconunt is not member of jurisdiction
 * TODO: Improve appearance for form validation errors
 */
export default function JurisdictionCaseCreator() {
  const { showToastSuccess } = useToasts();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});

  const schema = {
    type: 'object',
    properties: {
      actionGuid: {
        type: 'string',
        title: 'Action',
      },
    },
    required: ['actionGuid'],
    dependencies: {
      actionGuid: {
        properties: {
          ruleId: {
            type: 'string',
            title: 'Rule',
          },
        },
        required: ['ruleId'],
      },
      ruleId: {
        properties: {
          subjectProfileAccount: {
            type: 'string',
            title: 'Subject',
          },
          affectedProfileAccount: {
            type: 'string',
            title: 'Affected',
          },
        },
        required: ['subjectProfileAccount', 'affectedProfileAccount'],
      },
    },
  };

  const uiSchema = {
    actionGuid: {
      'ui:widget': 'ActionSelectWidget',
    },
    ruleId: {
      'ui:widget': 'RuleSelectWidget',
    },
    subjectProfileAccount: {
      'ui:widget': 'ProfileSelectWidget',
    },
    affectedProfileAccount: {
      'ui:widget': 'ProfileSelectWidget',
    },
  };

  const widgets = {
    ActionSelectWidget: ActionSelectWidget,
    RuleSelectWidget: RuleSelectWidget,
    ProfileSelectWidget: ProfileSelectWidget,
  };

  async function open() {
    setIsOpen(true);
    setFormData({});
  }

  async function close() {
    setIsOpen(false);
  }

  function handleChange({ formData }) {
    setFormData(formData);
  }

  function handleSubmit({ formData }) {
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
      <Dialog open={isOpen} onClose={close}>
        <DialogTitle>Create New Case</DialogTitle>
        <DialogContent>
          <Form
            schema={schema}
            uiSchema={uiSchema}
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            widgets={widgets}
            formContext={{
              formData: formData,
            }}
            disabled={isLoading}
          >
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Button variant="contained" type="submit">
                Create Case
              </Button>
              <Button variant="outlined" onClick={close}>
                Cancel
              </Button>
            </Stack>
          </Form>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

/**
 * A widget to select action.
 */
function ActionSelectWidget(props) {
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

/**
 * A widget to select rule.
 */
function RuleSelectWidget(props) {
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

/**
 * A widget to select profile.
 */
function ProfileSelectWidget(props) {
  const propsValue = props.value;
  const propsLabel = props.label;
  const propsOnChange = props.onChange;
  const propsFormRuleId = props.formContext?.formData?.ruleId;
  const { showToastError } = useToasts();
  const { getJurisdictionMemberProfiles } = useProfile();
  const [profiles, setProfiles] = useState(null);

  async function loadProfiles() {
    try {
      setProfiles(null);
      setProfiles(await getJurisdictionMemberProfiles());
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    if (propsFormRuleId) {
      loadProfiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propsFormRuleId]);

  return (
    <Box>
      <Typography sx={{ fontWeight: 'bold' }}>{propsLabel}</Typography>
      <Divider sx={{ my: 1.5 }} />
      {profiles ? (
        <List>
          {profiles.map((profile, index) => (
            <ListItemButton
              key={index}
              selected={propsValue === profile.account}
              onClick={() => propsOnChange(profile.account)}
            >
              <ListItemAvatar>
                <Avatar src={profile.avatarNftMetadata?.image} />
              </ListItemAvatar>
              <Stack direction="column">
                <Typography>
                  {getTraitValue(
                    profile.avatarNftMetadata,
                    traitTypes.firstName,
                  ) || 'None'}{' '}
                  {getTraitValue(
                    profile.avatarNftMetadata,
                    traitTypes.lastName,
                  ) || 'None'}
                </Typography>
              </Stack>
            </ListItemButton>
          ))}
        </List>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Box>
  );
}
