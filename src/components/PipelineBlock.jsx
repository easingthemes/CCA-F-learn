import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

/**
 * PipelineBlock — command + visual flow steps in one block.
 *
 * @param {string} label — e.g. "Full Pipeline", "One Command"
 * @param {string} command — e.g. "/dx-agent-all <ADO-Story-ID>"
 * @param {string} description — optional text below the command
 * @param {Array} steps — [{title, subtitle, command, color}]
 */
export default function PipelineBlock({ label, command, description, steps = [] }) {
  const STEP_WIDTH = 130;

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
        my: 2,
        '@media print': { breakInside: 'avoid' },
      }}
    >
      {/* Command header — only when command is provided */}
      {(command || label) && (
        <Box
          sx={{
            bgcolor: 'rgba(0,0,0,0.03)',
            borderBottom: steps.length ? '1px solid' : 'none',
            borderColor: 'divider',
            py: command ? 2 : 1,
            px: 3,
          }}
        >
          {label && (
            <Typography
              variant="overline"
              sx={{ display: 'block', color: 'text.muted', fontSize: '0.7rem', mb: command ? 0.5 : 0 }}
            >
              {label}
            </Typography>
          )}
          {command && (
            <Box
              component="code"
              sx={{
                fontFamily: 'mono',
                fontSize: '1rem',
                fontWeight: 600,
                color: 'primary.main',
                background: 'none',
                p: 0,
              }}
            >
              {command}
            </Box>
          )}
          {description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {description}
            </Typography>
          )}
        </Box>
      )}

      {/* Flow steps */}
      {steps.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'stretch',
            gap: 1.5,
            p: 2,
          }}
        >
          {steps.map((step, i) => (
            <Box
              key={i}
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
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
                <ArrowForwardIcon
                  sx={{ ml: 1.5, color: 'text.muted', fontSize: '0.9rem', flexShrink: 0 }}
                />
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
