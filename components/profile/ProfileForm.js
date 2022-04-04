import { MuiForm5 as Form } from '@rjsf/material-ui';
import ProfileAttributesInput from 'components/form/widget/ProfileAttributesInput';
import ProfilePictureInput from 'components/form/widget/ProfilePictureInput';

/**
 * A form for creating or editing a profile.
 *
 * TODO: Check that account uploaded picture before submit form
 */
export default function ProfileForm({
  children,
  disabled,
  initData,
  onSubmit,
}) {
  const schema = {
    type: 'object',
    properties: {
      image: {
        type: 'string',
        title: 'Profile Picture',
      },
      attributes: {
        type: 'array',
        title: 'Profile Attributes',
        items: [{}],
      },
    },
  };

  const uiSchema = {
    image: {
      'ui:widget': 'ProfilePictureInput',
      'ui:options': {
        size: 128,
      },
    },
    attributes: {
      'ui:widget': 'ProfileAttributesInput',
    },
  };

  const widgets = {
    ProfilePictureInput: ProfilePictureInput,
    ProfileAttributesInput: ProfileAttributesInput,
  };

  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      formData={initData}
      onSubmit={({ formData }) => onSubmit(formData)}
      widgets={widgets}
      disabled={disabled}
    >
      {children}
    </Form>
  );
}
