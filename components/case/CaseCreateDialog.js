import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { MuiForm5 as Form } from '@rjsf/material-ui';
import CaseActionSelect from 'components/form/widget/CaseActionSelect';
import CaseEvidencePostInput from 'components/form/widget/CaseEvidencePostInput';
import CaseNameInput from 'components/form/widget/CaseNameInput';
import CaseRuleSelect from 'components/form/widget/CaseRuleSelect';
import CaseRulingInput from 'components/form/widget/CaseRulingInput';
import CaseWitnessesSelect from 'components/form/widget/CaseWitnessesSelect';
import ProfileSelect from 'components/form/widget/ProfileSelect';
import useJuridictionContract from 'hooks/contracts/useJurisdictionContract';
import useJurisdiction from 'hooks/useJurisdiction';
import useLaw from 'hooks/useLaw';
import useToasts from 'hooks/useToasts';
import useWeb3Context from 'hooks/useWeb3Context';
import { IconWallet } from 'icons';
import { capitalize } from 'lodash';
import { useEffect, useState } from 'react';
import { palette } from 'theme/palette';

/**
 * A component with a dialog to create a case.
 *
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
  const { getJurisdiction } = useJurisdiction();
  const { getLawsByJurisdiction } = useLaw();
  const [isOpen, setIsOpen] = useState(!isClose);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jurisdiction, setJurisdiction] = useState(null);
  const [jurisdictionLaws, setJurisdictionLaws] = useState(null);
  const [formData, setFormData] = useState({
    ...(subjectProfile && { subjectProfileAccount: subjectProfile?.account }),
    ...(affectedProfile && {
      affectedProfileAccount: affectedProfile?.account,
    }),
  });
  const [formAction, setFormAction] = useState(null);
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
          name: {
            type: 'string',
            title: 'Name',
          },
          ruleId: {
            type: 'string',
            title: 'Rule',
          },
        },
        required: ['name', 'ruleId'],
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
          },
          witnessProfileAccounts: {
            type: 'array',
            title: 'Witnesses',
            items: {
              type: 'string',
            },
            default: [],
          },
          ruling: {
            title: 'Ruling',
            type: 'string',
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
    name: {
      'ui:widget': 'CaseNameInput',
      'ui:options': {
        inputLabel: 'Describe the case',
      },
    },
    ruleId: {
      'ui:widget': 'CaseRuleSelect',
    },
    subjectProfileAccount: {
      'ui:widget': 'ProfileSelect',
      'ui:options': {
        subLabel: capitalize(formAction?.action?.subject),
      },
    },
    affectedProfileAccount: {
      'ui:widget': 'ProfileSelect',
      'ui:options': {
        subLabel: capitalize(formRule?.rule?.affected),
      },
    },
    evidencePostUri: {
      'ui:widget': 'CaseEvidencePostInput',
    },
    witnessProfileAccounts: {
      'ui:widget': 'CaseWitnessesSelect',
      'ui:emptyValue': [],
      'ui:options': {
        subLabel: `
          Minimal number of witnesses:
          ${formRule?.confirmation?.witness || 0}
        `,
      },
    },
    ruling: {
      'ui:widget': 'CaseRulingInput',
      'ui:options': {
        type: formRule?.confirmation?.ruling,
      },
    },
  };

  const widgets = {
    CaseActionSelect: CaseActionSelect,
    CaseRuleSelect: CaseRuleSelect,
    ProfileSelect: ProfileSelect,
    CaseEvidencePostInput: CaseEvidencePostInput,
    CaseWitnessesSelect: CaseWitnessesSelect,
    CaseNameInput: CaseNameInput,
    CaseRulingInput: CaseRulingInput,
  };

  async function loadData() {
    try {
      setJurisdiction(
        await getJurisdiction(
          process.env.NEXT_PUBLIC_JURISDICTION_CONTRACT_ADDRESS,
        ),
      );
      setJurisdictionLaws(
        await getLawsByJurisdiction(
          process.env.NEXT_PUBLIC_JURISDICTION_CONTRACT_ADDRESS,
        ),
      );
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
      delete changedFormData.name;
      delete changedFormData.ruleId;
      delete changedFormData.evidencePostUri;
      delete changedFormData.witnessProfileAccounts;
    }
    // If action changed then clear dependent form fields
    if (formData.actionGuid !== changedFormData.actionGuid) {
      delete changedFormData.name;
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
    // Update action rule state if action defined
    if (changedFormData.actionGuid) {
      let formAction;
      [...jurisdictionLaws.keys()].forEach((key) => {
        if (
          jurisdictionLaws.get(key).action.guid === changedFormData.actionGuid
        ) {
          formAction = jurisdictionLaws.get(key).action;
        }
      });
      setFormAction(formAction);
    }
    // Update form rule state if rule defined
    if (changedFormData.ruleId) {
      let formRule;
      [...jurisdictionLaws.keys()].forEach((key) => {
        jurisdictionLaws.get(key).rules.forEach((rule) => {
          if (rule.ruleId === changedFormData.ruleId) {
            formRule = rule;
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
      const caseName = submittedFormData.name;
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
      if (submittedFormData.evidencePostUri) {
        casePosts.push({
          entRole: 'admin',
          uri: submittedFormData.evidencePostUri,
        });
      }
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
              <>
                <Stack direction="row" spacing={2} sx={{ mt: 1.5 }}>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    Jurisdiction
                  </Typography>
                  <Avatar
                    sx={{
                      width: 22,
                      height: 22,
                      bgcolor: 'primary.main',
                      fontSize: 14,
                    }}
                    src={jurisdiction.image}
                  >
                    J
                  </Avatar>
                  <Typography>{jurisdiction.name}</Typography>
                </Stack>
                <Divider sx={{ mt: 1.5 }} />
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
              </>
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
