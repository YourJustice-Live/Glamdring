import { InfoOutlined, Save, WarningAmberRounded } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Link,
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
import LawsPositivitySelect from 'components/form/widget/LawsPositivitySelect';
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
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { palette } from 'theme/palette';
import { handleCreateCaseEvent } from 'utils/analytics';

const LOCAL_STORAGE_PROPERTY_HIDE_CASE_SCHEMA = 'hide_case_schema';

/**
 * A component with a dialog to create a case.
 *
 * @typedef {import('../classes/Jurisdiction').Jurisdiction} Jurisdiction
 * @typedef {import('../classes/Profile').Profile} Profile
 *
 * @param {object} params Params.
 * @param {Jurisdiction} params.jurisdiction Jurisdiction. If not defined then will be used main jurisdiction.
 * @param {boolean} params.isPositive If false, display negative laws by default, otherwise show positive laws.
 * @param {Profile} params.subjectProfile Subject profile. If not defined then this fild will be empty.
 * @param {Profile} params.affectedProfile Affected profile. If not defined then this fild will be empty.
 * @param {boolean} params.isClose Init status for dialog.
 * @param {Function} params.onClose Callback function when dialog is closed.
 * @returns Dialog component.
 */
export default function CaseCreateDialog({
  jurisdiction,
  isPositive,
  subjectProfile,
  affectedProfile,
  isClose,
  onClose,
}) {
  const { account } = useWeb3Context();
  const { accountProfile } = useDataContext();
  const [isSchemaLooked, setIsSchemaLooked] = useState(
    localStorage.getItem(LOCAL_STORAGE_PROPERTY_HIDE_CASE_SCHEMA),
  );

  if (!isSchemaLooked) {
    return (
      <SchemaDialog
        onLookSchema={() => setIsSchemaLooked(true)}
        isClose={isClose}
        onClose={onClose}
      />
    );
  } else if (!account) {
    return <AccountRequiredDialog isClose={isClose} onClose={onClose} />;
  } else if (!accountProfile) {
    return <AccountProfileRequiredDialog isClose={isClose} onClose={onClose} />;
  }

  return (
    <FormDialog
      jurisdiction={jurisdiction}
      isPositive={isPositive}
      subjectProfile={subjectProfile}
      affectedProfile={affectedProfile}
      isClose={isClose}
      onClose={onClose}
    />
  );
}

function SchemaDialog({ onLookSchema, isClose, onClose }) {
  const { t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(!isClose);
  const [isChecked, setIsChecked] = useState(false);

  function close() {
    setIsOpen(false);
    onClose();
  }

  function createCase() {
    if (isChecked) {
      localStorage.setItem(LOCAL_STORAGE_PROPERTY_HIDE_CASE_SCHEMA, true);
    }
    onLookSchema();
  }

  return (
    <Dialog open={isOpen} onClose={close} maxWidth="sm" fullWidth>
      <DialogContent>
        <Box
          sx={{
            flex: 1,
            borderRadius: '14px',
            background:
              'linear-gradient(141.94deg, rgba(238, 255, 202, 0.3) 1.02%, rgba(193, 255, 251, 0.3) 31.46%, rgba(185, 209, 255, 0.3) 54.1%, rgba(190, 167, 255, 0.3) 83.12%, rgba(255, 201, 253, 0.3) 106.48%, rgba(255, 157, 198, 0.3) 136.91%)',
          }}
        >
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Image
              src="/images/how-case-works-schema-square.svg"
              layout="responsive"
              loading="lazy"
              width={1080}
              height={1080}
              alt="Schema"
            />
          </Box>
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <Image
              src="/images/how-case-works-schema.svg"
              layout="responsive"
              loading="lazy"
              width={640}
              height={1080}
              alt="Schema"
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 2,
          }}
        >
          <Button size="large" variant="contained" onClick={createCase}>
            {t('button-case-create')}
          </Button>
          <FormControlLabel
            sx={{ mt: 0.5 }}
            control={
              <Checkbox
                checked={isChecked}
                onChange={(event) => setIsChecked(event.target.checked)}
              />
            }
            label={t('text-do-not-show-me-again')}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}

function AccountRequiredDialog({ isClose, onClose }) {
  const { t } = useTranslation('common');
  const { connectWallet } = useWeb3Context();
  const [isOpen, setIsOpen] = useState(!isClose);

  function close() {
    setIsOpen(false);
    onClose();
  }

  return (
    <Dialog open={isOpen} onClose={close} maxWidth="sm" fullWidth>
      <DialogTitle>{t('dialog-case-create-title')}</DialogTitle>
      <DialogContent>
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
      </DialogContent>
    </Dialog>
  );
}

function AccountProfileRequiredDialog({ isClose, onClose }) {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(!isClose);

  function close() {
    setIsOpen(false);
    onClose();
  }

  return (
    <Dialog open={isOpen} onClose={close} maxWidth="sm" fullWidth>
      <DialogTitle>{t('dialog-case-create-title')}</DialogTitle>
      <DialogContent>
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
      </DialogContent>
    </Dialog>
  );
}

function FormDialog({
  jurisdiction,
  isPositive,
  subjectProfile,
  affectedProfile,
  isClose,
  onClose,
}) {
  const { t } = useTranslation('common');
  const { account } = useWeb3Context();
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
  const [formData, setFormData] = useState({
    ...(jurisdiction && { jurisdictionId: jurisdiction.id }),
    isPositive: isPositive !== undefined ? isPositive : true,
    ...(subjectProfile && { subjectProfileAccount: subjectProfile.account }),
    ...(affectedProfile && {
      affectedProfileAccount: affectedProfile.account,
    }),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      'ui:widget': 'LawsPositivitySelect',
      'ui:options': {
        header: (
          <>
            <Typography sx={{ fontWeight: 'bold' }}>
              {t('input-case-laws-type-title')}
            </Typography>
            <Typography variant="body2">
              {t('input-case-laws-type-description')}
            </Typography>
            <Divider sx={{ mt: 1.5, mb: 2.5 }} />
          </>
        ),
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
    LawsPositivitySelect: LawsPositivitySelect,
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
      setIsSubmitting(true);
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
      setIsSubmitting(false);
    }
  }

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
          disabled={isSubmitting}
          showErrorList={false}
        >
          {isSubmitting ? (
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
      </DialogContent>
    </Dialog>
  );
}
