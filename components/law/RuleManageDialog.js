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
import MetadataInput from 'components/form/widget/MetadataInput';
import useJuridictionContract from 'hooks/contracts/useJurisdictionContract';
import useToasts from 'hooks/useToasts';
import { useState } from 'react';
import { REPUTATION_DOMAIN, REPUTATION_RATING } from 'constants/contracts';
import { capitalize } from 'lodash';

/**
 * A dialog for adding a jurisdiction rule or updating a specified rule.
 */
export default function RuleManageDialog({ about, rule, isClose, onClose }) {
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
        ruleId: {
          type: 'string',
          title: 'Rule ID',
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
            ...(about && {
              default: about,
            }),
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
            title: 'Metadata',
            default: '',
          },
        },
      },
      effects: {
        type: 'array',
        minItems: 1,
        title: 'Effects',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              title: 'Domain',
              default: REPUTATION_DOMAIN.environment.name,
              enum: [
                REPUTATION_DOMAIN.environment.name,
                REPUTATION_DOMAIN.personal.name,
                REPUTATION_DOMAIN.community.name,
                REPUTATION_DOMAIN.professional.name,
              ],
              enumNames: [
                capitalize(REPUTATION_DOMAIN.environment.name),
                capitalize(REPUTATION_DOMAIN.personal.name),
                capitalize(REPUTATION_DOMAIN.community.name),
                capitalize(REPUTATION_DOMAIN.professional.name),
              ],
            },
            value: {
              type: 'integer',
              title: 'Value',
              default: 0,
              minimum: 0,
              maximum: 20,
            },
            direction: {
              type: 'boolean',
              title: 'Is Positive',
              default: REPUTATION_RATING.negative.direction,
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
              default: 'judge',
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
    ruleId: {
      'ui:disabled': true,
    },
    rule: {
      affected: {
        'ui:emptyValue': '',
        'ui:placeholder': 'investor',
      },
      negation: {
        'ui:disabled': true,
      },
      uri: {
        'ui:emptyValue': '',
        'ui:widget': 'MetadataInput',
        'ui:options': {
          subLabel:
            'Rule name, description, evidence description, examples, requirements',
          fields: {
            name: {
              type: 'string',
              title: 'Name',
            },
            description: {
              type: 'string',
              title: 'Description',
            },
            evidenceDescription: {
              type: 'string',
              title: 'Evidence description, examples, requirements',
            },
          },
          requiredFields: ['name', 'description'],
        },
      },
    },
    effects: {
      items: {
        value: { 'ui:widget': 'range' },
      },
    },
    confirmation: {
      ruling: {
        'ui:placeholder': 'judge',
        'ui:disabled': true,
      },
      witness: {
        'ui:widget': 'updown',
      },
    },
  };

  const widgets = {
    MetadataInput: MetadataInput,
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
        await updateRule(formData.ruleId, formData.rule, formData.effects);
      } else {
        await addRule(formData.rule, formData.confirmation, formData.effects);
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
