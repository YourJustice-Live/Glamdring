import { Skeleton, Stack, Typography } from '@mui/material';
import CaseCard from './CaseCard';

/**
 * A component with a list of cases.
 */
export default function CaseList({ cases }) {
  return (
    <Stack spacing={4}>
      {!cases && (
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
      {cases && cases.length === 0 && <Typography>None</Typography>}
      {cases && cases.length > 0 && (
        <>
          {cases.map((caseObject, index) => (
            <CaseCard key={index} caseObject={caseObject} />
          ))}
        </>
      )}
    </Stack>
  );
}
