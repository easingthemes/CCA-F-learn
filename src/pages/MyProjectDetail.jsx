import { useParams, Link as RouterLink } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import MuiLink from '@mui/material/Link';

import { getProject, getDomain } from '../data/examData';
import { getLearningsByProject } from '../data/learningsData';
import {
  PageHero,
  Section,
  SectionHeading,
  ContentCard,
  HighlightBox,
  CommandBlock,
} from '../components';

export default function MyProjectDetail() {
  const { id } = useParams();
  const project = getProject(id);
  const learnings = getLearningsByProject(id);

  if (!project) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h2" sx={{ mb: 2 }}>
          Project not found
        </Typography>
        <MuiLink component={RouterLink} to="/my-projects">
          Back to My Projects
        </MuiLink>
      </Box>
    );
  }

  return (
    <>
      {/* 1. PageHero */}
      <PageHero
        title={project.name}
        subtitle={`Repository: ${project.repo}`}
      />

      {/* 2. Domain Chips */}
      <Section>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {project.domains.map((domainId) => {
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

      {/* 3. Learnings */}
      {learnings.length > 0 && (
        <>
          <SectionHeading
            badge="Deep Dives"
            title="Learnings"
            bg="alt"
          />
          <Section>
            <Grid container spacing={2}>
              {learnings.map((learning) => (
                <Grid key={learning.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <ContentCard
                    title={learning.title.replace(/^(Domain \d+|Cross-Cutting): /, '')}
                    tags={[learning.domain, learning.weight].filter(Boolean).map(t => ({ label: t }))}
                    onClick={() => {}}
                  >
                    <MuiLink
                      component={RouterLink}
                      to={`/my-projects/${id}/learnings/${learning.id}`}
                      underline="hover"
                      sx={{ fontWeight: 600 }}
                    >
                      Read learning →
                    </MuiLink>
                  </ContentCard>
                </Grid>
              ))}
            </Grid>
          </Section>
        </>
      )}

      {/* 4. Sections */}
      {project.sections.map((section, i) => (
        <Box key={i}>
          <SectionHeading
            badge={section.examDomain}
            title={section.examConcept}
            bg="alt"
          />
          <Section>
            <ContentCard>
              {section.implementation}
            </ContentCard>
            {section.links && section.links.length > 0 && (
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {section.links.map((link, j) => (
                  <Chip
                    key={j}
                    label={link.label}
                    component="a"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    clickable
                    variant="outlined"
                    size="small"
                    sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                  />
                ))}
              </Box>
            )}
            {section.code && (
              <CommandBlock label="Code Example">
                {section.code}
              </CommandBlock>
            )}
          </Section>
        </Box>
      ))}
    </>
  );
}
