import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

/**
 * Section — main layout wrapper.
 *
 * @param {boolean} fullWidth — edge-to-edge, no container
 * @param {string}  bg        — 'default' | 'alt' | 'primary' | any CSS value
 * @param {string}  maxWidth  — Container maxWidth
 */
export default function Section({
  children,
  fullWidth = false,
  bg = 'default',
  maxWidth = 'lg',
  sx = {},
  ...props
}) {
  const bgMap = {
    default: 'background.default',
    alt: 'background.alt',
    primary: 'primary.main',
  };

  const bgColor = bgMap[bg] || bg;
  const isLight = bg !== 'primary';

  return (
    <Box
      component="section"
      sx={{
        bgcolor: bgColor,
        color: isLight ? 'text.primary' : '#ffffff',
        py: { xs: 6, md: 8 },
        px: { xs: 2, md: 3 },
        '@media print': { py: 1.5, px: 1 },
        ...sx,
      }}
      {...props}
    >
      {fullWidth ? children : <Container maxWidth={maxWidth}>{children}</Container>}
    </Box>
  );
}
