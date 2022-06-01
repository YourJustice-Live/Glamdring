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
import ActionSelect from 'components/form/widget/ActionSelect';
import MetadataInput from 'components/form/widget/MetadataInput';
import { REPUTATION_DOMAIN, REPUTATION_RATING } from 'constants/contracts';
import useJuridictionContract from 'hooks/contracts/useJurisdictionContract';
import useErrors from 'hooks/useErrors';
import useToasts from 'hooks/useToasts';
import { capitalize } from 'lodash';
import { useState } from 'react';

/**
 * A dialog for adding a jurisdiction rule or updating a specified rule.
 */
export default function RuleManageDialog({
  jurisdiction,
  about,
  rule,
  isClose,
  onClose,
}) {
  const { handleError } = useErrors();
  const { showToastSuccess } = useToasts();
  const { addRule, updateRule } = useJuridictionContract();
  const [formData, setFormData] = useState(rule || {});
  const [isOpen, setIsOpen] = useState(!isClose);
  const [isLoading, setIsLoading] = useState(false);

  const schema = {
    type: 'object',
    required: [...(rule ? ['ruleId'] : [])],
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
        required: ['about', 'affected', 'uri'],
        properties: {
          about: {
            type: 'string',
            title: 'Action',
            ...(about && {
              default: about,
            }),
          },
          affected: {
            type: 'string',
            title: 'Affected',
          },
          negation: {
            type: 'boolean',
            title: 'Negation',
            default: false,
          },
          uri: {
            type: 'string',
            title: 'Metadata',
          },
        },
      },
      effects: {
        type: 'array',
        minItems: 1,
        title: 'Effects',
        description: 'At least 1 element must be defined',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              title: 'Domain',
              default: REPUTATION_DOMAIN.community.name,
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
              default: 2,
              minimum: 1,
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
      about: {
        'ui:widget': 'ActionSelect',
      },
      affected: {
        'ui:placeholder': 'investor',
      },
      negation: {
        'ui:disabled': false,
      },
      uri: {
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
          requiredFields: ['name'],
        },
      },
    },
    confirmation: {
      ruling: {
        'ui:disabled': true,
      },
      witness: {
        'ui:widget': 'updown',
      },
    },
  };

  const widgets = {
    ActionSelect: ActionSelect,
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
        await updateRule(
          jurisdiction?.id,
          formData.ruleId,
          formData.rule,
          formData.effects,
        );
      } else {
        await addRule(
          jurisdiction?.id,
          formData.rule,
          formData.confirmation,
          formData.effects,
        );
      }
      showToastSuccess('Success! Data will be updated soon.');
      close();
    } catch (error) {
      handleError(error, true);
      setIsLoading(false);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={isLoading ? null : close}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>{rule ? 'Update Rule' : 'Add Rule'}</DialogTitle>
      <DialogContent>
        <Form
          schema={schema}
          formData={formData}
          uiSchema={uiSchema}
          widgets={widgets}
          onSubmit={submit}
          disabled={isLoading}
          showErrorList={false}
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
