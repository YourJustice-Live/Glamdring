import { Divider, TextField, Typography } from '@mui/material';

/**
 * A widget to input case name.
 */
export default function CaseNameInput(props) {
  const propsLabel = props.label;
  const propsInputLabel = props.options.inputLabel;
  const propsValue = props.value;
  const propsRequired = props.required;
  const propsDisabled = props.disabled;
  const propsOnChange = props.onChange;

  return (
    <>
      <Typography sx={{ fontWeight: 'bold' }}>{propsLabel}</Typography>
      <Divider sx={{ mt: 1.5, mb: 2.5 }} />
      <TextField
        label={propsInputLabel}
        value={propsValue || ''}
        required={propsRequired}
        disabled={propsDisabled}
        onChange={(event) => propsOnChange(event.target.value)}
      />
    </>
  );
}
