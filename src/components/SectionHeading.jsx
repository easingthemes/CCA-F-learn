import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

/**
 * SectionHeading — full-width heading band with its own background.
 * Use as a visual separator before a Section.
 *
 * @param {string} title
 * @param {string} subtitle
 * @param {string} badge
 * @param {string} badgeColor
 * @param {string} bg       — 'default' | 'alt' | 'primary' | any CSS value
 * @param {string} align    — 'center' | 'left'
 */
export default function SectionHeading({
  title,
  subtitle,
  badge,
  badgeColor = 'primary',
  bg = 'alt',
  align = 'center',
  quick = false,
  printBreak = true,
}) {
  const bgMap = {
    default: 'background.default',
    alt: 'background.alt',
    primary: 'primary.main',
  };

  const bgColor = bgMap[bg] || bg;
  const light = bg === 'primary';

  return (
    <Box
      {...(printBreak && { 'data-print': 'page-break' })}
      sx={{
        bgcolor: bgColor,
        py: { xs: 5, md: 6 },
        px: { xs: 2, md: 3 },
        '@media print': {
          py: 1.5,
          breakAfter: 'avoid',
          breakInside: 'avoid',
          printColorAdjust: 'exact',
          WebkitPrintColorAdjust: 'exact',
        },
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: align }}>
          {badge && (
            <Chip
              label={badge}
              color={light ? 'secondary' : badgeColor}
              size="small"
              variant="outlined"
              sx={{
                mb: 1.5,
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontSize: '0.7rem',
                ...(light && { borderColor: 'rgba(255,255,255,0.3)', color: 'secondary.main' }),
              }}
            />
          )}
          <Typography
            variant="h2"
            sx={{ color: light ? '#ffffff' : 'text.primary' }}
          >
            {title}
            {quick && (
              <Box
                component="span"
                sx={{
                  ml: 1,
                  fontSize: '0.5em',
                  verticalAlign: 'super',
                  color: light ? 'rgba(255,255,255,0.4)' : 'text.disabled',
                  fontWeight: 400,
                }}
              >
                *
              </Box>
            )}
          </Typography>
          {subtitle && (
            <Typography
              variant="body1"
              sx={{ color: light ? 'rgba(255,255,255,0.8)' : 'text.secondary', mt: 1 }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
}
