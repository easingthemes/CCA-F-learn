import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

/**
 * ImageCompare — two images side by side, matched height.
 *
 * @param {string} leftSrc
 * @param {string} leftLabel
 * @param {string} rightSrc
 * @param {string} rightLabel
 * @param {number} height — fixed height in px (default 400)
 */
export default function ImageCompare({
  leftSrc,
  leftLabel,
  rightSrc,
  rightLabel,
  leftAlt,
  rightAlt,
  height = 400,
  sx = {},
}) {
  const [lightbox, setLightbox] = useState(null);

  const imgStyle = {
    width: '100%',
    height,
    objectFit: 'contain',
    display: 'block',
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: '#fafafa',
    cursor: 'pointer',
  };

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 3,
          ...sx,
        }}
      >
        <Box>
          {leftLabel && (
            <Typography variant="overline" sx={{ display: 'block', mb: 0.5, color: 'text.secondary', fontWeight: 600 }}>
              {leftLabel}
            </Typography>
          )}
          <Box
            component="img"
            src={leftSrc}
            alt={leftAlt || leftLabel || ''}
            onClick={() => setLightbox(leftSrc)}
            sx={imgStyle}
          />
        </Box>
        <Box>
          {rightLabel && (
            <Typography variant="overline" sx={{ display: 'block', mb: 0.5, color: 'text.secondary', fontWeight: 600 }}>
              {rightLabel}
            </Typography>
          )}
          <Box
            component="img"
            src={rightSrc}
            alt={rightAlt || rightLabel || ''}
            onClick={() => setLightbox(rightSrc)}
            sx={imgStyle}
          />
        </Box>
      </Box>

      <Modal open={!!lightbox} onClose={() => setLightbox(null)}>
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
          onClick={() => setLightbox(null)}
        >
          <IconButton
            sx={{ position: 'absolute', top: 16, right: 16, color: '#ffffff' }}
            onClick={() => setLightbox(null)}
          >
            <CloseIcon />
          </IconButton>
          {lightbox && (
            <Box
              component="img"
              src={lightbox}
              sx={{ maxWidth: '90vw', maxHeight: '90vh' }}
            />
          )}
        </Box>
      </Modal>
    </>
  );
}
