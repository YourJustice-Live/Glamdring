import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { MuiForm5 as Form } from '@rjsf/material-ui';
import CaseActionSelect from 'components/form/widget/CaseActionSelect';
import CaseEvidencePostInput from 'components/form/widget/CaseEvidencePostInput';
import CaseProfileSelect from 'components/form/widget/CaseProfileSelect';
import CaseRuleSelect from 'components/form/widget/CaseRuleSelect';
import CaseWitnessesSelect from 'components/form/widget/CaseWitnessesSelect';
import useJuridictionContract from 'hooks/contracts/useJurisdictionContract';
import useToasts from 'hooks/useToasts';
import useWeb3Context from 'hooks/useWeb3Context';
import { IconWallet } from 'icons';
import { useEffect, useState } from 'react';
import { palette } from 'theme/palette';
import useLaw from 'hooks/useLaw';
import { LoadingButton } from '@mui/lab';
import { Save } from '@mui/icons-material';

/**
 * A component with a dialog to create a case.
 */
export default function CaseCreateDialog({
  subjectProfile,
  affectedProfile,
  isClose,
  onClose,
}) {
  const { accountProfile, connectWallet } = useWeb3Context();
  const { showToastSuccess, showToastError } = useToasts();
  const { makeCase } = useJuridictionContract();
  const { getJurisdictionLaws } = useLaw();
  const [isOpen, setIsOpen] = useState(!isClose);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jurisdictionLaws, setJurisdictionLaws] = useState(null);
  const [formData, setFormData] = useState({
    ...(subjectProfile && { subjectProfileAccount: subjectProfile?.account }),
    ...(affectedProfile && {
      affectedProfileAccount: affectedProfile?.account,
    }),
  });
  const [formRule, setFormRule] = useState(null);

  const schema = {
    type: 'object',
    properties: {
      category: {
        type: 'string',
        title: '',
        enum: ['positive', 'negative'],
        enumNames: ['Positive', 'Negative'],
        default: 'positive',
      },
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
          evidencePostUri: {
            type: 'string',
            title: 'Evidence',
            default: '',
          },
          witnessProfileAccounts: {
            type: 'array',
            title: 'Witnesses',
            items: {
              type: 'string',
            },
            default: [],
          },
        },
        required: ['subjectProfileAccount', 'affectedProfileAccount'],
      },
    },
  };

  const uiSchema = {
    category: {
      'ui:widget': 'radio',
      'ui:options': {
        inline: true,
      },
    },
    actionGuid: {
      'ui:widget': 'CaseActionSelect',
    },
    ruleId: {
      'ui:widget': 'CaseRuleSelect',
    },
    subjectProfileAccount: {
      'ui:widget': 'CaseProfileSelect',
    },
    affectedProfileAccount: {
      'ui:widget': 'CaseProfileSelect',
    },
    evidencePostUri: {
      'ui:widget': 'CaseEvidencePostInput',
      'ui:emptyValue': '',
    },
    witnessProfileAccounts: {
      'ui:widget': 'CaseWitnessesSelect',
      'ui:emptyValue': [],
    },
  };

  const widgets = {
    CaseActionSelect: CaseActionSelect,
    CaseRuleSelect: CaseRuleSelect,
    CaseProfileSelect: CaseProfileSelect,
    CaseEvidencePostInput: CaseEvidencePostInput,
    CaseWitnessesSelect: CaseWitnessesSelect,
  };

  async function loadData() {
    try {
      setJurisdictionLaws(await getJurisdictionLaws());
    } catch (error) {
      showToastError(error);
    } finally {
      setIsLoading(false);
    }
  }

  function close() {
    setIsOpen(false);
    onClose();
  }

  function handleChange({ formData: changedFormData }) {
    // If category changed then clear dependent form fields
    if (formData.category !== changedFormData.category) {
      delete changedFormData.actionGuid;
      delete changedFormData.ruleId;
      delete changedFormData.evidencePostUri;
      delete changedFormData.witnessProfileAccounts;
    }
    // If action changed then clear dependent form fields
    if (formData.actionGuid !== changedFormData.actionGuid) {
      delete changedFormData.ruleId;
      delete changedFormData.evidencePostUri;
      delete changedFormData.witnessProfileAccounts;
    }
    // If rule changed then clear dependent form fields
    if (formData.ruleId !== changedFormData.ruleId) {
      delete changedFormData.evidencePostUri;
      delete changedFormData.witnessProfileAccounts;
    }
    // Update state of form data
    setFormData(changedFormData);
    // Update state of form rule if defined
    if (changedFormData.ruleId) {
      let formRule;
      [...jurisdictionLaws.keys()].forEach((key) => {
        jurisdictionLaws.get(key).rules.forEach((lawRule) => {
          if (lawRule.rule.id === changedFormData.ruleId) {
            formRule = lawRule.rule;
          }
        });
      });
      setFormRule(formRule);
    }
  }

  async function handleSubmit({ formData: submittedFormData }) {
    try {
      setIsSubmitting(true);
      setFormData(submittedFormData);
      // Check witness count
      const formRuleWitness = Number(formRule?.confirmation?.witness);
      if (submittedFormData.witnessProfileAccounts.length < formRuleWitness) {
        throw new Error(`Minimal number of witnesses: ${formRuleWitness}`);
      }
      // Define case params
      const caseName = 'TEST_CASE';
      const caseRules = [];
      caseRules.push({
        jurisdiction: process.env.NEXT_PUBLIC_JURISDICTION_CONTRACT_ADDRESS,
        ruleId: submittedFormData.ruleId,
      });
      const caseRoles = [];
      caseRoles.push({
        account: submittedFormData.subjectProfileAccount,
        role: 'subject',
      });
      caseRoles.push({
        account: submittedFormData.affectedProfileAccount,
        role: 'affected',
      });
      for (const witnessProfileAccount of submittedFormData.witnessProfileAccounts) {
        caseRoles.push({
          account: witnessProfileAccount,
          role: 'witness',
        });
      }
      const casePosts = [];
      casePosts.push({
        entRole: 'admin',
        uri: submittedFormData.evidencePostUri,
      });
      // Make case
      await makeCase(caseName, caseRules, caseRoles, casePosts);
      showToastSuccess('Success! Data will be updated soon.');
      close();
    } catch (error) {
      showToastError(error);
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {accountProfile ? (
        <Dialog open={isOpen} onClose={close}>
          <DialogTitle>Create New Case</DialogTitle>
          <DialogContent>
            {isLoading ? (
              <Typography>Loading...</Typography>
            ) : (
              <Form
                schema={schema}
                uiSchema={uiSchema}
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                widgets={widgets}
                formContext={{
                  laws: jurisdictionLaws,
                  formData: formData,
                  formRule: formRule,
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <LoadingButton
                      loading
                      loadingPosition="start"
                      startIcon={<Save />}
                      variant="outlined"
                    >
                      Submitting
                    </LoadingButton>
                  </>
                ) : (
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                      Create Case
                    </Button>
                    <Button variant="outlined" onClick={close}>
                      Cancel
                    </Button>
                  </Stack>
                )}
              </Form>
            )}
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog open={isOpen} onClose={close}>
          <DialogTitle>Create New Case</DialogTitle>
          <DialogContent>
            <Typography>
              To create case and add score you need to connect wallet and create
              own profile.
            </Typography>
            <Button
              sx={{ mt: 4 }}
              variant="contained"
              onClick={() => {
                connectWallet();
                close();
              }}
              startIcon={<IconWallet hexColor={palette.primary.contrastText} />}
            >
              Connect Wallet
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
