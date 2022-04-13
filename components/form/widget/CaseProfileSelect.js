import {
  Avatar,
  Box,
  Divider,
  List,
  ListItemAvatar,
  ListItemButton,
  Stack,
  Typography,
} from '@mui/material';
import useProfile from 'hooks/useProfile';
import useToasts from 'hooks/useToasts';
import { useEffect, useState } from 'react';

/**
 * A widget to select case profile.
 */
export default function CaseProfileSelect(props) {
  const propsValue = props.value;
  const propsLabel = props.label;
  const propsOnChange = props.onChange;
  const propsFormRuleId = props.formContext?.formData?.ruleId;
  const { showToastError } = useToasts();
  const { getJurisdictionMemberProfiles } = useProfile();
  const [profiles, setProfiles] = useState(null);

  async function loadProfiles() {
    try {
      setProfiles(null);
      setProfiles(await getJurisdictionMemberProfiles());
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    if (propsFormRuleId) {
      loadProfiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propsFormRuleId]);

  return (
    <Box>
      <Typography sx={{ fontWeight: 'bold' }}>{propsLabel}</Typography>
      <Divider sx={{ my: 1.5 }} />
      {profiles ? (
        <List>
          {profiles.map((profile, index) => (
            <ListItemButton
              key={index}
              selected={propsValue === profile.account}
              onClick={() => propsOnChange(profile.account)}
            >
              <ListItemAvatar>
                <Avatar src={profile.avatarNftUriImage} />
              </ListItemAvatar>
              <Stack direction="column">
                <Typography>
                  {profile.avatarNftUriFirstName || 'None'}{' '}
                  {profile.avatarNftUriLastName || 'None'}
                </Typography>
              </Stack>
            </ListItemButton>
          ))}
        </List>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Box>
  );
}
