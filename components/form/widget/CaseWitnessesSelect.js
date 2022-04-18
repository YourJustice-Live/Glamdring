import { Button, Divider, Stack, Typography } from '@mui/material';
import { IconClose, IconPlus } from 'icons';
import { useEffect, useState } from 'react';
import CaseProfileSelect from './CaseProfileSelect';

export default function CaseWitnessesSelect(props) {
  const propsLabel = props.label;
  const propsSubLabel = props.options?.subLabel;
  const propsDisabled = props.disabled;
  const propsOnChange = props.onChange;
  const [witnesses, setWitnesses] = useState([null]);

  function addWitnessSelect() {
    setWitnesses([...witnesses, null]);
  }

  function removeWitnessSelect() {
    setWitnesses([...witnesses].slice(0, witnesses.length - 1));
  }

  function selectWitness(profile, index) {
    setWitnesses(
      [...witnesses].map((value, i) => (i == index ? profile : value)),
    );
  }

  useEffect(() => {
    // Return witnesses without nulls
    propsOnChange([...witnesses].filter((witness) => witness != null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [witnesses]);

  return (
    <>
      <Typography sx={{ fontWeight: 'bold' }}>{propsLabel}</Typography>
      <Typography variant="body2">{propsSubLabel}</Typography>
      <Divider sx={{ mt: 1.5, mb: 2.5 }} />
      <Stack spacing={2}>
        {witnesses.map((_, index) => (
          <CaseProfileSelect
            key={index}
            disabled={propsDisabled}
            onChange={(profile) => selectWitness(profile, index)}
          />
        ))}
      </Stack>
      <Stack
        direction="row"
        spacing={2}
        sx={{ mt: witnesses.length > 0 ? 2 : 0 }}
      >
        {witnesses.length < 5 && (
          <Button
            startIcon={<IconPlus size={22} />}
            disabled={propsDisabled}
            onClick={addWitnessSelect}
          >
            Add
          </Button>
        )}
        {witnesses.length > 1 && (
          <Button
            startIcon={<IconClose size={24} />}
            disabled={propsDisabled}
            onClick={removeWitnessSelect}
          >
            Remove
          </Button>
        )}
      </Stack>
    </>
  );
}
