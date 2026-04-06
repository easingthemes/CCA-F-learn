import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

/**
 * Video — flat responsive video player with optional title and description.
 */
export default function Video({ src, fallback, title, description, sx = {} }) {
  return (
    <Card sx={{ overflow: 'hidden', ...sx }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        {title && (
          <Typography variant="h3" sx={{ mb: 0.5 }}>{title}</Typography>
        )}
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {description}
          </Typography>
        )}
        <Box
          component="video"
          controls
          playsInline
          sx={{
            width: '100%',
            display: 'block',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <source src={src} type="video/mp4" />
          {fallback && <source src={fallback} type="video/quicktime" />}
        </Box>
      </CardContent>
    </Card>
  );
}
