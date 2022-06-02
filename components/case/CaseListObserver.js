import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Pagination,
  Stack,
} from '@mui/material';
import { Box } from '@mui/system';
import { MuiForm5 as Form } from '@rjsf/material-ui';
import CaseStageSelect from 'components/form/widget/CaseStageSelect';
import ProfileSelect from 'components/form/widget/ProfileSelect';
import useDialogContext from 'hooks/context/useDialogContext';
import useCase from 'hooks/useCase';
import useErrors from 'hooks/useErrors';
import { IconFilter3 } from 'icons/core';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { palette } from 'theme/palette';
import CaseList from './CaseList';

/**
 * A component with a list of cases that supports filters and navigation.
 */
export default function CaseListObserver({
  filters,
  isFilterButtonHidden,
  isJurisdictionInputDisabled,
  isParticipantInputDisabled,
  sx,
}) {
  const { showDialog, closeDialog } = useDialogContext();
  const { handleError } = useErrors();
  const { getCases } = useCase();
  const [cases, setCases] = useState(null);
  const [params, setParams] = useState({
    filters: {},
    page: 1,
    pageCount: 1,
    pageSize: 5,
  });

  useEffect(() => {
    if (filters) {
      setParams({ ...params, filters: filters });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    let isComponentActive = true;
    setCases(null);
    getCases({
      searchQuery: params.filters.description,
      jurisdiction: params.filters.jurisdictionAddress,
      stage: params.filters.stageId,
      admin: params.filters.adminProfileId,
      subject: params.filters.subjectProfileId,
      plaintiff: params.filters.plaintiffProfileId,
      judge: params.filters.judgeProfileId,
      witness: params.filters.witnessProfileId,
      affected: params.filters.affectedProfileId,
      participantWithoutConfirmationPost:
        params.filters.participantWithoutConfirmationPostProfileId,
      participant: params.filters.participantProfileId,
      first: params.pageSize,
      skip: (params.page - 1) * params.pageSize,
    })
      .then((cases) => {
        // Update cases and add next page to pagination if possible
        if (isComponentActive) {
          setCases(cases);
          if (
            params.page == params.pageCount &&
            cases.length == params.pageSize
          ) {
            setParams({ ...params, pageCount: params.pageCount + 1 });
          }
        }
      })
      .catch((error) => {
        handleError(error, true);
      });
    return () => {
      isComponentActive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <Box sx={{ ...sx }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: { md: 'space-between' },
          alignItems: { md: 'center' },
          mb: 4,
        }}
      >
        {!isFilterButtonHidden && (
          <Button
            size="small"
            variant={isEmpty(params.filters) ? 'outlined' : 'contained'}
            startIcon={
              <IconFilter3
                color={
                  isEmpty(params.filters)
                    ? palette.primary.main
                    : palette.primary.contrastText
                }
                width="18"
                height="18"
              />
            }
            sx={{ px: 2 }}
            onClick={() =>
              showDialog(
                <FiltersDialog
                  filters={params.filters}
                  isJurisdictionInputDisabled={isJurisdictionInputDisabled}
                  isParticipantInputDisabled={isParticipantInputDisabled}
                  onChange={(filters) =>
                    setParams({
                      ...params,
                      filters: filters,
                      page: 1,
                      pageCount: 1,
                    })
                  }
                  onClose={closeDialog}
                />,
              )
            }
          >
            Filters
          </Button>
        )}
        <Pagination
          color="primary"
          sx={{ mt: { xs: 2, md: 0 } }}
          count={params.pageCount}
          page={params.page}
          onChange={(_, page) => setParams({ ...params, page: page })}
        />
      </Box>
      <CaseList cases={cases} />
    </Box>
  );
}

function FiltersDialog({
  filters,
  onChange,
  isJurisdictionInputDisabled,
  isParticipantInputDisabled,
  isClose,
  onClose,
}) {
  const [formData, setFormData] = useState(filters || {});
  const [isOpen, setIsOpen] = useState(!isClose);

  const schema = {
    type: 'object',
    properties: {
      description: {
        type: ['string', 'null'],
        title: 'Case Description',
      },
      jurisdictionAddress: {
        type: ['string', 'null'],
        title: 'Jurisdiction Address',
      },
      stageId: {
        type: 'number',
        title: '',
      },
      subjectProfileId: {
        type: ['string', 'null'],
        title: 'Acted Profile',
      },
      affectedProfileId: {
        type: ['string', 'null'],
        title: 'Affected Profile',
      },
      judgeProfileId: {
        type: ['string', 'null'],
        title: 'Judge Profile',
      },
      witnessProfileId: {
        type: ['string', 'null'],
        title: 'Witness Profile',
      },
      plaintiffProfileId: {
        type: ['string', 'null'],
        title: 'Plaintiff Profile',
      },
      adminProfileId: {
        type: ['string', 'null'],
        title: 'Admin Profile',
      },
      participantProfileId: {
        type: ['string', 'null'],
        title: 'Profile with Any Role',
      },
    },
  };

  const uiSchema = {
    description: {
      'ui:placeholder': 'Key word, phrase',
    },
    jurisdictionAddress: {
      'ui:placeholder': '0x8b22...',
      'ui:disabled': isJurisdictionInputDisabled,
    },
    stageId: {
      'ui:widget': 'CaseStageSelect',
    },
    subjectProfileId: {
      'ui:widget': 'ProfileSelect',
    },
    affectedProfileId: {
      'ui:widget': 'ProfileSelect',
    },
    judgeProfileId: {
      'ui:widget': 'ProfileSelect',
    },
    witnessProfileId: {
      'ui:widget': 'ProfileSelect',
    },
    plaintiffProfileId: {
      'ui:widget': 'ProfileSelect',
    },
    adminProfileId: {
      'ui:widget': 'ProfileSelect',
    },
    participantProfileId: {
      'ui:widget': 'ProfileSelect',
      'ui:disabled': isParticipantInputDisabled,
    },
  };

  const widgets = {
    ProfileSelect: ProfileSelect,
    CaseStageSelect: CaseStageSelect,
  };

  async function close() {
    setFormData({});
    setIsOpen(false);
    onClose();
  }

  async function submit({ formData }) {
    // Clear form data
    Object.keys(formData).forEach((key) => {
      if (
        formData[key] === null ||
        formData[key] === undefined ||
        formData[key] === false
      ) {
        delete formData[key];
      }
    });
    // Return creared form data
    onChange(formData);
    close();
  }

  return (
    <Dialog open={isOpen} onClose={close} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 0 }}>Case Filters</DialogTitle>
      <DialogContent>
        <Form
          schema={schema}
          formData={formData}
          uiSchema={uiSchema}
          widgets={widgets}
          onSubmit={submit}
        >
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button variant="contained" type="submit">
              Apply
            </Button>
            <Button variant="outlined" onClick={onClose}>
              Close
            </Button>
          </Stack>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
