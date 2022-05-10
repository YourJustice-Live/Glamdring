import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Pagination,
  Stack,
} from '@mui/material';
import { Box } from '@mui/system';
import CaseList from 'components/case/CaseList';
import CaseStageSelect from 'components/form/widget/CaseStageSelect';
import useCase from 'hooks/useCase';
import useDialogContext from 'hooks/useDialogContext';
import useToasts from 'hooks/useToasts';
import { IconFilter } from 'icons';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { palette } from 'theme/palette';
import { MuiForm5 as Form } from '@rjsf/material-ui';

/**
 * A component with profile cases.
 */
export default function ProfileCases({ profile }) {
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
        jurisdiction: process.env.NEXT_PUBLIC_JURISDICTION_CONTRACT_ADDRESS,
        stage: filters?.stageId,
        admin: filters?.isAdmin && profile.account,
        subject: filters?.isSubject && profile.account,
        plaintiff: filters?.isPlaintiff && profile.account,
        judge: filters?.isJudge && profile.account,
        witness: filters?.isWitness && profile.account,
        affected: filters?.isAffected && profile.account,
        participant: profile.account,
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
    if (profile) {
      loadData(1, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, profile]);

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

// TODO: Create a common component with filter dialog
function FiltersDialog({ filters, onChange, isClose, onClose }) {
  const [formData, setFormData] = useState(filters || {});
  const [isOpen, setIsOpen] = useState(!isClose);

  const schema = {
    type: 'object',
    properties: {
      isAdmin: {
        type: 'boolean',
        title: 'Is Admin',
      },
      isSubject: {
        type: 'boolean',
        title: 'Is Subject',
      },
      isPlaintiff: {
        type: 'boolean',
        title: 'Is Plaintiff',
      },
      isJudge: {
        type: 'boolean',
        title: 'Is Judge',
      },
      isWitness: {
        type: 'boolean',
        title: 'Is Witness',
      },
      isAffected: {
        type: 'boolean',
        title: 'Is Affected',
      },
      stageId: {
        type: 'number',
        title: '',
      },
    },
  };

  const uiSchema = {
    stageId: {
      'ui:widget': 'CaseStageSelect',
    },
  };

  const widgets = {
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
