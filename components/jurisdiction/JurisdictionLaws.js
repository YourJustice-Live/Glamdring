import {
  Avatar,
  Card,
  CardContent,
  Chip,
  Divider,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import useAction from 'hooks/useAction';
import useRule from 'hooks/useRule';
import useToasts from 'hooks/useToasts';
import { useEffect, useState } from 'react';

/**
 * A component with jurisdiction laws (actions + rules).
 *
 * TODO: Use hook to load laws.
 */
export default function JurisdictionLaws() {
  const { showToastError } = useToasts();
  const { getAction } = useAction();
  const { getRules } = useRule();
  const [laws, setLaws] = useState(null); // Map where key is action guid, value is action with rule list

  async function loadLaws() {
    try {
      let laws = new Map();
      const rules = await getRules();
      for (const rule of rules) {
        let law = laws.get(rule.rule.about);
        // If law is not found by action (about) then create it
        if (!law) {
          law = {
            action: await getAction(rule.rule.about),
            rules: [rule],
          };
          laws.set(rule.rule.about, law);
        }
        // If law is found by action (about) then add rule to it
        else {
          law.rules.push(rule);
        }
      }
      setLaws(laws);
    } catch (error) {
      showToastError(error);
    }
  }

  useEffect(() => {
    loadLaws();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Typography variant="h1" gutterBottom>
        Laws
      </Typography>
      <Divider sx={{ mb: 3 }} />
      {/* Laws */}
      {laws ? (
        <Stack spacing={2}>
          {[...laws.keys()].map((key) => (
            <Card key={key} elevation={1} sx={{ p: 2 }}>
              {/* Avatar with name */}
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>L</Avatar>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {laws.get(key).action.uriData.name}
                  </Typography>
                </Stack>
                {/* Description */}
                <Box sx={{ mt: 2 }}>
                  <Typography>
                    {laws.get(key).action.uriData.description}
                  </Typography>
                </Box>
                {/* Rules */}
                <Stack direction="column" spacing={1} sx={{ mt: 3 }}>
                  {laws.get(key).rules.map((rule, index) => (
                    <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                      <Typography sx={{ fontWeight: 'bold' }}>
                        {rule.rule.uriData.name}
                      </Typography>
                      <Typography>{rule.rule.uriData.description}</Typography>
                      <Box
                        sx={{ display: 'flex', flexDirection: 'row', mt: 2 }}
                      >
                        <Chip
                          label={
                            'Environmental ' + rule.rule.effects.environmental
                          }
                          sx={{ mr: 1 }}
                        />
                        <Chip
                          label={
                            'Professional ' + rule.rule.effects.professional
                          }
                          sx={{ mr: 1 }}
                        />
                        <Chip
                          label={'Social ' + rule.rule.effects.social}
                          sx={{ mr: 1 }}
                        />
                        <Chip
                          label={'Personal ' + rule.rule.effects.personal}
                          sx={{ mr: 1 }}
                        />
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : (
        <>
          <Skeleton
            variant="rectangular"
            sx={{ mb: 1 }}
            width={196}
            height={24}
          />
          <Skeleton variant="rectangular" width={82} height={24} />
        </>
      )}
    </>
  );
}
