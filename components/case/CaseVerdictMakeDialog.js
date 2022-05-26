import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { MuiForm5 as Form } from '@rjsf/material-ui';
import VerdictMetadata from 'classes/metadata/VerdictMetadata';
import useCaseContract from 'hooks/contracts/useCaseContract';
import useErrors from 'hooks/useErrors';
import useIpfs from 'hooks/useIpfs';
import useToasts from 'hooks/useToasts';
import { useEffect, useState } from 'react';

/**
 * A component with dialog for make case verdict.
 */
export default function CaseVerdictMakeDialog({
  caseObject,
  caseLaws,
  isClose,
  onClose,
}) {
  const { handleError } = useErrors();
  const { showToastSuccess } = useToasts();
  const { uploadJsonToIPFS } = useIpfs();
  const { setStageClosed } = useCaseContract();
  const [ruleIds, setRuleids] = useState([]);
  const [ruleNames, setRuleNames] = useState([]);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!isClose);

  const schema = {
    type: 'object',
    required: ['message'],
    properties: {
      confirmedRules: {
        type: 'array',
        title: ' ',
        items: {
          type: 'string',
          enum: ruleIds,
          enumNames: ruleNames,
        },
        uniqueItems: true,
        default: [],
      },
      message: {
        type: 'string',
        title: 'Message',
      },
    },
  };

  const uiSchema = {
    confirmedRules: {
      'ui:widget': 'checkboxes',
    },
  };

  async function close() {
    setFormData({});
    setIsLoading(false);
    setIsOpen(false);
    onClose();
  }

  async function submit({ formData }) {
    try {
      setFormData(formData);
      setIsLoading(true);
      // Upload verdict metadata to ipfs
      const { url: verdictMetadataUri } = await uploadJsonToIPFS(
        new VerdictMetadata(formData.message),
      );
      // Create verdict using confirmed rules
      const verdict = caseObject?.rules?.map((caseRule, index) => {
        return {
          ruleId: index + 1,
          decision: formData.confirmedRules.includes(caseRule.ruleId),
        };
      });
      // Use contract
      await setStageClosed(caseObject.id, verdict, verdictMetadataUri);
      showToastSuccess('Success! Data will be updated soon.');
      close();
    } catch (error) {
      handleError(error, true);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (caseLaws) {
      // Get rule ids and rule names for form from case laws
      const caseLawValues = Array.from(caseLaws.values());
      const caseLawRules = caseLawValues.reduce(
        (caseRules, caseLaw) => [...caseRules, ...caseLaw.rules],
        [],
      );
      setRuleids(caseLawRules.map((rule) => rule.ruleId));
      setRuleNames(
        caseLawRules.map(
          (rule) =>
            `${rule.rule.uriData.name} / ${rule.rule.uriData.description}`,
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseLaws]);

  return (
    <Dialog
      open={isOpen}
      onClose={isLoading ? null : close}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Make Verdict</DialogTitle>
      <DialogContent>
        <Typography>
          Select the rules you confirm and write a message for your verdict.
        </Typography>
        <Divider sx={{ mt: 2 }} />
        <Form
          schema={schema}
          uiSchema={uiSchema}
          formData={formData}
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
                  Make Verdict
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
