import { useState } from 'react';
import FormDialog from 'components/form/FormDialog';
import DataUriInput from 'components/form/widget/DataUriInput';
import useJuridictionContract from 'hooks/contracts/useJurisdictionContract';
import useToasts from 'hooks/useToasts';

/**
 * A form for adding a rule of updating a specified rule.
 */
export default function JurisdictionBackendRuleManager({ rule }) {
  const { showToastSuccess, showToastError } = useToasts();
  const { addRule, updateRule } = useJuridictionContract();
  const [formData, setFormData] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const schema = {
    type: 'object',
    properties: {
      // Show id scheme only for updating a rule
      ...(rule && {
        id: {
          type: 'string',
          title: 'ID',
        },
      }),
      rule: {
        type: 'object',
        title: 'Rule',
        required: ['about'],
        properties: {
          about: {
            type: 'string',
            title: 'About (Action GUID)',
          },
          affected: {
            type: 'string',
            title: 'Affected',
          },
          negation: {
            type: 'boolean',
            title: 'Negation',
            default: false,
          },
          uri: {
            type: 'string',
            title: 'Additional Data',
          },
          effects: {
            type: 'object',
            title: 'Effects',
            properties: {
              environmental: {
                type: 'integer',
                title: 'Environmental',
                default: 0,
              },
              professional: {
                type: 'integer',
                title: 'Professional',
                default: 0,
              },
              social: {
                type: 'integer',
                title: 'Social',
                default: 0,
              },
              personal: {
                type: 'integer',
                title: 'Personal',
                default: 0,
              },
            },
          },
        },
      },
      // Show confirmation scheme only for adding a rule
      ...(!rule && {
        confirmation: {
          type: 'object',
          title: 'Confirmation',
          properties: {
            ruling: {
              type: 'string',
              title: 'Ruling',
            },
            evidence: {
              type: 'boolean',
              title: 'Evidence',
              default: true,
            },
            witness: {
              type: 'integer',
              title: 'Witness',
              default: 1,
            },
          },
        },
      }),
    },
  };

  const uiSchema = {
    id: {
      'ui:disabled': true,
    },
    rule: {
      affected: {
        'ui:emptyValue': '',
        'ui:placeholder': 'investor',
      },
      uri: {
        'ui:emptyValue': '',
        'ui:widget': 'DataUriInput',
      },
      effects: {
        environmental: { 'ui:widget': 'updown' },
        professional: { 'ui:widget': 'updown' },
        social: { 'ui:widget': 'updown' },
        personal: { 'ui:widget': 'updown' },
      },
    },
    confirmation: {
      ruling: {
        'ui:emptyValue': '',
        'ui:placeholder': 'judge',
      },
      witness: {
        'ui:widget': 'updown',
      },
    },
  };

  const widgets = {
    DataUriInput: DataUriInput,
  };

  function open() {
    setIsOpen(true);
    setFormData(rule);
  }

  function close() {
    setFormData({});
    setIsLoading(false);
    setIsOpen(false);
  }

  async function submit({ formData }) {
    try {
      setFormData(formData);
      setIsLoading(true);
      if (rule) {
        await updateRule(formData.id, formData.rule);
      } else {
        await addRule(formData.rule, formData.confirmation);
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
      buttonTitle={rule ? 'Update Rule' : 'Add Rule'}
      formTitle={rule ? 'Update Rule' : 'Add Rule'}
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
