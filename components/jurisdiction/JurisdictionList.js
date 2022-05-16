import { Grid, Typography } from '@mui/material';
import JurisdictionCard from './JurisdictionCard';

/**
 * A component with a list of jurisdictions.
 */
export default function JurisdictionList({ jurisdictions, sx }) {
  return (
    <Grid container spacing={3} sx={{ ...sx }}>
      {!jurisdictions && (
        <>
          {Array(3)
            .fill()
            .map((_, index) => (
              <Grid key={index} item xs={12} md={6}>
                <JurisdictionCard />
              </Grid>
            ))}
        </>
      )}
      {jurisdictions && jurisdictions.length === 0 && (
        <Grid item xs={12} md={4}>
          <Typography>No jurisdictions</Typography>
        </Grid>
      )}
      {jurisdictions && jurisdictions.length > 0 && (
        <>
          {jurisdictions.map(
            (jurisdiction, index) =>
              jurisdiction && (
                <Grid key={index} item xs={12} md={6}>
                  <JurisdictionCard jurisdiction={jurisdiction} />
                </Grid>
              ),
          )}
        </>
      )}
    </Grid>
  );
}
