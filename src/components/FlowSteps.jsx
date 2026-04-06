import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

/**
 * FlowSteps — horizontal flow diagram with fixed-size boxes.
 *
 * @param {Array} steps — [{title, subtitle, command, color}]
 */
export default function FlowSteps({ steps }) {
  const STEP_WIDTH = 130;

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'stretch',
        gap: 1.5,
        my: 3,
        '@media print': { breakInside: 'avoid', my: 1, gap: 1 },
      }}
    >
      {steps.map((step, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              border: '1px solid',
              borderColor: step.color || 'divider',
              borderRadius: 1,
              textAlign: 'center',
              width: STEP_WIDTH,
              bgcolor: 'background.paper',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Title — header */}
            <Typography
              sx={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'primary.main',
                px: 1.5,
                pt: 1,
                pb: 0.5,
              }}
            >
              {step.title}
            </Typography>
            {/* Description — middle content */}
            {step.subtitle && (
              <Typography
                sx={{
                  fontSize: '0.7rem',
                  color: 'text.secondary',
                  lineHeight: 1.4,
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  whiteSpace: 'pre-line',
                  px: 1.5,
                  pb: 1,
                }}
              >
                {step.subtitle}
              </Typography>
            )}
            {/* Command — footer */}
            {step.command && (
              <Box
                sx={{
                  borderTop: '1px dashed',
                  borderColor: 'divider',
                  py: 0.5,
                  px: '5px',
                }}
              >
                <Box
                  component="code"
                  sx={{
                    fontSize: '0.65rem',
                    color: 'secondary.dark',
                    background: 'none',
                    p: 0,
                    display: 'block',
                  }}
                >
                  {step.command}
                </Box>
              </Box>
            )}
          </Box>
          {i < steps.length - 1 && (
            <ArrowForwardIcon sx={{ ml: 1.5, color: 'text.muted', fontSize: '0.9rem', flexShrink: 0 }} />
          )}
        </Box>
      ))}
    </Box>
  );
}
