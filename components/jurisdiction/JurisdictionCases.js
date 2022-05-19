import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import { MuiForm5 as Form } from '@rjsf/material-ui';
import CaseList from 'components/case/CaseList';
import CaseStageSelect from 'components/form/widget/CaseStageSelect';
import ProfileSelect from 'components/form/widget/ProfileSelect';
import useCase from 'hooks/useCase';
import useDialogContext from 'hooks/useDialogContext';
import useToasts from 'hooks/useToasts';
import { IconFilter } from 'icons';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { palette } from 'theme/palette';

/**
 * A component with jurisdiction cases.
 */
export default function JurisdictionCases({ jurisdiction }) {
  const { showDialog, closeDialog } = useDialogContext();
  const { showToastError } = useToasts();
  const { getCases } = useCase();
  const [cases, setCases] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageCount, setCurrentPageCount] = useState(1);
  const [filters, setFilters] = useState({});
  const pageSize = 5;

  async function loadData(page = currentPage, pageCount = currentPageCount) {
    try {
      // Update states
      setCurrentPage(page);
      setCurrentPageCount(pageCount);
      setCases(null);
      // Load cases for page
      const cases = await getCases({
        jurisdiction: jurisdiction?.id,
        stage: filters?.stageId,
        admin: filters?.adminProfileAccount,
        subject: filters?.subjectProfileAccount,
        plaintiff: filters?.plaintiffProfileAccount,
        judge: filters?.judgeProfileAccount,
        witness: filters?.witnessProfileAccount,
        affected: filters?.affectedProfileAccount,
        first: pageSize,
        skip: (page - 1) * pageSize,
      });
      setCases(cases);
      // Add next page to pagination if possible
      if (page == pageCount && cases?.length === pageSize) {
        setCurrentPageCount(pageCount + 1);
      }
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    if (jurisdiction) {
      loadData(1, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jurisdiction, filters]);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: { md: 'space-between' },
          alignItems: { md: 'center' },
        }}
      >
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
                onChange={(filters) => setFilters(filters)}
                onClose={closeDialog}
              />,
            )
          }
        >
          Filters
        </Button>
        <Pagination
          color="primary"
          sx={{ mt: { xs: 2, md: 0 } }}
          count={currentPageCount}
          page={currentPage}
          onChange={(_, page) => loadData(page)}
        />
      </Box>
      <CaseList cases={cases} sx={{ mt: 4 }} />
    </Box>
  );
}

function FiltersDialog({ filters, onChange, isClose, onClose }) {
  const [formData, setFormData] = useState(filters || {});
  const [isOpen, setIsOpen] = useState(!isClose);

  const schema = {
    type: 'object',
    properties: {
      adminProfileAccount: {
        type: ['string', 'null'],
      },
      subjectProfileAccount: {
        type: ['string', 'null'],
      },
      plaintiffProfileAccount: {
        type: ['string', 'null'],
      },
      judgeProfileAccount: {
        type: ['string', 'null'],
      },
      witnessProfileAccount: {
        type: ['string', 'null'],
      },
      affectedProfileAccount: {
        type: ['string', 'null'],
      },
      stageId: {
        type: 'number',
        title: 'Stage',
      },
    },
  };

  const uiSchema = {
    adminProfileAccount: {
      'ui:widget': 'ProfileSelect',
      'ui:options': {
        header: (
          <>
            <Typography sx={{ fontWeight: 'bold' }}>Admin</Typography>
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
            <Typography sx={{ fontWeight: 'bold' }}>Acted</Typography>
            <Divider sx={{ mt: 1.5, mb: 2.5 }} />
          </>
        ),
      },
    },
    plaintiffProfileAccount: {
      'ui:widget': 'ProfileSelect',
      'ui:options': {
        header: (
          <>
            <Typography sx={{ fontWeight: 'bold' }}>Plaintiff</Typography>
            <Divider sx={{ mt: 1.5, mb: 2.5 }} />
          </>
        ),
      },
    },
    judgeProfileAccount: {
      'ui:widget': 'ProfileSelect',
      'ui:options': {
        header: (
          <>
            <Typography sx={{ fontWeight: 'bold' }}>Judge</Typography>
            <Divider sx={{ mt: 1.5, mb: 2.5 }} />
          </>
        ),
      },
    },
    witnessProfileAccount: {
      'ui:widget': 'ProfileSelect',
      'ui:options': {
        header: (
          <>
            <Typography sx={{ fontWeight: 'bold' }}>Witness</Typography>
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
            <Typography sx={{ fontWeight: 'bold' }}>Affected</Typography>
            <Divider sx={{ mt: 1.5, mb: 2.5 }} />
          </>
        ),
      },
    },
    stageId: {
      'ui:widget': 'CaseStageSelect',
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
      if (formData[key] === null || formData[key] === undefined) {
        delete formData[key];
      }
    });
    // Return creared form data
    onChange(formData);
    close();
  }

  return (
    <Dialog open={isOpen} onClose={close} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 0 }}>Filters</DialogTitle>
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
