import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

/**
 * CommandBlock — styled code/command display.
 *
 * @param {string} label — e.g. "Run in Claude Code"
 * @param {string} children — the command text
 */
export default function CommandBlock({ label, children }) {
  return (
    <Box
      sx={{
        bgcolor: 'rgba(0,0,0,0.03)',
        borderLeft: '3px solid',
        borderColor: 'secondary.main',
        borderRadius: '0 8px 8px 0',
        py: 1.5,
        px: 2,
        my: 1.5,
        fontFamily: 'mono',
        fontSize: '0.9rem',
      }}
    >
      {label && (
        <Typography
          variant="overline"
          sx={{ display: 'block', color: 'text.muted', fontSize: '0.7rem', mb: 0.25, fontFamily: 'inherit' }}
        >
          {label}
        </Typography>
      )}
      <Box component="pre" sx={{ background: 'none', p: 0, m: 0, color: 'primary.main', fontSize: 'inherit', fontFamily: 'inherit', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {children}
      </Box>
    </Box>
  );
}
