import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import { MuiForm5 as Form } from '@rjsf/material-ui';
import DataUriInput from 'components/form/widget/DataUriInput';
import useJuridictionContract from 'hooks/contracts/useJurisdictionContract';
import useToasts from 'hooks/useToasts';
import { useState } from 'react';

/**
 * A dialog for adding a rule or updating a specified rule.
 */
export default function RuleManageDialog({ rule, isClose, onClose }) {
  const { showToastSuccess, showToastError } = useToasts();
  const { addRule, updateRule } = useJuridictionContract();
  const [formData, setFormData] = useState(rule || {});
  const [isOpen, setIsOpen] = useState(!isClose);
  const [isLoading, setIsLoading] = useState(false);

  const schema = {
    type: 'object',
    properties: {
      // Show id scheme only for updating a rule
      ...(rule && {
        id: {
          type: 'string',
          title: 'ID',
        },
      }),
      rule: {
        type: 'object',
        title: 'Rule',
        required: ['about'],
        properties: {
          about: {
            type: 'string',
            title: 'About (Action GUID)',
          },
          affected: {
            type: 'string',
            title: 'Affected',
            default: '',
          },
          negation: {
            type: 'boolean',
            title: 'Negation',
            default: false,
          },
          uri: {
            type: 'string',
            title: 'Additional Data',
            default: '',
          },
          effects: {
            type: 'object',
            title: 'Effects',
            properties: {
              environmental: {
                type: 'integer',
                title: 'Environmental',
                default: 0,
              },
              professional: {
                type: 'integer',
                title: 'Professional',
                default: 0,
              },
              social: {
                type: 'integer',
                title: 'Social',
                default: 0,
              },
              personal: {
                type: 'integer',
                title: 'Personal',
                default: 0,
              },
            },
          },
        },
      },
      // Show confirmation scheme only for adding a rule
      ...(!rule && {
        confirmation: {
          type: 'object',
          title: 'Confirmation',
          properties: {
            ruling: {
              type: 'string',
              title: 'Ruling',
              default: '',
            },
            evidence: {
              type: 'boolean',
              title: 'Evidence',
              default: true,
            },
            witness: {
              type: 'integer',
              title: 'Witness',
              default: 1,
            },
          },
        },
      }),
    },
  };

  const uiSchema = {
    id: {
      'ui:disabled': true,
    },
    rule: {
      affected: {
        'ui:emptyValue': '',
        'ui:placeholder': 'investor',
      },
      uri: {
        'ui:emptyValue': '',
        'ui:widget': 'DataUriInput',
      },
      effects: {
        environmental: { 'ui:widget': 'updown' },
        professional: { 'ui:widget': 'updown' },
        social: { 'ui:widget': 'updown' },
        personal: { 'ui:widget': 'updown' },
      },
    },
    confirmation: {
      ruling: {
        'ui:emptyValue': '',
        'ui:placeholder': 'judge',
      },
      witness: {
        'ui:widget': 'updown',
      },
    },
  };

  const widgets = {
    DataUriInput: DataUriInput,
  };

  function close() {
    setFormData({});
    setIsLoading(false);
    setIsOpen(false);
    onClose();
  }

  async function submit({ formData }) {
    try {
      setFormData(formData);
      setIsLoading(true);
      if (rule) {
        await updateRule(formData.id, formData.rule);
      } else {
        await addRule(formData.rule, formData.confirmation);
      }
      showToastSuccess('Success! Data will be updated soon.');
      close();
    } catch (error) {
      showToastError(error);
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onClose={isLoading ? null : close}>
      <DialogTitle>{rule ? 'Update Rule' : 'Add Rule'}</DialogTitle>
      <DialogContent>
        <Form
          schema={schema}
          formData={formData}
          uiSchema={uiSchema}
          widgets={widgets}
          onSubmit={submit}
          disabled={isLoading}
        >
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            {isLoading ? (
              <LoadingButton
                loading
                loadingPosition="start"
                startIcon={<Save />}
                variant="outlined"
              >
                Processing
              </LoadingButton>
            ) : (
              <>
                <Button variant="contained" type="submit">
                  {rule ? 'Update Rule' : 'Add Rule'}
                </Button>
                <Button variant="outlined" onClick={onClose}>
                  Cancel
                </Button>
              </>
            )}
          </Stack>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
