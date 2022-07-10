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
import RuleMetadata from 'classes/metadata/RuleMetadata';
import ActionSelect from 'components/form/widget/ActionSelect';
import IconSelect from 'components/form/widget/IconSelect';
import { REPUTATION_DOMAIN, REPUTATION_RATING } from 'constants/contracts';
import useJuridictionContract from 'hooks/contracts/useJurisdictionContract';
import useErrors from 'hooks/useErrors';
import useIpfs from 'hooks/useIpfs';
import useToasts from 'hooks/useToasts';
import { capitalize } from 'lodash';
import { useState } from 'react';

/**
 * A dialog for adding a jurisdiction rule.
 *
 * TODO: Move strings to localization file.
 */
export default function RuleAddDialog({ jurisdiction, isClose, onClose }) {
  const { handleError } = useErrors();
  const { showToastSuccess } = useToasts();
  const { addRule } = useJuridictionContract();
  const { uploadJsonToIPFS } = useIpfs();
  const [formData, setFormData] = useState({});
  const [isOpen, setIsOpen] = useState(!isClose);
  const [isLoading, setIsLoading] = useState(false);

  const schema = {
    type: 'object',
    required: ['about', 'affected', 'name'],
    properties: {
      about: {
        type: 'string',
        title: 'Action',
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
      name: {
        type: 'string',
        title: 'Name to display',
      },
      description: {
        type: 'string',
        title: 'Description to display',
      },
      icon: {
        type: 'string',
        title: 'Icon to display',
      },
      evidenceDescription: {
        type: 'string',
        title: 'Evidence description, examples, requirements',
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
              default: 3,
              minimum: 1,
            },
            direction: {
              type: 'boolean',
              title: 'Is positive',
              default: REPUTATION_RATING.negative.direction,
            },
          },
        },
      },
      ruling: {
        type: 'string',
        title: 'Ruling',
        default: 'judge',
      },
      evidence: {
        type: 'boolean',
        title: 'Evidence required',
        default: true,
      },
      witness: {
        type: 'integer',
        title: 'Witnesses',
        default: 1,
      },
    },
  };

  const uiSchema = {
    about: {
      'ui:widget': 'ActionSelect',
    },
    affected: {
      'ui:placeholder': 'investor',
    },
    negation: {
      'ui:disabled': true,
      'ui:widget': 'hidden',
    },
    name: {
      'ui:placeholder': 'Investor lost all investments',
    },
    icon: {
      'ui:widget': 'IconSelect',
    },
    evidenceDescription: {
      'ui:placeholder': 'Copy of contract',
    },
    ruling: {
      'ui:disabled': true,
      'ui:widget': 'hidden',
    },
    witness: {
      'ui:widget': 'updown',
    },
  };

  const widgets = {
    ActionSelect: ActionSelect,
    IconSelect: IconSelect,
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
      const { url: ruleMetadataUri } = await uploadJsonToIPFS(
        new RuleMetadata(
          formData.name,
          formData.description,
          formData.icon,
          formData.evidenceDescription,
        ),
      );
      await addRule(
        jurisdiction?.id,
        {
          about: formData.about,
          affected: formData.affected,
          negation: formData.negation,
          uri: ruleMetadataUri,
        },
        {
          ruling: formData.ruling,
          evidence: formData.evidence,
          witness: formData.witness,
        },
        formData.effects,
      );
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
      <DialogTitle>Add Rule</DialogTitle>
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
                  Add
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
