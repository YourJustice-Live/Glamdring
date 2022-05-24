import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Pagination,
  Stack,
} from '@mui/material';
import useDialogContext from 'hooks/context/useDialogContext';
import useToasts from 'hooks/useToasts';
import { IconFilter } from 'icons';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { palette } from 'theme/palette';
import { MuiForm5 as Form } from '@rjsf/material-ui';
import ProfileSelect from 'components/form/widget/ProfileSelect';
import JurisdictionList from './JurisdictionList';
import useJurisdiction from 'hooks/useJurisdiction';

/**
 * A component with a list of jurisdiction that supports filters and navigation.
 */
export default function JurisdictionListObserver({
  isFilterButtonHidden,
  filters,
  sx,
}) {
  const { showDialog, closeDialog } = useDialogContext();
  const { showToastError } = useToasts();
  const { getJurisdictions } = useJurisdiction();
  const [jurisdictions, setJurisdictions] = useState(null);
  const [params, setParams] = useState({
    filters: {},
    page: 1,
    pageCount: 1,
    pageSize: 12,
  });

  useEffect(() => {
    if (filters) {
      setParams({ ...params, filters: filters });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    let isComponentActive = true;
    setJurisdictions(null);
    getJurisdictions({
      searchQuery: params.filters.name,
      member: params.filters.memberProfileAccount,
      judge: params.filters.judgeProfileAccount,
      admin: params.filters.adminProfileAccount,
      first: params.pageSize,
      skip: (params.page - 1) * params.pageSize,
    })
      .then((jurisdictions) => {
        // Update jurisdictions and add next page to pagination if possible
        if (isComponentActive) {
          setJurisdictions(jurisdictions);
          if (
            params.page == params.pageCount &&
            jurisdictions.length == params.pageSize
          ) {
            setParams({ ...params, pageCount: params.pageCount + 1 });
          }
        }
      })
      .catch((error) => {
        showToastError(error);
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
              <IconFilter
                hexColor={
                  isEmpty(params.filters)
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
                  filters={params.filters}
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
      <JurisdictionList jurisdictions={jurisdictions} />
    </Box>
  );
}

function FiltersDialog({ filters, onChange, isClose, onClose }) {
  const [formData, setFormData] = useState(filters || {});
  const [isOpen, setIsOpen] = useState(!isClose);

  const schema = {
    type: 'object',
    properties: {
      name: {
        type: ['string', 'null'],
        title: 'Jurisdiction Name',
      },
      memberProfileAccount: {
        type: ['string', 'null'],
        title: 'Citizen Profile',
      },
      judgeProfileAccount: {
        type: ['string', 'null'],
        title: 'Judge Profile',
      },
      adminProfileAccount: {
        type: ['string', 'null'],
        title: 'Admin Profile',
      },
    },
  };

  const uiSchema = {
    name: {
      'ui:placeholder': 'Key word, phrase',
    },
    memberProfileAccount: {
      'ui:widget': 'ProfileSelect',
    },
    judgeProfileAccount: {
      'ui:widget': 'ProfileSelect',
    },
    adminProfileAccount: {
      'ui:widget': 'ProfileSelect',
    },
  };

  const widgets = {
    ProfileSelect: ProfileSelect,
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
      <DialogTitle sx={{ pb: 0 }}>Dialog Filters</DialogTitle>
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
