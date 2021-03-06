import { Button, Divider, Stack, Typography } from '@mui/material';
import { IconCloseSquare, IconPlus } from 'icons/core';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import ProfileSelect from './ProfileSelect';

/**
 * A widget to select case witness profiles (profile ids).
 */
export default function CaseWitnessesSelect(props) {
  const propsLabel = props.label;
  const propsSubLabel = props.options?.subLabel;
  const propsDisabled = props.disabled;
  const propsOnChange = props.onChange;
  const { t } = useTranslation('common');
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
          <ProfileSelect
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
            startIcon={<IconPlus width="22" heigth="22" />}
            disabled={propsDisabled}
            onClick={addWitnessSelect}
          >
            {t('button-add')}
          </Button>
        )}
        {witnesses.length > 1 && (
          <Button
            startIcon={<IconCloseSquare width="22" heigth="22" />}
            disabled={propsDisabled}
            onClick={removeWitnessSelect}
          >
            {t('button-remove')}
          </Button>
        )}
      </Stack>
    </>
  );
}
