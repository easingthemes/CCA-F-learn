import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';

/**
 * ContentCard — MUI card with optional icon, title, body, and tags.
 *
 * @param {ReactNode} icon      — MUI icon element
 * @param {string}   iconColor — MUI color name
 * @param {string}   title
 * @param {ReactNode} children
 * @param {Array}    tags      — [{label, color}]
 * @param {boolean}  horizontal — icon left, content right
 */
export default function ContentCard({
  icon,
  iconColor = 'primary',
  title,
  children,
  tags,
  horizontal = false,
  sx = {},
}) {
  const iconAvatar = icon ? (
    <Avatar
      variant="rounded"
      sx={{
        bgcolor: `${iconColor}.main`,
        width: 40,
        height: 40,
        mb: horizontal ? 0 : 1.5,
      }}
    >
      {icon}
    </Avatar>
  ) : null;

  return (
    <Card sx={{ height: '100%', '@media print': { breakInside: 'avoid' }, ...sx }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 }, '@media print': { p: 1.5, '&:last-child': { pb: 1.5 } } }}>
        {horizontal ? (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            {iconAvatar}
            <Box sx={{ flex: 1 }}>
              {title && <Typography variant="h3">{title}</Typography>}
              <Typography variant="body2" color="text.secondary" component="div">{children}</Typography>
            </Box>
          </Box>
        ) : (
          <>
            {iconAvatar}
            {title && <Typography variant="h3">{title}</Typography>}
            <Typography variant="body2" color="text.secondary" component="div">{children}</Typography>
          </>
        )}
        {tags && (
          <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap', gap: 0.5 }}>
            {tags.map((tag, i) => (
              <Chip
                key={i}
                label={tag.label}
                size="small"
                color={tag.color || 'default'}
                variant="outlined"
                sx={{ fontFamily: 'mono', fontWeight: 600, fontSize: '0.75rem' }}
              />
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
