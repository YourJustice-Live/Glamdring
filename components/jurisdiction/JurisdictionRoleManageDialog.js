import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import { MuiForm5 as Form } from '@rjsf/material-ui';
import ProfileSelect from 'components/form/widget/ProfileSelect';
import { JURISDICTION_ROLE } from 'constants/contracts';
import useJuridictionContract from 'hooks/contracts/useJurisdictionContract';
import useErrors from 'hooks/useErrors';
import useToasts from 'hooks/useToasts';
import { capitalize } from 'lodash';
import { useState } from 'react';

/**
 * A dialog for assign or remove jurisdiction role for a specified profile.
 */
export default function RoleManageDialog({
  jurisdiction,
  isAssign,
  isClose,
  onClose,
}) {
  const { handleError } = useErrors();
  const { showToastSuccess } = useToasts();
  const { assignRole, removeRole } = useJuridictionContract();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!isClose);

  const schema = {
    type: 'object',
    required: ['profileId', 'role'],
    properties: {
      profileId: {
        type: 'string',
        title: '',
      },
      role: {
        type: 'string',
        title: 'Role',
        default: JURISDICTION_ROLE.member.name,
        enum: [
          JURISDICTION_ROLE.member.name,
          JURISDICTION_ROLE.judge.name,
          JURISDICTION_ROLE.admin.name,
        ],
        enumNames: [
          capitalize(JURISDICTION_ROLE.member.name),
          capitalize(JURISDICTION_ROLE.judge.name),
          capitalize(JURISDICTION_ROLE.admin.name),
        ],
      },
    },
  };

  const uiSchema = {
    profileId: {
      'ui:widget': 'ProfileSelect',
    },
  };

  const widgets = {
    ProfileSelect: ProfileSelect,
  };

  async function close() {
    setFormData({});
    setIsLoading(false);
    setIsOpen(false);
    onClose();
  }

  async function submit({ formData }) {
    try {
      setFormData(formData);
      setIsLoading(true);
      if (isAssign) {
        await assignRole(jurisdiction?.id, formData.profileId, formData.role);
      } else {
        await removeRole(jurisdiction?.id, formData.profileId, formData.role);
      }
      showToastSuccess('Success! Data will be updated soon.');
      close();
    } catch (error) {
      handleError(error, true);
      setIsLoading(false);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={isLoading ? null : onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>{isAssign ? 'Assign Role' : 'Remove Role'}</DialogTitle>
      <DialogContent>
        <Form
          schema={schema}
          uiSchema={uiSchema}
          widgets={widgets}
          formData={formData}
          onSubmit={submit}
          disabled={isLoading}
        >
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            {isLoading ? (
              <LoadingButton
                loading
                loadingPosition="start"
                startIcon={<Save />}
                variant="outlined"
              >
                Processing
              </LoadingButton>
            ) : (
              <>
                <Button variant="contained" type="submit">
                  {isAssign ? 'Assign Role' : 'Remove Role'}
                </Button>
                <Button variant="outlined" onClick={onClose}>
                  Cancel
                </Button>
              </>
            )}
          </Stack>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
