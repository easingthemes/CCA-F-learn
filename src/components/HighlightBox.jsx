import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

/**
 * HighlightBox — callout box using MUI Alert.
 */
export default function HighlightBox({ severity = 'info', title, children, sx = {} }) {
  return (
    <Alert
      severity={severity}
      icon={false}
      sx={{
        py: 2,
        px: 2.5,
        my: 3,
        '& .MuiAlert-message': { width: '100%' },
        '@media print': { breakInside: 'avoid', printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' },
        ...sx,
      }}
    >
      {title && (
        <Typography variant="h3" sx={{ mb: 1, fontSize: '1rem' }}>
          {title}
        </Typography>
      )}
      <Typography variant="body2" color="text.secondary" component="div">
        {children}
      </Typography>
    </Alert>
  );
}
