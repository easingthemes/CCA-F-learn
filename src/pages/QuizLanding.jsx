import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';

import { PageHero, Section } from '../components';
import { useProgress } from '../hooks/useProgress';
import { quizSections, getAllQuizStats } from '../data/quizData';

// ─── sub-components ─────────────────────────────────────────────────────────

function SectionCard({ section, getStatus }) {
  const best = getStatus(`quiz:${section.id}:best`, null);
  const scoreLabel = best ? `${best.score}/${best.total}` : 'Not attempted';

  return (
    <Card
      sx={{
        height: '100%',
        border: `2px solid ${section.color}22`,
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: `0 4px 20px ${section.color}44` },
      }}
    >
      <CardActionArea
        component={Link}
        to={`/practice-quiz/${section.id}`}
        sx={{ height: '100%', alignItems: 'flex-start' }}
      >
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Typography
            variant="overline"
            sx={{
              color: section.color,
              fontWeight: 700,
              letterSpacing: '0.08em',
              lineHeight: 1.4,
            }}
          >
            Scenario {section.id.replace('s', '')}
          </Typography>
          <Typography
            variant="h3"
            sx={{ fontWeight: 700, mb: 1, fontSize: '0.95rem' }}
          >
            {section.shortTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {section.questions.length} questions
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: best ? 'success.main' : 'text.secondary',
              fontSize: '0.82rem',
            }}
          >
            Best: {scoreLabel}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function StatsBar({ getStatus }) {
  const stats = getAllQuizStats(getStatus);
  const accuracy =
    stats.sectionsCompleted > 0
      ? `${Math.round((stats.totalScore / stats.totalQuestions) * 100)}%`
      : '\u2014';

  const items = [
    { label: 'Total Best Score', value: `${stats.totalScore}/${stats.totalQuestions}` },
    { label: 'Sections Completed', value: `${stats.sectionsCompleted}/${stats.totalSections}` },
    { label: 'Best Accuracy', value: accuracy },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: { xs: 3, md: 6 },
        flexWrap: 'wrap',
        py: 3,
        px: 2,
        bgcolor: 'background.alt',
        borderRadius: 2,
      }}
    >
      {items.map((item) => (
        <Box key={item.label} sx={{ textAlign: 'center' }}>
          <Typography
            sx={{ fontSize: '1.6rem', fontWeight: 800, color: 'primary.main', lineHeight: 1.2 }}
          >
            {item.value}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.72rem' }}>
            {item.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

// ─── main page ───────────────────────────────────────────────────────────────

export default function QuizLanding() {
  const { getStatus } = useProgress();

  return (
    <>
      <PageHero
        title="Practice Quiz"
        subtitle="CCA-F Study Questions &middot; 4 Scenarios &middot; 58 Questions"
      />

      <Section sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={2.5}>
          {quizSections.map((section) => (
            <Grid key={section.id} size={{ xs: 12, sm: 6 }}>
              <SectionCard section={section} getStatus={getStatus} />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4 }}>
          <StatsBar getStatus={getStatus} />
        </Box>
      </Section>
    </>
  );
}
