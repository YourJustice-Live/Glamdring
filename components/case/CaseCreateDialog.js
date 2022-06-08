import { InfoOutlined, Save, WarningAmberRounded } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  AlertTitle,
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
import FeedbackPostDialog from 'components/feedback/FeedbackPostDialog';
import CaseActionSelect from 'components/form/widget/CaseActionSelect';
import CaseEvidencePostInput from 'components/form/widget/CaseEvidencePostInput';
import CaseNameInput from 'components/form/widget/CaseNameInput';
import CaseRuleSelect from 'components/form/widget/CaseRuleSelect';
import CaseRulingInput from 'components/form/widget/CaseRulingInput';
import CaseWitnessesSelect from 'components/form/widget/CaseWitnessesSelect';
import JurisdictionSelect from 'components/form/widget/JurisdictionSelect';
import ProfileSelect from 'components/form/widget/ProfileSelect';
import { CASE_ROLE, JURISDICTION_ROLE } from 'constants/contracts';
import { FORM } from 'constants/feedbacks';
import useDataContext from 'hooks/context/useDataContext';
import useDialogContext from 'hooks/context/useDialogContext';
import useWeb3Context from 'hooks/context/useWeb3Context';
import useJuridictionContract from 'hooks/contracts/useJurisdictionContract';
import useAction from 'hooks/useAction';
import useErrors from 'hooks/useErrors';
import useJurisdiction from 'hooks/useJurisdiction';
import useToasts from 'hooks/useToasts';
import { IconProfile, IconWallet } from 'icons/core';
import { capitalize } from 'lodash';
import { useTranslation } from 'next-i18next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { palette } from 'theme/palette';
import { handleCreateCaseEvent } from 'utils/analytics';

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
  jurisdiction,
  subjectProfile,
  affectedProfile,
  isClose,
  onClose,
}) {
  const STATUS = {
    isLoading: 0,
    isAccountRequired: 1,
    isAccountProfileRequired: 2,
    isFormAvailable: 3,
    isFormSubmitting: 4,
  };

  const router = useRouter();
  const { t } = useTranslation('common');
  const { account, connectWallet } = useWeb3Context();
  const { accountProfile } = useDataContext();
  const { showDialog, closeDialog } = useDialogContext();
  const { handleError } = useErrors();
  const { showToastSuccess } = useToasts();
  const { makeCase } = useJuridictionContract();
  const { getJurisdiction, getJurisdictionRule, isAccountHasJurisdictionRole } =
    useJurisdiction();
  const { getAction } = useAction();
  const [isOpen, setIsOpen] = useState(!isClose);
  const [isJoiningToJurisdictionRequired, setIsJoiningToJurisdictionRequired] =
    useState(false);
  const [status, setStatus] = useState(STATUS.isLoading);
  const [formData, setFormData] = useState({
    ...(jurisdiction && { jurisdictionId: jurisdiction.id }),
    ...(subjectProfile && { subjectProfileAccount: subjectProfile.account }),
    ...(affectedProfile && {
      affectedProfileAccount: affectedProfile.account,
    }),
  });
  const [formAction, setFormAction] = useState(null);
  const [formRule, setFormRule] = useState(null);

  const schema = {
    type: 'object',
    properties: {
      jurisdictionId: {
        type: 'string',
        title: '',
      },
    },
    required: ['jurisdictionId'],
    dependencies: {
      jurisdictionId: {
        properties: {
          isPositive: {
            type: 'boolean',
            title: '',
            enumNames: [t('text-laws-positive'), t('text-laws-negative')],
            default: true,
          },
          actionGuid: {
            type: 'string',
            title: '',
          },
        },
        required: ['actionGuid'],
      },
      actionGuid: {
        properties: {
          name: {
            type: 'string',
            title: t('input-case-name-title'),
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
            title: '',
          },
          affectedProfileAccount: {
            type: 'string',
            title: '',
          },
          evidencePostUri: {
            type: 'string',
            title: '',
          },
          witnessProfileAccounts: {
            type: 'array',
            title: t('input-case-witnesses-title'),
            items: {
              type: 'string',
            },
            default: [],
          },
          ruling: {
            title: t('input-case-ruling-title'),
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
    jurisdictionId: {
      'ui:widget': 'JurisdictionSelect',
      'ui:options': {
        header: (
          <>
            <Typography sx={{ fontWeight: 'bold' }}>
              {t('input-case-jurisdiction-title')}
            </Typography>
            <Typography variant="body2">
              {t('input-case-jurisdiction-description')}
            </Typography>
            <Divider sx={{ mt: 1.5, mb: 2.5 }} />
          </>
        ),
        footer: isJoiningToJurisdictionRequired && (
          <Alert
            severity="warning"
            icon={<WarningAmberRounded />}
            sx={{
              borderRadius: '8px',
              boxShadow: 'none',
              mt: 2,
              mb: 0,
            }}
          >
            {t('alert-case-required-joining-jurisdiction')}
          </Alert>
        ),
      },
      'ui:disabled': jurisdiction,
    },
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
            <Typography sx={{ fontWeight: 'bold' }}>
              {t('input-case-action-title')}
            </Typography>
            <Typography variant="body2">
              {t('input-case-action-description')}
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
              mt: 2,
              mb: 0,
            }}
          >
            <AlertTitle>{t('alert-propose-law-title')}</AlertTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2">
                <NextLink
                  href={`/jurisdiction/${formData.jurisdictionId}`}
                  passHref
                >
                  <Link
                    variant="body2"
                    underline="none"
                    sx={{ mr: 0.5, pb: 0.3 }}
                    onClick={() => closeDialog()}
                  >
                    <strong>{t('alert-propose-law-button-look')}</strong>
                  </Link>
                </NextLink>
                {t('alert-propose-law-description-1')}
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
                  <strong>
                    {t('alert-propose-law-button-propose').toLowerCase()}
                  </strong>
                </Link>
                {t('alert-propose-law-description-2')}
              </Typography>
            </Box>
          </Alert>
        ),
      },
    },
    name: {
      'ui:widget': 'CaseNameInput',
      'ui:options': {
        inputLabel: t('input-case-name-description'),
      },
    },
    ruleId: {
      'ui:widget': 'CaseRuleSelect',
      'ui:options': {
        header: (
          <>
            <Typography sx={{ fontWeight: 'bold' }}>
              {t('input-case-rule-title')}
            </Typography>
            <Typography variant="body2">
              {t('input-case-rule-description')}
            </Typography>
            <Divider sx={{ mt: 1.5, mb: 2.5 }} />
          </>
        ),
      },
    },
    subjectProfileAccount: {
      'ui:widget': 'ProfileSelect',
      'ui:options': {
        header: (
          <>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ fontWeight: 'bold' }}>
                {t('input-case-subject-title')}
              </Typography>
              {formAction?.action?.subject && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  ({capitalize(formAction.action.subject)})
                </Typography>
              )}
            </Stack>
            <Typography variant="body2">
              {t('input-case-subject-description')}
            </Typography>
            <Divider sx={{ mt: 1.5, mb: 2.5 }} />
          </>
        ),
      },
    },
    affectedProfileAccount: {
      'ui:widget': 'ProfileSelect',
      'ui:options': {
        header: (
          <>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ fontWeight: 'bold' }}>
                {t('input-case-affected-title')}
              </Typography>
              {formRule?.rule?.affected && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  ({capitalize(formRule.rule.affected)})
                </Typography>
              )}
            </Stack>
            <Typography variant="body2">
              {t('input-case-affected-description')}
            </Typography>
            <Divider sx={{ mt: 1.5, mb: 2.5 }} />
          </>
        ),
      },
    },
    evidencePostUri: {
      'ui:widget': 'CaseEvidencePostInput',
      'ui:options': {
        header: (
          <>
            <Typography sx={{ fontWeight: 'bold' }}>
              {t('input-case-evidence-title')}
            </Typography>
            <Typography variant="body2">
              {formRule?.rule?.uriData?.evidenceDescription ||
                t('input-case-evidence-description')}{' '}
              {formRule?.confirmation?.evidence && '*'}
            </Typography>
            <Divider sx={{ mt: 1.5, mb: 2.5 }} />
          </>
        ),
      },
    },
    witnessProfileAccounts: {
      'ui:widget': 'CaseWitnessesSelect',
      'ui:emptyValue': [],
      'ui:options': {
        subLabel: `
          ${t('input-case-witnesses-description')}:
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
    JurisdictionSelect: JurisdictionSelect,
    CaseActionSelect: CaseActionSelect,
    CaseRuleSelect: CaseRuleSelect,
    ProfileSelect: ProfileSelect,
    CaseEvidencePostInput: CaseEvidencePostInput,
    CaseWitnessesSelect: CaseWitnessesSelect,
    CaseNameInput: CaseNameInput,
    CaseRulingInput: CaseRulingInput,
  };

  function close() {
    setIsOpen(false);
    onClose();
  }

  function handleChange({ formData: changedFormData }) {
    // If jurisdiction changed
    if (formData.jurisdictionId !== changedFormData.jurisdictionId) {
      // Clear dependent form fields
      delete changedFormData.isPositive;
      delete changedFormData.actionGuid;
      delete changedFormData.name;
      delete changedFormData.ruleId;
      delete changedFormData.evidencePostUri;
      delete changedFormData.witnessProfileAccounts;
    }
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
          .catch((error) => handleError(error));
      }
    }
    // If rule changed
    if (formData.ruleId !== changedFormData.ruleId) {
      // Clear dependent form fields
      delete changedFormData.evidencePostUri;
      delete changedFormData.witnessProfileAccounts;
      // Load action by id
      if (changedFormData.ruleId) {
        getJurisdictionRule(
          changedFormData.jurisdictionId,
          changedFormData.ruleId,
        )
          .then((rule) => setFormRule(rule))
          .catch((error) => handleError(error));
      }
    }
    // Update state of form data
    setFormData(changedFormData);
  }

  async function handleSubmit({ formData: submittedFormData }) {
    try {
      setStatus(STATUS.isFormSubmitting);
      setFormData(submittedFormData);
      // Check if a user needs to join the jurisdiction
      if (isJoiningToJurisdictionRequired) {
        throw new Error(t('text-error-case-required-joining-jurisdiction'));
      }
      // Check witness count
      const formRuleWitness = Number(formRule?.confirmation?.witness);
      if (submittedFormData.witnessProfileAccounts.length < formRuleWitness) {
        throw new Error(t('text-error-case-required-more-witnesses'));
      }
      // Define case name
      const caseName = submittedFormData.name;
      // Define case rules
      const caseRules = [];
      caseRules.push({
        jurisdiction: submittedFormData.jurisdictionId,
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
        submittedFormData.jurisdictionId,
        caseName,
        caseRules,
        caseRoles,
        casePosts,
      );
      handleCreateCaseEvent();
      showToastSuccess(t('notification-data-is-successfully-updated'));
      close();
    } catch (error) {
      handleError(error, true);
      setStatus(STATUS.isFormAvailable);
    }
  }

  /**
   * Check that a user hac connected accounts and profile.
   */
  useEffect(() => {
    if (!account) {
      setStatus(STATUS.isAccountRequired);
    } else if (!accountProfile) {
      setStatus(STATUS.isAccountProfileRequired);
    } else {
      setStatus(STATUS.isFormAvailable);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, accountProfile]);

  /**
   * Check if a user needs to join the jurisdiction.
   */
  useEffect(() => {
    setIsJoiningToJurisdictionRequired(false);
    if (account && formData?.jurisdictionId) {
      getJurisdiction(formData.jurisdictionId)
        .then((jurisdiction) => {
          setIsJoiningToJurisdictionRequired(
            !isAccountHasJurisdictionRole(
              jurisdiction,
              account,
              JURISDICTION_ROLE.member.id,
            ),
          );
        })
        .catch((error) => {
          handleError(error, true);
          close();
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, formData?.jurisdictionId]);

  return (
    <Dialog open={isOpen} onClose={close} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 0 }}>{t('dialog-case-create-title')}</DialogTitle>
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
              {t('text-case-creating-require-connect-wallet')}
            </Typography>
            <Button
              sx={{ mt: 2 }}
              variant="contained"
              onClick={() => {
                connectWallet();
                close();
              }}
              startIcon={<IconWallet color={palette.primary.contrastText} />}
            >
              {t('button-wallet-connect')}
            </Button>
          </>
        )}
        {/* Message to create profile */}
        {status === STATUS.isAccountProfileRequired && (
          <>
            <Typography>
              {t('text-case-creating-require-create-profile')}
            </Typography>
            <Button
              sx={{ mt: 2 }}
              variant="contained"
              onClick={() => {
                router.push('/profile/create');
                close();
              }}
              startIcon={<IconProfile color={palette.primary.contrastText} />}
            >
              {t('button-profile-create')}
            </Button>
          </>
        )}
        {/* Form to create case */}
        {status >= STATUS.isFormAvailable && (
          <Form
            schema={schema}
            uiSchema={uiSchema}
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            widgets={widgets}
            formContext={{
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
                  {t('text-submitting')}
                </LoadingButton>
              </>
            ) : (
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button variant="contained" type="submit">
                  {t('button-case-create')}
                </Button>
                <Button variant="outlined" onClick={close}>
                  {t('button-cancel')}
                </Button>
              </Stack>
            )}
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
