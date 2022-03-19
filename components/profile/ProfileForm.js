import { MuiForm5 as Form } from '@rjsf/material-ui';
import ProfilePictureInput from "components/profile/ProfilePictureInput";

/**
 * Component: ProfilePictureInput
 * 
 * TODO: Move configs to separate files
 * 
 * TODO: Check that account uploaded picture before submit form
 */
export default function ProfileForm({ children, disabled, initData, onSubmit }) {

  const schema = {
    type: "object",
    properties: {
      profilePicture: {
        type: "string",
        title: "Profile Picture",
      },
      publicProfile: {
        type: "object",
        title: "Public Profile",
        required: ["firstName", "lastName"],
        properties: {
          firstName: {
            type: "string",
            title: "First Name",
          },
          lastName: {
            type: "string",
            title: "Last Name",
          },
        }
      },
      publicContacts: {
        type: "object",
        title: "Public Contacts",
        properties: {
          email: {
            type: "string",
            title: "Email (optional)",
          },
        }
      },
      links: {
        type: "object",
        title: "Links",
        properties: {
          twitter: {
            type: "string",
            title: "Twitter (optional)",
          }
        }
      }
    }
  }

  const uiSchema = {
    "profilePicture": {
      "ui:widget": "ProfilePictureInput",
      "ui:options": {
        size: 128
      }
    },
  };

  const widgets = {
    ProfilePictureInput: ProfilePictureInput
  }

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
  )
}