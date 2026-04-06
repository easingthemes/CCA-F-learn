import { useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { questions, domains } from '../data/examData';
import { PageHero, QuestionCard } from '../components';
import { useProgress } from '../hooks/useProgress';

export default function Practice() {
  const [activeFilter, setActiveFilter] = useState('all');
  const { getStatus } = useProgress();

  const answered = questions.filter((q) => getStatus(`practice:${q.id}`)).length;
  const correct = questions.filter((q) => getStatus(`practice:${q.id}:correct`)).length;

  const filtered =
    activeFilter === 'all'
      ? questions
      : questions.filter((q) => q.domain === activeFilter);

  return (
    <>
      <PageHero
        title="Practice Questions"
        subtitle={`${answered}/${questions.length} answered · ${correct} correct`}
      />
      <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          <Chip
            label="All"
            onClick={() => setActiveFilter('all')}
            variant={activeFilter === 'all' ? 'filled' : 'outlined'}
            color="primary"
          />
          {domains.map((d) => (
            <Chip
              key={d.id}
              label={d.id.toUpperCase()}
              onClick={() => setActiveFilter(d.id)}
              variant={activeFilter === d.id ? 'filled' : 'outlined'}
              color="primary"
            />
          ))}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {filtered.length} question{filtered.length !== 1 ? 's' : ''}
        </Typography>
        {filtered.map((q) => (
          <QuestionCard
            key={q.id}
            id={q.id}
            question={q.question}
            options={q.options}
            explanation={q.explanation}
            domain={q.domain}
          />
        ))}
      </Box>
    </>
  );
}
