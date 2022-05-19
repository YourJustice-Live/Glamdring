import { InfoOutlined, Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Link,
  Skeleton,
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
import { CASE_ROLE, JURISDICTION_ROLE } from 'constants/contracts';
import useJuridictionContract from 'hooks/contracts/useJurisdictionContract';
import useJurisdiction from 'hooks/useJurisdiction';
import useToasts from 'hooks/useToasts';
import useWeb3Context from 'hooks/useWeb3Context';
import { IconProfile, IconWallet } from 'icons';
import { capitalize } from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { palette } from 'theme/palette';
import NextLink from 'next/link';
import useDialogContext from 'hooks/useDialogContext';
import FeedbackPostDialog from 'components/feedback/FeedbackPostDialog';
import { FORM } from 'constants/feedbacks';
import useAction from 'hooks/useAction';

/**
 * A component with a dialog to create a case.
 *
 * @typedef {import('../classes/Jurisdiction').Jurisdiction} Jurisdiction
 * @typedef {import('../classes/Profile').Profile} Profile
 *
 * @param {object} params Params.
 * @param {Jurisdiction} params.jurisdiction Jurisdiction. If not defined then will be used main jurisdiction.
 * @param {Profile} params.subjectProfile Subject profile. If not defined then this fild will be empty.
 * @param {Profile} params.affectedProfile Affected profile. If not defined then this fild will be empty.
 * @param {boolean} params.isClose Init status for dialog.
 * @param {Function} params.onClose Callback function when dialog is closed.
 * @returns Dialog component.
 */
export default function CaseCreateDialog({
  jurisdiction: paramsJurisdiction,
  subjectProfile,
  affectedProfile,
  isClose,
  onClose,
}) {
  const STATUS = {
    isLoading: 0,
    isAccountRequired: 1,
    isAccountProfileRequired: 2,
    isJoiningToJurisdictionRequired: 3,
    isFormAvailable: 4,
    isFormSubmitting: 5,
  };

  const router = useRouter();
  const { account, accountProfile, connectWallet } = useWeb3Context();
  const { showDialog, closeDialog } = useDialogContext();
  const { showToastSuccess, showToastError } = useToasts();
  const { makeCase } = useJuridictionContract();
  const { getJurisdiction, getJurisdictionRule, isAccountHasJurisdictionRole } =
    useJurisdiction();
  const { getAction } = useAction();
  const [isOpen, setIsOpen] = useState(!isClose);
  const [status, setStatus] = useState(STATUS.isLoading);
  const [jurisdiction, setJurisdiction] = useState(paramsJurisdiction);
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
      isPositive: {
        type: 'boolean',
        title: '',
        enumNames: ['Positive Laws', 'Negative Laws'],
        default: true,
      },
      actionGuid: {
        type: 'string',
      },
    },
    required: ['actionGuid'],
    dependencies: {
      actionGuid: {
        properties: {
          name: {
            type: 'string',
            title: 'Description',
          },
          ruleId: {
            type: 'string',
          },
        },
        required: ['name', 'ruleId'],
      },
      ruleId: {
        properties: {
          subjectProfileAccount: {
            type: 'string',
            title: 'Acted',
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
        required: [
          'subjectProfileAccount',
          'affectedProfileAccount',
          formRule?.confirmation?.evidence && 'evidencePostUri',
        ],
      },
    },
  };

  const uiSchema = {
    isPositive: {
      'ui:widget': 'radio',
      'ui:options': {
        inline: true,
      },
    },
    actionGuid: {
      'ui:widget': 'CaseActionSelect',
      'ui:options': {
        header: (
          <>
            <Typography sx={{ fontWeight: 'bold' }}>Action</Typography>
            <Typography variant="body2">
              An action that was done within the law
            </Typography>
            <Divider sx={{ mt: 1.5, mb: 2.5 }} />
          </>
        ),
        footer: (
          <Alert
            severity="info"
            icon={<InfoOutlined color="primary" />}
            sx={{
              borderRadius: '8px',
              background: palette.grey[50],
              boxShadow: 'none',
              mt: 3,
              mb: 0,
            }}
          >
            <AlertTitle>Didn&apos;t find a suitable law?</AlertTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2">
                <NextLink
                  href={`/jurisdiction/${jurisdiction?.id || '#'}`}
                  passHref
                >
                  <Link
                    variant="body2"
                    underline="none"
                    sx={{ mr: 0.5, pb: 0.3 }}
                  >
                    <strong>Look</strong>
                  </Link>
                </NextLink>
                at the list of all laws of the jurisdiction or
                <Link
                  component="button"
                  variant="body2"
                  underline="none"
                  sx={{ ml: 0.5, mr: 0.5, pb: 0.3 }}
                  onClick={() =>
                    showDialog(
                      <FeedbackPostDialog
                        form={FORM.proposeLaw}
                        onClose={closeDialog}
                      />,
                    )
                  }
                >
                  <strong>propose</strong>
                </Link>
                a law that we should add to the jurisdiction.
              </Typography>
            </Box>
          </Alert>
        ),
      },
    },
    name: {
      'ui:widget': 'CaseNameInput',
      'ui:options': {
        inputLabel: 'Describe what happened',
      },
    },
    ruleId: {
      'ui:widget': 'CaseRuleSelect',
      'ui:options': {
        header: (
          <>
            <Typography sx={{ fontWeight: 'bold' }}>Rule</Typography>
            <Typography variant="body2">
              Consequences of acting within the law
            </Typography>
            <Divider sx={{ mt: 1.5, mb: 2.5 }} />
          </>
        ),
      },
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
      'ui:options': {
        subLabel: formRule?.rule?.uriData?.evidenceDescription,
      },
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

  async function loadMainJurisdiction() {
    try {
      setJurisdiction(
        await getJurisdiction(
          process.env.NEXT_PUBLIC_MAIN_JURISDICTION_CONTRACT_ADDRESS,
        ),
      );
    } catch (error) {
      showToastError(error);
      close();
    }
  }

  async function loadData() {
    try {
      // Check that account has jurisdiction role
      if (
        !isAccountHasJurisdictionRole(
          jurisdiction,
          account,
          JURISDICTION_ROLE.member.id,
        )
      ) {
        setStatus(STATUS.isJoiningToJurisdictionRequired);
        return;
      }
      setStatus(STATUS.isFormAvailable);
    } catch (error) {
      showToastError(error);
      close();
    }
  }

  function close() {
    setIsOpen(false);
    onClose();
  }

  function handleChange({ formData: changedFormData }) {
    // If positivity changed
    if (formData.isPositive !== changedFormData.isPositive) {
      // Clear dependent form fields
      delete changedFormData.actionGuid;
      delete changedFormData.name;
      delete changedFormData.ruleId;
      delete changedFormData.evidencePostUri;
      delete changedFormData.witnessProfileAccounts;
    }
    // If action changed
    if (formData.actionGuid !== changedFormData.actionGuid) {
      // Clear dependent form fields
      delete changedFormData.name;
      delete changedFormData.ruleId;
      delete changedFormData.evidencePostUri;
      delete changedFormData.witnessProfileAccounts;
      // Load action by guid
      if (changedFormData.actionGuid) {
        getAction(changedFormData.actionGuid)
          .then((action) => setFormAction(action))
          .catch((error) => console.error(error));
      }
    }
    // If rule changed
    if (formData.ruleId !== changedFormData.ruleId) {
      // Clear dependent form fields
      delete changedFormData.evidencePostUri;
      delete changedFormData.witnessProfileAccounts;
      // Load action by id
      if (changedFormData.ruleId) {
        getJurisdictionRule(jurisdiction.id, changedFormData.ruleId)
          .then((rule) => setFormRule(rule))
          .catch((error) => console.error(error));
      }
    }
    // Update state of form data
    setFormData(changedFormData);
  }

  async function handleSubmit({ formData: submittedFormData }) {
    try {
      setStatus(STATUS.isFormSubmitting);
      setFormData(submittedFormData);
      // Check witness count
      const formRuleWitness = Number(formRule?.confirmation?.witness);
      if (submittedFormData.witnessProfileAccounts.length < formRuleWitness) {
        throw new Error(`Minimal number of witnesses: ${formRuleWitness}`);
      }
      // Define case name
      const caseName = submittedFormData.name;
      // Define case rules
      const caseRules = [];
      caseRules.push({
        jurisdiction: jurisdiction?.id,
        ruleId: submittedFormData.ruleId,
      });
      // Define case roles
      const caseRoles = [];
      caseRoles.push({
        account: submittedFormData.subjectProfileAccount,
        role: CASE_ROLE.subject.name,
      });
      caseRoles.push({
        account: submittedFormData.affectedProfileAccount,
        role: CASE_ROLE.affected.name,
      });
      for (const witnessProfileAccount of submittedFormData.witnessProfileAccounts) {
        caseRoles.push({
          account: witnessProfileAccount,
          role: CASE_ROLE.witness.name,
        });
      }
      // Add jurisdiction judges to case judges
      const jurisdictionJudgeRole = jurisdiction.roles.find(
        (role) => role.roleId === JURISDICTION_ROLE.judge.id,
      );
      const jurisdictionJudgeAccounts = jurisdictionJudgeRole?.accounts || [];
      for (const jurisdictionJudgeAccount of jurisdictionJudgeAccounts) {
        caseRoles.push({
          account: jurisdictionJudgeAccount,
          role: CASE_ROLE.judge.name,
        });
      }
      // Define case posts
      const casePosts = [];
      if (submittedFormData.evidencePostUri) {
        casePosts.push({
          entRole: CASE_ROLE.admin.name,
          uri: submittedFormData.evidencePostUri,
        });
      }
      // Make case
      await makeCase(
        jurisdiction?.id,
        caseName,
        caseRules,
        caseRoles,
        casePosts,
      );
      showToastSuccess('Success! Data will be updated soon.');
      close();
    } catch (error) {
      showToastError(error);
      setStatus(STATUS.isFormAvailable);
    }
  }

  useEffect(() => {
    if (!account) {
      setStatus(STATUS.isAccountRequired);
    } else if (!accountProfile) {
      setStatus(STATUS.isAccountProfileRequired);
    } else if (!jurisdiction) {
      loadMainJurisdiction();
    } else {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jurisdiction]);

  return (
    <Dialog open={isOpen} onClose={close} maxWidth="md" fullWidth>
      <DialogTitle>Create New Case</DialogTitle>
      <DialogContent>
        {/* Loading process */}
        {status === STATUS.isLoading && (
          <>
            <Skeleton variant="rectangular" width={196} height={24} />
            <Skeleton
              variant="rectangular"
              width={128}
              height={18}
              sx={{ mt: 1.5 }}
            />
          </>
        )}
        {/* Message to connect account */}
        {status === STATUS.isAccountRequired && (
          <>
            <Typography>
              To create case and add reputation you need to connect wallet.
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
          </>
        )}
        {/* Message to create profile */}
        {status === STATUS.isAccountProfileRequired && (
          <>
            <Typography>
              To create case and add reputation you need to create profile.
            </Typography>
            <Button
              sx={{ mt: 4 }}
              variant="contained"
              onClick={() => {
                router.push('/profile/create');
                close();
              }}
              startIcon={
                <IconProfile hexColor={palette.primary.contrastText} />
              }
            >
              Create Profile
            </Button>
          </>
        )}
        {/* Message to join to jurisdiction */}
        {status === STATUS.isJoiningToJurisdictionRequired && (
          <>
            <Typography>
              To create case and add reputation you need to join jurisdiction.
            </Typography>
            <Button
              sx={{ mt: 4 }}
              variant="contained"
              onClick={() => {
                router.push(`/jurisdiction/${jurisdiction?.id}`);
                close();
              }}
            >
              Open Jurisdiction
            </Button>
          </>
        )}
        {/* Form to create case */}
        {status >= STATUS.isFormAvailable && (
          <>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Typography sx={{ fontWeight: 'bold' }}>Jurisdiction</Typography>
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
            <Divider sx={{ mt: 1.5, mb: 0 }} />
            <Form
              schema={schema}
              uiSchema={uiSchema}
              formData={formData}
              onChange={handleChange}
              onSubmit={handleSubmit}
              widgets={widgets}
              formContext={{
                jurisdiction: jurisdiction,
                formData: formData,
                formAction: formAction,
              }}
              disabled={status === STATUS.isFormSubmitting}
              showErrorList={false}
            >
              {status === STATUS.isFormSubmitting ? (
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
  );
}
