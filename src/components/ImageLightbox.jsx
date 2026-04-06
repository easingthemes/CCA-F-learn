import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

/**
 * ImageLightbox — flat image with optional label, click to fullscreen.
 */
export default function ImageLightbox({ src, alt, label, sx = {} }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box
        sx={{ textAlign: 'center', cursor: 'pointer', ...sx }}
        onClick={() => setOpen(true)}
      >
        {label && (
          <Typography
            variant="overline"
            sx={{ display: 'block', mb: 0.5, color: 'text.secondary', fontWeight: 600 }}
          >
            {label}
          </Typography>
        )}
        <Box
          component="img"
          src={src}
          alt={alt || label || ''}
          sx={{
            width: '100%',
            display: 'block',
            border: '1px solid',
            borderColor: 'divider',
            '@media print': {
              maxWidth: '100%',
            },
          }}
        />
      </Box>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0,0,0,0.85)',
            p: 3,
          }}
          onClick={() => setOpen(false)}
        >
          <IconButton
            sx={{ position: 'absolute', top: 16, right: 16, color: '#ffffff' }}
            onClick={() => setOpen(false)}
          >
            <CloseIcon />
          </IconButton>
          <Box
            component="img"
            src={src}
            alt={alt || label || ''}
            sx={{ maxWidth: '90vw', maxHeight: '90vh' }}
          />
        </Box>
      </Modal>
    </>
  );
}
