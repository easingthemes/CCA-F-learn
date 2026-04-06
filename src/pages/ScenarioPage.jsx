import { useParams, Link as RouterLink } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MuiLink from '@mui/material/Link';

import { getScenario, getDomain } from '../data/examData';
import {
  PageHero,
  Section,
  SectionHeading,
  ContentCard,
} from '../components';
import { useProgress } from '../hooks/useProgress';

export default function ScenarioPage() {
  const { id } = useParams();
  const scenario = getScenario(id);
  const { getStatus, toggleChecked } = useProgress();

  if (!scenario) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h2" sx={{ mb: 2 }}>
          Scenario not found
        </Typography>
        <MuiLink component={RouterLink} to="/">
          Back to Home
        </MuiLink>
      </Box>
    );
  }

  const checkedCount = scenario.checklist.filter((_, i) =>
    getStatus(`scenario:${scenario.id}:${i}`, false)
  ).length;

  return (
    <>
      {/* 1. PageHero */}
      <PageHero
        title={scenario.name}
        subtitle={`${checkedCount}/${scenario.checklist.length} checklist items completed`}
      />

      {/* 2. Context */}
      <Section>
        <Typography variant="body1">{scenario.context}</Typography>
      </Section>

      {/* 3. Domains Tested */}
      <SectionHeading title="Domains Tested" />
      <Section>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {scenario.domains.map((domainId) => {
            const domain = getDomain(domainId);
            if (!domain) return null;
            return (
              <MuiLink
                key={domainId}
                component={RouterLink}
                to={`/domains/${domain.id}`}
                underline="none"
              >
                <Chip
                  label={domain.name}
                  sx={{ bgcolor: domain.color, color: '#fff', cursor: 'pointer' }}
                />
              </MuiLink>
            );
          })}
        </Box>
      </Section>

      {/* 4. Key Concepts */}
      <SectionHeading title="Key Concepts" />
      <Section>
        <Grid container spacing={3} columns={12}>
          {scenario.keyConcepts.map((concept, i) => (
            <Grid key={i} size={{ xs: 12, md: 6 }}>
              <ContentCard title={concept.title}>
                <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                  {concept.points.map((point, j) => (
                    <li key={j}>{point}</li>
                  ))}
                </ul>
              </ContentCard>
            </Grid>
          ))}
        </Grid>
      </Section>

      {/* 5. Study Checklist */}
      <SectionHeading title="Study Checklist" />
      <Section>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {scenario.checklist.map((item, i) => {
            const key = `scenario:${scenario.id}:${i}`;
            const checked = getStatus(key, false);
            return (
              <FormControlLabel
                key={i}
                control={
                  <Checkbox
                    checked={checked}
                    onChange={() => toggleChecked(key)}
                    color="success"
                  />
                }
                label={item.text}
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontSize: '0.875rem',
                    textDecoration: checked ? 'line-through' : 'none',
                    color: checked ? 'text.secondary' : 'text.primary',
                  },
                }}
              />
            );
          })}
        </Box>
      </Section>
    </>
  );
}
