import { useEffect, useState } from 'react';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import useAction from 'hooks/useAction';
import useRule from 'hooks/useRule';
import useToasts from 'hooks/useToasts';

/**
 * A component with jurisdiction laws (actions + rules).
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
    <Box sx={{ mb: 12 }}>
      <Typography variant="h1" gutterBottom>
        Laws
      </Typography>
      <Divider sx={{ mb: 3 }} />
      {/* Laws */}
      {laws ? (
        <Grid container spacing={3}>
          {[...laws.keys()].map((key) => (
            <Grid key={key} item xs={12}>
              <Card elevation={3} sx={{ p: 2 }}>
                {/* Law action */}
                <CardHeader
                  avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>L</Avatar>}
                  title={laws.get(key).action.uriData.name}
                  subheader={laws.get(key).action.uriData.description}
                />
                {/* Law rules */}
                <CardContent>
                  <Stack direction="column" spacing={1}>
                    {laws.get(key).rules.map((rule, index) => (
                      <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                        <Typography>{rule.rule.uriData.name}</Typography>
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
            </Grid>
          ))}
        </Grid>
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
    </Box>
  );
}
