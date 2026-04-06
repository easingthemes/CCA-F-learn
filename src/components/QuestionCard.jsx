import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';

import { useProgress } from '../hooks/useProgress';

export default function QuestionCard({ id, question, options, explanation, domain }) {
  const { getStatus, setStatus } = useProgress();
  const savedAnswer = getStatus(`practice:${id}`);
  const [selected, setSelected] = useState(savedAnswer || null);
  const revealed = selected !== null;

  const handleSelect = (letter) => {
    if (revealed) return;
    setSelected(letter);
    setStatus(`practice:${id}`, letter);
    const isCorrect = options.find((o) => o.letter === letter)?.correct;
    setStatus(`practice:${id}:correct`, !!isCorrect);
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <Chip label={domain} size="small" color="primary" variant="outlined" />
          {revealed && (
            <Chip
              label={getStatus(`practice:${id}:correct`) ? 'Correct' : 'Incorrect'}
              size="small"
              sx={{
                bgcolor: getStatus(`practice:${id}:correct`) ? '#e8f5e9' : '#ffebee',
                color: getStatus(`practice:${id}:correct`) ? '#2e7d32' : '#c62828',
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            />
          )}
        </Box>
        <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>{question}</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {options.map((opt) => {
            let bgcolor = 'transparent';
            let borderColor = 'divider';
            if (revealed && opt.correct) { bgcolor = '#e8f5e9'; borderColor = '#4caf50'; }
            if (revealed && selected === opt.letter && !opt.correct) { bgcolor = '#ffebee'; borderColor = '#f44336'; }
            return (
              <Button
                key={opt.letter}
                variant="outlined"
                onClick={() => handleSelect(opt.letter)}
                sx={{
                  justifyContent: 'flex-start', textTransform: 'none', textAlign: 'left',
                  bgcolor, borderColor, color: 'text.primary',
                  '&:hover': revealed ? {} : { bgcolor: 'action.hover' },
                }}
              >
                <strong style={{ marginRight: 8, minWidth: 20 }}>{opt.letter}.</strong> {opt.text}
              </Button>
            );
          })}
        </Box>
        <Collapse in={revealed}>
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.alt', borderRadius: 1, borderLeft: '3px solid', borderColor: 'secondary.main' }}>
            <Typography variant="body2">{explanation}</Typography>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}
