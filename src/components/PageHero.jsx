import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

/**
 * PageHero — dark navy hero banner at top of each page.
 *
 * @param {string} title
 * @param {string} subtitle
 */
export default function PageHero({ title, subtitle }) {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #000048 0%, #2d308d 50%, #000048 100%)',
        py: { xs: 6, md: 8 },
        px: 3,
        textAlign: 'center',
        position: 'relative',
        '@media print': {
          py: 2,
          printColorAdjust: 'exact',
          WebkitPrintColorAdjust: 'exact',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(54, 192, 207, 0.1) 0%, transparent 60%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative' }}>
        <Typography variant="h1" sx={{ color: '#ffffff', mb: 1 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
            {subtitle}
          </Typography>
        )}
      </Container>
    </Box>
  );
}
