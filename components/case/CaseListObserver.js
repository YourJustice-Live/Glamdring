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
import useCase from 'hooks/useCase';
import useDialogContext from 'hooks/useDialogContext';
import useToasts from 'hooks/useToasts';
import { IconFilter } from 'icons';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { palette } from 'theme/palette';
import CaseList from './CaseList';

/**
 * A component with a list of cases that supports filters and navigation.
 */
export default function CaseListObserver({
  filters: filtersProps,
  isFilterButtonHidden,
  isJurisdictionInputDisabled,
  isParticipantInputDisabled,
  sx,
}) {
  const { showDialog, closeDialog } = useDialogContext();
  const { showToastError } = useToasts();
  const { getCases } = useCase();
  const [cases, setCases] = useState(null);
  const [filters, setFilters] = useState(filtersProps || {});
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageCount, setCurrentPageCount] = useState(1);
  const pageSize = 5;

  async function loadData(page = currentPage, pageCount = currentPageCount) {
    try {
      // Update states
      setCurrentPage(page);
      setCurrentPageCount(pageCount);
      setCases(null);
      // Load cases for page
      let cases = [];
      cases = await getCases({
        searchQuery: filters?.description,
        jurisdiction: filters?.jurisdictionAddress,
        stage: filters?.stageId,
        admin: filters?.adminProfileAccount,
        subject: filters?.subjectProfileAccount,
        plaintiff: filters?.plaintiffProfileAccount,
        judge: filters?.judgeProfileAccount,
        witness: filters?.witnessProfileAccount,
        affected: filters?.affectedProfileAccount,
        accountWithoutConfirmationPost: filters?.accountWithoutConfirmationPost,
        participant: filters?.participantProfileAccount,
        first: pageSize,
        skip: (page - 1) * pageSize,
      });
      setCases(cases);
      // Add next page to pagination if possible
      if (page == pageCount && cases.length === pageSize) {
        setCurrentPageCount(pageCount + 1);
      }
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    loadData(1, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

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
            variant={isEmpty(filters) ? 'outlined' : 'contained'}
            startIcon={
              <IconFilter
                hexColor={
                  isEmpty(filters)
                    ? palette.primary.main
                    : palette.primary.contrastText
                }
                size={18}
              />
            }
            sx={{ px: 2 }}
            onClick={() =>
              showDialog(
                <FiltersDialog
                  filters={filters}
                  isJurisdictionInputDisabled={isJurisdictionInputDisabled}
                  isParticipantInputDisabled={isParticipantInputDisabled}
                  onChange={(filters) => setFilters(filters)}
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
          count={currentPageCount}
          page={currentPage}
          onChange={(_, page) => loadData(page)}
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
      subjectProfileAccount: {
        type: ['string', 'null'],
        title: 'Acted Profile',
      },
      affectedProfileAccount: {
        type: ['string', 'null'],
        title: 'Affected Profile',
      },
      judgeProfileAccount: {
        type: ['string', 'null'],
        title: 'Judge Profile',
      },
      witnessProfileAccount: {
        type: ['string', 'null'],
        title: 'Witness Profile',
      },
      plaintiffProfileAccount: {
        type: ['string', 'null'],
        title: 'Plaintiff Profile',
      },
      adminProfileAccount: {
        type: ['string', 'null'],
        title: 'Admin Profile',
      },
      participantProfileAccount: {
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
    subjectProfileAccount: {
      'ui:widget': 'ProfileSelect',
    },
    affectedProfileAccount: {
      'ui:widget': 'ProfileSelect',
    },
    judgeProfileAccount: {
      'ui:widget': 'ProfileSelect',
    },
    witnessProfileAccount: {
      'ui:widget': 'ProfileSelect',
    },
    plaintiffProfileAccount: {
      'ui:widget': 'ProfileSelect',
    },
    adminProfileAccount: {
      'ui:widget': 'ProfileSelect',
    },
    participantProfileAccount: {
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
