import { useEffect } from 'react';
import { useParams, Link as RouterLink, useLocation } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MuiLink from '@mui/material/Link';
import SchoolOutlined from '@mui/icons-material/SchoolOutlined';
import BuildOutlined from '@mui/icons-material/BuildOutlined';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Chip from '@mui/material/Chip';

import { getDomain } from '../data/examData';
import {
  PageHero,
  Section,
  SectionHeading,
  ContentCard,
  HighlightBox,
  ImageLightbox,
} from '../components';
import { useProgress } from '../hooks/useProgress';

// Map project name prefixes (as used in myProjectRefs strings) to project IDs
const PROJECT_ID_MAP = {
  'DX Plugins': 'dx-plugins',
  'AEM MCP': 'aem-mcp',
  'MoltBook MCP': 'moltbook',
  'KI-Bundestag': 'ki-bundestag',
};

/**
 * Extract the project key from a myProjectRef string.
 * Strings follow the pattern "ProjectName: description text"
 */
function extractProjectKey(ref) {
  const colonIdx = ref.indexOf(':');
  if (colonIdx === -1) return null;
  const prefix = ref.slice(0, colonIdx).trim();
  return PROJECT_ID_MAP[prefix] || null;
}

export default function DomainPage() {
  const { id } = useParams();
  const domain = getDomain(id);
  const { getStatus, setStatus } = useProgress();
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hash]);

  if (!domain) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h2" sx={{ mb: 2 }}>
          Domain not found
        </Typography>
        <MuiLink component={RouterLink} to="/">
          Back to Home
        </MuiLink>
      </Box>
    );
  }

  // Collect all myProjectRefs from all task statements into a flat list
  const allProjectRefs = domain.taskStatements.flatMap(
    (ts) => ts.myProjectRefs || []
  );

  // Derive unique project IDs from refs
  const uniqueProjectIds = [
    ...new Set(
      allProjectRefs.map(extractProjectKey).filter(Boolean)
    ),
  ];

  return (
    <>
      {/* 1. PageHero */}
      <PageHero
        title={domain.name}
        subtitle={`${domain.weight}% of exam · ${domain.taskStatements.filter((ts) => getStatus(`task:${domain.id}:${ts.id}`, false)).length}/${domain.taskStatements.length} task statements reviewed`}
      />

      {/* 2. Your Projects callout */}
      {uniqueProjectIds.length > 0 && (
        <Section>
          <HighlightBox severity="info">
            <Typography variant="h3" sx={{ mb: 1, fontSize: '1rem' }}>
              Your Projects
            </Typography>
            {uniqueProjectIds.map((projectId) => (
              <Box key={projectId} sx={{ mb: 0.5 }}>
                <MuiLink component={RouterLink} to={`/my-projects/${projectId}`}>
                  {projectId}
                </MuiLink>
              </Box>
            ))}
          </HighlightBox>
        </Section>
      )}

      {/* 3. Task Statements */}
      {domain.taskStatements.map((ts) => (
        <Box key={ts.id} id={`task-${ts.id}`}>
          <SectionHeading
            badge={`Task ${ts.id}`}
            title={ts.title}
            bg="alt"
          />

          <Section>
            {/* Review toggle */}
            <Chip
              label={getStatus(`task:${domain.id}:${ts.id}`, false) ? '✅ Reviewed' : '⬜ Mark as Reviewed'}
              onClick={() => setStatus(`task:${domain.id}:${ts.id}`, !getStatus(`task:${domain.id}:${ts.id}`, false))}
              sx={{
                cursor: 'pointer',
                bgcolor: getStatus(`task:${domain.id}:${ts.id}`, false) ? '#e8f5e9' : 'transparent',
                border: getStatus(`task:${domain.id}:${ts.id}`, false) ? '1px solid #4caf50' : '1px solid #ddd',
                fontWeight: 600,
                fontSize: '0.78rem',
                mb: 2,
              }}
            />
            <Grid container spacing={3} columns={12}>
              <Grid size={{ xs: 12, md: 6 }}>
                <ContentCard
                  icon={<SchoolOutlined />}
                  title="Knowledge"
                >
                  <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                    {(ts.knowledge || []).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </ContentCard>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <ContentCard
                  icon={<BuildOutlined />}
                  title="Skills"
                >
                  <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                    {(ts.skills || []).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </ContentCard>
              </Grid>
            </Grid>

            {/* Anti-Patterns */}
            {ts.antiPatterns && ts.antiPatterns.length > 0 && (
              <HighlightBox severity="warning" title="Anti-Patterns">
                <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                  {ts.antiPatterns.map((ap, i) => (
                    <li key={i}>{ap}</li>
                  ))}
                </ul>
              </HighlightBox>
            )}

            {/* Tool Description Examples (Task 2.1) */}
            {ts.toolDescriptionExamples && ts.toolDescriptionExamples.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h3" sx={{ mb: 1, fontSize: '0.95rem', fontWeight: 600 }}>
                  Tool Description Pattern Examples
                </Typography>
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, width: '30%' }}>Pattern Level</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Example</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ts.toolDescriptionExamples.map((ex, i) => (
                        <TableRow key={i}>
                          <TableCell>{ex.level}</TableCell>
                          <TableCell><code style={{ fontSize: '0.8rem' }}>{ex.example}</code></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Rule Path Examples (Task 3.3) */}
            {ts.rulePathExamples && ts.rulePathExamples.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h3" sx={{ mb: 1, fontSize: '0.95rem', fontWeight: 600 }}>
                  Rule File Path Patterns (DX Plugins)
                </Typography>
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Rule File</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Paths Scope</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Enforces</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {ts.rulePathExamples.map((r, i) => (
                        <TableRow key={i}>
                          <TableCell><code>{r.rule}</code></TableCell>
                          <TableCell><code style={{ fontSize: '0.8rem' }}>{r.paths}</code></TableCell>
                          <TableCell>{r.enforces}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Your Implementation */}
            {ts.myProjectRefs && ts.myProjectRefs.length > 0 && (
              <HighlightBox severity="info" title="Your Implementation">
                <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                  {ts.myProjectRefs.map((ref, i) => {
                    const projectId = extractProjectKey(ref);
                    const colonIdx = ref.indexOf(':');
                    const projectName =
                      colonIdx !== -1 ? ref.slice(0, colonIdx).trim() : ref;
                    const description =
                      colonIdx !== -1 ? ref.slice(colonIdx + 1).trim() : '';
                    return (
                      <li key={i}>
                        {projectId ? (
                          <MuiLink
                            component={RouterLink}
                            to={`/my-projects/${projectId}`}
                          >
                            {projectName}
                          </MuiLink>
                        ) : (
                          <strong>{projectName}</strong>
                        )}
                        {description && `: ${description}`}
                      </li>
                    );
                  })}
                </ul>
              </HighlightBox>
            )}

            {/* Tested In Quiz */}
            {ts.quizRefs && ts.quizRefs.length > 0 && (
              <HighlightBox severity="success" title="Tested In Quiz">
                <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                  {ts.quizRefs.map((ref, i) => (
                    <li key={i}>
                      <MuiLink component={RouterLink} to={`/practice-quiz/${ref.section}`}>
                        {ref.label}
                      </MuiLink>
                    </li>
                  ))}
                </ul>
              </HighlightBox>
            )}
          </Section>
        </Box>
      ))}

      {/* 4. Playbook References */}
      {domain.playbookRefs && domain.playbookRefs.length > 0 && (
        <>
          <SectionHeading title="Playbook Visual References" bg="alt" />
          <Section>
            <Grid container spacing={3}>
              {domain.playbookRefs.map((ref, i) => (
                <Grid key={i} size={{ xs: 12, md: ref.image ? 6 : 12 }}>
                  {ref.image ? (
                    <ImageLightbox
                      src={ref.image}
                      alt={ref.title}
                      label={`p${ref.page}: ${ref.title}`}
                    />
                  ) : (
                    <Typography variant="body2">
                      p{ref.page}: {ref.title}
                    </Typography>
                  )}
                </Grid>
              ))}
            </Grid>
            <Typography variant="caption" sx={{ mt: 2, display: 'block', color: 'text.muted' }}>
              Diagrams from a community-created Architect&apos;s Playbook, shared via{' '}
              <a href="https://drive.google.com/file/d/1luC0rnrET4tDYtS7xe5jUxMDZA-4qNf-/view?usp=sharing" target="_blank" rel="noopener noreferrer">Google Drive</a>.
              {' '}Source:{' '}
              <a href="https://www.reddit.com/r/ClaudeAI/comments/1ruf70b/just_passed_the_new_claude_certified_architect/" target="_blank" rel="noopener noreferrer">r/ClaudeAI</a>.
            </Typography>
          </Section>
        </>
      )}
    </>
  );
}
