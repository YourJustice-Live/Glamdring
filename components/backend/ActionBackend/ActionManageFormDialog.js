import { useState } from 'react';
import FormDialog from 'components/form/FormDialog';
import useActionRepoContract from 'hooks/contracts/useActionRepoContract';
import useToasts from 'hooks/useToasts';
import DataUriInput from 'components/form/widget/DataUriInput';

/**
 * A form for adding a action or updating a specified action.
 */
export default function ActionManageFormDialog({ action }) {
  const { showToastSuccess, showToastError } = useToasts();
  const { addAction, updateActionUri } = useActionRepoContract();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const schema = {
    type: 'object',
    properties: {
      // Show guid scheme only for updating a guid
      ...(action && {
        guid: {
          type: 'string',
          title: 'GUID (ID)',
        },
      }),
      // Show action scheme only for adding a action
      ...(!action && {
        action: {
          type: 'object',
          title: 'Action',
          properties: {
            subject: {
              type: 'string',
              title: 'Subject',
              default: '',
            },
            verb: {
              type: 'string',
              title: 'Verb',
              default: '',
            },
            object: {
              type: 'string',
              title: 'Object',
              default: '',
            },
            tool: {
              type: 'string',
              title: 'Tool',
              default: '',
            },
          },
        },
      }),
      uri: {
        type: 'string',
        title: 'Additional Data',
        default: '',
      },
    },
  };

  const uiSchema = {
    guid: {
      'ui:disabled': true,
    },
    action: {
      subject: {
        'ui:emptyValue': '',
        'ui:placeholder': 'founder',
      },
      verb: {
        'ui:emptyValue': '',
        'ui:placeholder': 'breach',
      },
      object: {
        'ui:emptyValue': '',
        'ui:placeholder': 'contract',
      },
      tool: { 'ui:emptyValue': '' },
    },
    uri: {
      'ui:emptyValue': '',
      'ui:widget': 'DataUriInput',
    },
  };

  const widgets = {
    DataUriInput: DataUriInput,
  };

  async function open() {
    setIsOpen(true);
    setFormData(action);
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
      if (action) {
        await updateActionUri(formData.guid, formData.uri);
      } else {
        await addAction(formData.action, formData.uri);
      }
      showToastSuccess('Success! Data will be updated soon.');
      close();
    } catch (error) {
      showToastError(error);
      setIsLoading(false);
    }
  }

  return (
    <FormDialog
      buttonTitle={action ? 'Update Action' : 'Add Action'}
      formTitle={action ? 'Update Action' : 'Add Action'}
      formSchema={schema}
      formUiSchema={uiSchema}
      formWidgets={widgets}
      formData={formData}
      isLoading={isLoading}
      isOpen={isOpen}
      onOpen={open}
      onClose={close}
      onSubmit={submit}
    />
  );
}
