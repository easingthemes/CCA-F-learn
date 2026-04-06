import { useParams, Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import MuiLink from '@mui/material/Link';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { getLearning, getLearningsByProject } from '../data/learningsData';
import { PageHero, Section } from '../components';
import MarkdownContent from '../components/MarkdownContent';

export default function LearningPage() {
  const { projectId, learningId } = useParams();
  const learning = getLearning(learningId);
  const allLearnings = getLearningsByProject(projectId);

  if (!learning) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h2" sx={{ mb: 2 }}>Learning not found</Typography>
        <MuiLink component={RouterLink} to={`/my-projects/${projectId}`}>
          Back to project
        </MuiLink>
      </Box>
    );
  }

  const currentIdx = allLearnings.findIndex((l) => l.id === learningId);
  const prev = currentIdx > 0 ? allLearnings[currentIdx - 1] : null;
  const next = currentIdx < allLearnings.length - 1 ? allLearnings[currentIdx + 1] : null;

  return (
    <>
      <PageHero
        title={learning.title}
        subtitle={[learning.domain, learning.weight].filter(Boolean).join(' · ')}
      />

      <Section>
        <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
          <Chip
            label={`← ${projectId}`}
            component={RouterLink}
            to={`/my-projects/${projectId}`}
            clickable
            size="small"
            variant="outlined"
          />
          {learning.domain !== 'Cross-cutting' && (
            <Chip
              label={learning.domain}
              size="small"
              sx={{ bgcolor: 'primary.main', color: '#fff' }}
            />
          )}
          {learning.weight && (
            <Chip label={`Exam weight: ${learning.weight}`} size="small" variant="outlined" />
          )}
        </Box>

        <MarkdownContent content={learning.content} />

        {/* Prev / Next navigation */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 6,
            pt: 3,
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          {prev ? (
            <Button
              component={RouterLink}
              to={`/my-projects/${projectId}/learnings/${prev.id}`}
              startIcon={<ArrowBackIcon />}
              size="small"
            >
              {prev.title.replace(/^(Domain \d+|Cross-Cutting): /, '')}
            </Button>
          ) : (
            <Box />
          )}
          {next ? (
            <Button
              component={RouterLink}
              to={`/my-projects/${projectId}/learnings/${next.id}`}
              endIcon={<ArrowForwardIcon />}
              size="small"
            >
              {next.title.replace(/^(Domain \d+|Cross-Cutting): /, '')}
            </Button>
          ) : (
            <Box />
          )}
        </Box>
      </Section>
    </>
  );
}
