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
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { handleMakeCaseVerdictEvent } from 'utils/analytics';

/**
 * A component with dialog for make case verdict.
 */
export default function CaseVerdictMakeDialog({
  caseObject,
  caseLaws,
  isClose,
  onClose,
}) {
  const { t } = useTranslation('common');
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
        title: t('input-message-title'),
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
      handleMakeCaseVerdictEvent(caseObject.id);
      showToastSuccess(t('notification-data-is-successfully-updated'));
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
        caseLawRules.map((rule) => {
          let ruleName = rule?.rule?.uriData?.name || 'None Rule Name';
          if (rule?.rule?.uriData?.description) {
            ruleName = `${ruleName} / ${rule.rule.uriData.description}`;
          }
          return ruleName;
        }),
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
      <DialogTitle>{t('dialog-case-make-verdict-title')}</DialogTitle>
      <DialogContent>
        <Typography>{t('dialog-case-make-verdict-description')}</Typography>
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
                {t('text-processing')}
              </LoadingButton>
            ) : (
              <>
                <Button variant="contained" type="submit">
                  {t('button-case-make-verdict')}
                </Button>
                <Button variant="outlined" onClick={onClose}>
                  {t('button-cancel')}
                </Button>
              </>
            )}
          </Stack>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
