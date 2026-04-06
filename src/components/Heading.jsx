import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

/**
 * Heading — section title with optional badge and subtitle.
 */
export default function Heading({
  title,
  subtitle,
  badge,
  badgeColor = 'primary',
  align = 'center',
  light = false,
}) {
  return (
    <Box sx={{ textAlign: align, mb: 5, maxWidth: align === 'center' ? 700 : 'none', mx: align === 'center' ? 'auto' : 0 }}>
      {badge && (
        <Chip
          label={badge}
          color={badgeColor}
          size="small"
          variant="outlined"
          sx={{ mb: 1.5, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.7rem' }}
        />
      )}
      <Typography
        variant="h2"
        sx={{ color: light ? '#ffffff' : 'text.primary' }}
      >
        {title}
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
  );
}
