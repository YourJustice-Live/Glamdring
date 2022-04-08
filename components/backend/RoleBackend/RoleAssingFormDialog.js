import FormDialog from 'components/form/FormDialog';
import { JURISDICTION_ROLE } from 'constants/contracts';
import useJuridictionContract from 'hooks/contracts/useJurisdictionContract';
import useToasts from 'hooks/useToasts';
import { useState } from 'react';

/**
 * A component with button and form for adding role for specified account.
 *
 * TODO: Unite "RoleAssignFormDialog" and "RoleRemoveFormDialog".
 */
export default function RoleAssignFormDialog() {
  const { showToastSuccess, showToastError } = useToasts();
  const { assignRole } = useJuridictionContract();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const schema = {
    type: 'object',
    required: ['account', 'role'],
    properties: {
      account: {
        type: 'string',
        title: 'Account',
      },
      role: {
        type: 'string',
        title: 'Role',
        default: JURISDICTION_ROLE.member,
        enum: [
          JURISDICTION_ROLE.member,
          JURISDICTION_ROLE.judge,
          JURISDICTION_ROLE.admin,
        ],
        enumNames: ['Member', 'Judge', 'Admin'],
      },
    },
  };

  const uiSchema = {
    account: {
      'ui:placeholder': '0x430...',
    },
  };

  async function open() {
    setIsOpen(true);
  }

  async function close() {
    setFormData({});
    setIsLoading(false);
    setIsOpen(false);
  }

  async function submit({ formData }) {
    try {
      setFormData(formData);
      setIsLoading(true);
      await assignRole(formData.account, formData.role);
      showToastSuccess('Success! Data will be updated soon.');
      close();
    } catch (error) {
      showToastError(error);
      setIsLoading(false);
    }
  }

  return (
    <FormDialog
      buttonTitle="Add Role"
      formTitle="Add Role"
      formText="Add a role for specified account."
      formSchema={schema}
      formUiSchema={uiSchema}
      formData={formData}
      isLoading={isLoading}
      isOpen={isOpen}
      onOpen={open}
      onClose={close}
      onSubmit={submit}
    />
  );
}
