import { useParams, Navigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableContainer,
  Paper,
  Grid,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { cheatsheets } from '../data/examData';
import {
  PageHero,
  Section,
  SectionHeading,
  ContentCard,
  CommandBlock,
  ImageLightbox,
} from '../components';

// ---------------------------------------------------------------------------
// Helper: group array by a key
// ---------------------------------------------------------------------------
function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const group = item[key];
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
}

// ---------------------------------------------------------------------------
// Patterns view
// ---------------------------------------------------------------------------
function PatternsView() {
  const grouped = groupBy(cheatsheets.patterns, 'domain');

  return (
    <>
      <PageHero title="Patterns vs Anti-Patterns" />
      <SectionHeading badge="Playbook" title="Visual References" bg="alt" />
      <Section>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <ImageLightbox src="/images/playbook/p2.jpg" alt="Designing Resilient Schemas" label="p2: Resilient Schemas" />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <ImageLightbox src="/images/playbook/p3.jpg" alt="Enforcing Mathematical Consistency" label="p3: Schema Redundancy" />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <ImageLightbox src="/images/playbook/p4.jpg" alt="The Limits of Automated Retry" label="p4: Limits of Retry" />
          </Grid>
        </Grid>
      </Section>
      {Object.entries(grouped).map(([domain, rows]) => (
        <Box key={domain}>
          <SectionHeading badge={domain} title={domain} bg="alt" />
          <Section>
            <TableContainer component={Paper} elevation={0} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, width: '50%' }}>Anti-Pattern</TableCell>
                    <TableCell sx={{ fontWeight: 700, width: '50%' }}>Correct Pattern</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell sx={{ bgcolor: '#ffebee' }}>{row.antiPattern}</TableCell>
                      <TableCell sx={{ bgcolor: '#e8f5e9' }}>{row.pattern}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Section>
        </Box>
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// Configs view
// ---------------------------------------------------------------------------
function ConfigsView() {
  const grouped = groupBy(cheatsheets.configs, 'category');

  return (
    <>
      <PageHero title="Key Configs & Flags" />
      {Object.entries(grouped).map(([category, rows]) => (
        <Box key={category}>
          <SectionHeading badge={category} title={category} bg="alt" />
          <Section>
            <TableContainer component={Paper} elevation={0} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, width: '28%' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 700, width: '36%' }}>Purpose</TableCell>
                    <TableCell sx={{ fontWeight: 700, width: '36%' }}>When to Use</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>
                        {row.name}
                      </TableCell>
                      <TableCell>{row.purpose}</TableCell>
                      <TableCell>{row.whenToUse}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Section>
        </Box>
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// Matrix view
// ---------------------------------------------------------------------------
function MatrixView() {
  const { constraints, domains, cells, hierarchyOfConstraints, productionBlueprint } =
    cheatsheets.matrix;

  return (
    <>
      <PageHero title="Architect Reference Matrix" />

      {/* Main constraint x domain matrix */}
      <Section>
        <TableContainer component={Paper} elevation={0} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }} />
                {domains.map((d) => (
                  <TableCell key={d} sx={{ fontWeight: 700 }}>
                    {d}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {constraints.map((constraint) => (
                <TableRow key={constraint}>
                  <TableCell sx={{ fontWeight: 600 }}>{constraint}</TableCell>
                  {domains.map((domain) => {
                    const value = cells[`${constraint}:${domain}`] || '';
                    const filled = value && value !== '—';
                    return (
                      <TableCell
                        key={domain}
                        sx={{ bgcolor: filled ? '#e8f5e9' : 'white' }}
                      >
                        {value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Section>

      {/* Hierarchy of Constraints */}
      {hierarchyOfConstraints && hierarchyOfConstraints.length > 0 && (
        <Box>
          <SectionHeading badge="Hierarchy" title="Hierarchy of Constraints" bg="alt" />
          <Section>
            <ImageLightbox
              src="/images/playbook/p1.jpg"
              alt="The Architect's Hierarchy of Constraints — radar chart"
              label="Playbook: Hierarchy of Constraints"
              sx={{ mb: 3 }}
            />
            <TableContainer component={Paper} elevation={0} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Constraint</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Mitigated By</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {hierarchyOfConstraints.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell sx={{ fontWeight: 600 }}>{row.constraint}</TableCell>
                      <TableCell>{row.mitigatedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Section>
        </Box>
      )}

      {/* Reference Matrix Image */}
      <Section>
        <ImageLightbox
          src="/images/playbook/p9.jpg"
          alt="The Architect's Reference Matrix"
          label="Playbook: Reference Matrix"
          sx={{ mb: 3 }}
        />
      </Section>

      {/* Production Blueprint */}
      {productionBlueprint && (
        <Box>
          <SectionHeading badge="Blueprint" title="Production Blueprint" bg="alt" />
          <Section>
            <ImageLightbox
              src="/images/playbook/p10.jpg"
              alt="The Production Architecture Blueprint"
              label="Playbook: Production Architecture Blueprint"
              sx={{ mb: 3 }}
            />
            <Grid container spacing={3}>
              {productionBlueprint.layers && productionBlueprint.layers.length > 0 && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <ContentCard
                    title="Architecture Layers"
                    body={
                      <Box component="ul" sx={{ m: 0, pl: 2 }}>
                        {productionBlueprint.layers.map((layer, i) => (
                          <Box component="li" key={i} sx={{ mb: 0.5 }}>
                            <Typography variant="body2">{layer}</Typography>
                          </Box>
                        ))}
                      </Box>
                    }
                  />
                </Grid>
              )}
              {productionBlueprint.principles && productionBlueprint.principles.length > 0 && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <ContentCard
                    title="Design Principles"
                    body={
                      <Box component="ul" sx={{ m: 0, pl: 2 }}>
                        {productionBlueprint.principles.map((p, i) => (
                          <Box component="li" key={i} sx={{ mb: 0.5 }}>
                            <Typography variant="body2">{p}</Typography>
                          </Box>
                        ))}
                      </Box>
                    }
                  />
                </Grid>
              )}
            </Grid>
          </Section>
        </Box>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Tips view
// ---------------------------------------------------------------------------
function TipsView() {
  return (
    <>
      <PageHero title="Community Tips" />
      <Section>
        <Grid container spacing={3}>
          {cheatsheets.communityTips.map((tip, i) => (
            <Grid key={i} size={{ xs: 12, md: 6 }}>
              <ContentCard
                title={tip.category}
                body={
                  <Box component="ul" sx={{ m: 0, pl: 2 }}>
                    {tip.points.map((point, j) => (
                      <Box component="li" key={j} sx={{ mb: 0.5 }}>
                        <Typography variant="body2">{point}</Typography>
                      </Box>
                    ))}
                  </Box>
                }
              />
            </Grid>
          ))}
        </Grid>
      </Section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
export default function CheatsheetPage() {
  const { id } = useParams();

  if (id === 'patterns') return <PatternsView />;
  if (id === 'configs') return <ConfigsView />;
  if (id === 'matrix') return <MatrixView />;
  if (id === 'tips') return <TipsView />;

  return <Navigate to="/" replace />;
}
